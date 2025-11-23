import uvicorn
import praw  # Reddit API Wrapper
import matplotlib.pyplot as plt
from wordcloud import WordCloud, STOPWORDS
from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
from io import BytesIO
import os
import re
import time
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
reddit_app = FastAPI()

# Ensure wordclouds folder exists for storing images
if not os.path.exists("wordclouds"):
    os.makedirs("wordclouds")

# Serve word cloud images as static files
reddit_app.mount("/wordclouds", StaticFiles(directory="wordclouds"), name="wordclouds")

# Reddit API Credentials
REDDIT_CLIENT_ID = "iJSsE8syoHXqCbPmpGCCcA"
REDDIT_CLIENT_SECRET = "dSwh5MTpDLRXFLmc2J_-70lz4o-Zsg"
REDDIT_USER_AGENT = "FootballSentimentAnalys (by u/AHAH000)"

# Initialize Reddit API
reddit = praw.Reddit(
    client_id=REDDIT_CLIENT_ID,
    client_secret=REDDIT_CLIENT_SECRET,
    user_agent=REDDIT_USER_AGENT,
    check_for_async=False
)

# Default stopwords
default_stopwords = set(STOPWORDS).union({"match", "thread", "game", "football", "team", "win", "lose", "player", "Mirror", "Mirrors"})

# Function to clean text
def clean_text(text):
    text = re.sub(r"http\S+", "", text)  # Remove URLs
    text = re.sub(r"\[removed\]|\[deleted\]", "", text)  # Remove deleted messages
    return text

# Function to delete old word clouds (older than 24 hours)
def cleanup_old_wordclouds():
    for file in os.listdir("wordclouds"):
        file_path = os.path.join("wordclouds", file)
        if os.path.isfile(file_path):
            file_age = time.time() - os.path.getctime(file_path)
            if file_age > 86400:  # 1 day
                os.remove(file_path)
                print(f"Deleted old word cloud: {file}")

# Predefined themes for word cloud styling
themes = {
    "dark": {"background_color": "black", "colormap": "inferno"},
    "light": {"background_color": "white", "colormap": "viridis"},
    "colorful": {"background_color": "white", "colormap": "rainbow"},
    "cool": {"background_color": "black", "colormap": "cool"},
    "sunset": {"background_color": "white", "colormap": "plasma"},
}

@reddit_app.get("/generate_wordcloud/{subreddit}/{match_keyword}")
@reddit_app.get("/generate_wordcloud/{subreddit}/{match_keyword}/{days_ago}")
def generate_wordcloud(
    subreddit: str,
    match_keyword: str,
    days_ago: int = 0,  # Default to latest posts
    exclude_words: Optional[List[str]] = Query(None),
    theme: str = "colorful"  # ✅ User can choose a theme
):
    """
    Generates a word cloud from Reddit match threads with enhanced visual design.
    """
    try:
        cleanup_old_wordclouds()

        subreddit_instance = reddit.subreddit(subreddit)
        target_date = datetime.utcnow() - timedelta(days=days_ago)

        match_threads = subreddit_instance.search(match_keyword, limit=10)

        text_data = ""
        for thread in match_threads:
            thread_date = datetime.utcfromtimestamp(thread.created_utc)
            if thread_date.date() == target_date.date():
                text_data += thread.title + " " + thread.selftext

                thread.comments.replace_more(limit=0)
                for comment in thread.comments.list()[:300]:
                    text_data += " " + comment.body

        text_data = clean_text(text_data)

        if not text_data.strip():
            return {"error": "No relevant comments found for this date."}

        # Apply user-defined stopwords
        if exclude_words:
            custom_stopwords = default_stopwords.union(set(exclude_words))
        else:
            custom_stopwords = default_stopwords

        # Choose word cloud theme
        selected_theme = themes.get(theme, themes["colorful"])

        # Generate Word Cloud with improved design
        wordcloud = WordCloud(
            width=1600,  # ✅ Increased resolution
            height=800,
            background_color=selected_theme["background_color"],  # ✅ Custom background color
            colormap=selected_theme["colormap"],  # ✅ Custom color scheme
            max_words=150,  # ✅ More words for a richer visualization
            stopwords=custom_stopwords,
            contour_color="black",  # ✅ Adds a black outline for contrast
            contour_width=3,  # ✅ Increased outline thickness
            prefer_horizontal=0.9,  # ✅ Better horizontal word placement
        ).generate(text_data)

        # Save the improved word cloud image
        file_name = f"wordcloud_{subreddit}_{match_keyword}_{days_ago}_{theme}.png"
        file_path = f"wordclouds/{file_name}"
        wordcloud.to_file(file_path)

        image_url = f"http://127.0.0.1:8002/wordclouds/{file_name}"
        return {"message": "Word Cloud generated successfully!", "image_url": image_url}

    except Exception as e:
        return {"error": str(e)}
    

# Allow CORS
reddit_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL e.g., ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

if __name__ == "__main__":
    uvicorn.run(reddit_app, host="0.0.0.0", port=8002)


