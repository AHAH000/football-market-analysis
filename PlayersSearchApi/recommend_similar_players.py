import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sklearn.preprocessing import MinMaxScaler
from sklearn.neighbors import NearestNeighbors
from datetime import datetime
import uvicorn

# Load dataset
file_path = "Final_Player_Data_With_Market_Value.csv"
df = pd.read_csv(file_path)

# Preprocess contract expiration to compute years remaining
current_year = datetime.now().year
df["contract_expiration_year"] = pd.to_numeric(df["contract_expiration_date"].str[-4:], errors='coerce')
df["contract_years_remaining"] = (df["contract_expiration_year"] - current_year).fillna(0).astype(int)

# Features used for similarity
search_features = ["age", "foot_Encoded", "height_in_cm", "contract_years_remaining"]

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (for your frontend to call this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Function to recommend players given a player_id ===
def recommend_similar_players(player_id: int, top_n: int = 5):
    if player_id not in df["player_id"].values:
        return {"error": f"Player ID {player_id} not found."}

    target_player = df[df["player_id"] == player_id].iloc[0]

    # Filter by same position and league for contextual similarity
    df_filtered = df[
        (df["position"] == target_player["position"]) &
        (df["current_club_domestic_competition_id"] == target_player["current_club_domestic_competition_id"])
    ].copy()

    if df_filtered.empty:
        return {"error": "No similar players found in same position and league."}

    # Normalize the features
    scaler = MinMaxScaler()
    df_scaled = df_filtered.copy()
    df_scaled[search_features] = scaler.fit_transform(df_scaled[search_features])

    # Prepare the input (target player features)
    input_data = scaler.transform([[
        target_player["age"],
        target_player["foot_Encoded"],
        target_player["height_in_cm"],
        target_player["contract_years_remaining"]
    ]])

    # Fit KNN model
    knn = NearestNeighbors(n_neighbors=top_n + 1, metric='euclidean')  # +1 to include the player himself
    knn.fit(df_scaled[search_features])

    distances, indices = knn.kneighbors(input_data)

    # Remove the player himself if in results
    recommendations = []
    for i in indices[0]:
        similar_player = df_filtered.iloc[i]
        if int(similar_player["player_id"]) == player_id:
            continue

        recommendations.append({
            "Player ID": int(similar_player["player_id"]),
            "Name": str(similar_player["first_name"]) + " " + str(similar_player["last_name"]),
            "Club": str(similar_player["current_club_name"]),
            "Market Value (€)": int(similar_player["highest_market_value_in_eur"]),
            "Age": int(similar_player["age"]),
            "Position": str(similar_player["position"]),
            "Sub-Position": str(similar_player.get("sub_position", "N/A")),
            "League": str(similar_player["current_club_domestic_competition_id"]),
            "Foot": str(similar_player["foot"]),
            "Height (cm)": int(similar_player["height_in_cm"]),
            "Contract Years Remaining": int(similar_player["contract_years_remaining"]),
            "image_url": similar_player.get("image_url", ""),
        })

        if len(recommendations) == top_n:
            break

    return {"Similar Players": recommendations}


# === API endpoint ===
@app.get("/similar_players/{player_id}")
def get_similar_players(player_id: int):
    return recommend_similar_players(player_id, top_n=5)


# === Start server (if running directly) ===
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
