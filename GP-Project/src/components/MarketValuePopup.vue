<template>
  <div v-if="isOpen" class="market-popup-overlay" @click.self="closePopup">
    <div class="market-popup">
      <h2>Market Value Breakdown</h2>

      <div class="value-grid">
        <div class="value-item">
          <label>Transfer Markt Value</label>
          <span class="value green">€{{ formatCurrency(marketValue) }}</span>
        </div>

        <div class="value-item">
          <label>XGBoost Model Prediction</label>
          <span class="value blue">€{{ formatCurrency(xgboostPrediction) }}</span>
        </div>

        <div class="value-item">
          <label>Random Forrest & Linear model Prediction</label>
          <span class="value yellow">€{{ formatCurrency(rftPrediction) }}</span>
        </div>
      </div>

      <button class="close-btn" @click="closePopup">Close</button>
    </div>
  </div>
</template>

  
  <script>
  export default {
    props: {
      isOpen: Boolean,
      marketValue: Number,
      xgboostPrediction: Number,
      rftPrediction: Number,
    },
    watch: {
      isOpen(newVal) {
        console.log("MarketValuePopup isOpen changed:", newVal); // Debugging
      }
    },
    methods: {
      closePopup() {
        console.log("closePopup triggered!");
        this.$emit("close"); // Notify parent to close the popup
      },
      formatCurrency(value) {
        return value ? value.toLocaleString() : "N/A";
      }
    }
  };
  </script>
  
  <style scoped>
  .market-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(6px);
    animation: fadeIn 0.4s ease-out;
  }
  
  .market-popup {
    background: #121212;
    padding: 32px;
    border-radius: 18px;
    box-shadow: 0 0 25px rgba(0, 255, 85, 0.6);
    text-align: center;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    color: #fff;
    animation: slideIn 0.4s ease-out;
  }
  
  .market-popup h2 {
    font-size: 2rem;
    color: #00ff55;
    margin-bottom: 25px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }
  
  .value-grid {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 20px;
  }
  
  .value-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1e1e1e;
    padding: 12px 20px;
    border-radius: 10px;
    border: 1px solid #333;
  }
  
  .value-item label {
    font-weight: 600;
    font-size: 1.1rem;
    color: #ccc;
  }
  
  .value {
    font-size: 1.3rem;
    font-weight: bold;
  }
  
  .value.green {
    color: #00ff55;
  }
  
  .value.blue {
    color: #3399ff;
  }
  
  .value.yellow {
    color: #ffc107;
  }
  
  .close-btn {
    background: #00ff55;
    color: #000;
    border: none;
    padding: 12px 24px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.3s ease, transform 0.2s ease-in-out;
  }
  
  .close-btn:hover {
    background: #00cc44;
    transform: scale(1.05);
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  
  </style>
  