const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const PlayerSchema = new mongoose.Schema({
    player_id: { type: Number, unique: true },
    current_club_id: Number,
    country_of_birth: String,
    city_of_birth: String,
    country_of_citizenship: String,
    date_of_birth: String,
    sub_position: String,
    foot: String,
    height_in_cm: Number,
    contract_expiration_date: String,
    agent_name: String,
    current_club_domestic_competition_id: { type: String, required: true },
    current_club_name: Number,
    market_value_in_eur: Number,
    highest_market_value_in_eur: Number,
    age: Number,
    Nationality: String,
    Name: String,
    XGBoost_predicted_values:Number,
    RFT_predicted_values:Number,

    image_url: { type: String }
}, { collection: 'PlayerFullInfo', timestamps: true });

// Apply auto-increment to player_id
PlayerSchema.plugin(AutoIncrement, { inc_field: 'player_id' });

module.exports = mongoose.model('Player', PlayerSchema);
