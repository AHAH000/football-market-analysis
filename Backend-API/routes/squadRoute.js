const express = require("express");
const Squad = require("../models/squad.model");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

// Save Squad
router.post("/save", authenticateToken, async (req, res) => {
  try {
    const { squadName, players, totalValue } = req.body;
    const userId = req.user.id;

    // ✅ Validate that players contain position info
    if (!players || !Array.isArray(players) || players.length === 0) {
      return res.status(400).json({ message: "Players array cannot be empty and must contain position data." });
    }

    console.log("🔍 Saving Squad:", { squadName, players, totalValue });

    const squad = new Squad({ squadName, players, totalValue, userId });
    await squad.save();

    res.status(201).json({ message: "Squad saved successfully", squad });
  } catch (err) {
    console.error("❌ Error Saving Squad:", err);
    res.status(500).json({ message: "Failed to save squad", error: err.message });
  }
});

// Get user's squads
router.get("/my-squads", authenticateToken, async (req, res) => {
  try {
    const squads = await Squad.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(squads);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch squads", error: err.message });
  }
});
router.delete("/delete/:squadId", authenticateToken, async (req, res) => {
    try {
      const { squadId } = req.params;
      const userId = req.user.id;
  
      // Find and delete only if the squad belongs to the user
      const squad = await Squad.findOneAndDelete({ _id: squadId, userId });
  
      if (!squad) {
        return res.status(404).json({ message: "Squad not found or unauthorized" });
      }
  
      res.status(200).json({ message: "Squad deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete squad", error: err.message });
    }
  });

module.exports = router;
