const mongoose = require("mongoose");

const SquadSchema = new mongoose.Schema({
  squadName: {
    type: String,
    required: true,
  },
  players: {
    type: Array,
    required: true,
  },
  totalValue: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Squad", SquadSchema);
