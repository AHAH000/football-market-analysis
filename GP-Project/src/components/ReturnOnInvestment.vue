<template>
  <div>
    <!-- ROI Calculation Button -->
    <button class="roi-button" @click="showPopup = true; startCalculation()">
      Calculate ROI
    </button>

    <!-- ROI Pop-up -->
    <div v-if="showPopup" class="roi-overlay">
      <div class="roi-popup">
        <h2>Return on Investment</h2>

        <!-- Loading Animation -->
        <div v-if="calculating" class="loading-animation">
          <div class="spinner"></div>
          <p>Calculating ROI...</p>
        </div>

        <!-- ROI Result -->
        <div v-else>
          <p class="transfer-fee"><strong>Latest Transfer Fee Paid:</strong> €{{ formatCurrency(latestTransferFee) }}
          </p>
          <p class="market-value"><strong>Current Market Value:</strong> €{{ formatCurrency(currentMarketValue) }}</p>

          <p :class="roiClass">
            <strong>ROI:</strong> {{ roi !== null ? roi.toFixed(2) : "N/A" }}%
          </p>
        </div>
        <!-- ROI Chart -->
        <div class="roi-chart">
          <canvas ref="roiChartCanvas"></canvas>
        </div>
        <!-- Close Button -->
        <button class="close-btn" @click="showPopup = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  props: {
    playerId: Number,
    currentMarketValue: Number,
    latestTransferFee: Number
  },
  data() {
    return {
      showPopup: false,
      calculating: false,
      chart: null,
    };
  },
  computed: {
    roi() {
      if (!this.latestTransferFee || !this.currentMarketValue || this.latestTransferFee === 0) return null;
      return ((this.currentMarketValue - this.latestTransferFee) / this.latestTransferFee) * 100;
    },
    roiClass() {
      return this.roi > 0 ? "roi-positive" : this.roi < 0 ? "roi-negative" : "roi-neutral";
    }
  },
  methods: {
    formatCurrency(value) {
      return value ? value.toLocaleString() : "N/A";
    },
    startCalculation() {
      this.calculating = true;

      setTimeout(() => {
        this.calculating = false;

        this.$nextTick(() => {
          this.renderChart();
        });
      }, 2000);
    },

    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.roiChartCanvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Transfer Fee', 'Market Value'],
          datasets: [{
            label: 'Amount (€)',
            data: [this.latestTransferFee ?? 0, this.currentMarketValue ?? 0],
            backgroundColor: ['#ff4444', '#00ff55'],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `€${context.raw.toLocaleString()}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `€${value.toLocaleString()}`
              }
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
/* ROI Button */
.roi-button {
  background: #00ff55;
  color: #000;
  border: none;
  padding: 12px 20px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 6px;
  transition: 0.3s;
  display: block;
  margin: 20px auto;
}

.roi-button:hover {
  background: #009900;
}

/* Pop-up Overlay */
.roi-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-in-out;
  z-index: 999999;

}

/* Pop-up Box */
/* ROI Pop-up Box - Wider and More Responsive */
.roi-popup {
  background: #1a1a1a;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 85, 0.6);
  text-align: center;
  color: #fff;
  max-width: 600px;
  /* Increase width */
  width: 90%;
  /* Ensure responsiveness */
  animation: popIn 0.3s ease-in-out;
}

/* Ensure text content inside the pop-up is spaced well */
.roi-popup h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
}

.roi-popup p {
  font-size: 1.4rem;
  margin: 10px 0;
}

/* Adjust Close Button for better spacing */
.close-btn {
  background: #ff4444;
  color: #fff;
  border: none;
  padding: 12px 20px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 6px;
  margin-top: 20px;
  transition: 0.3s;
}

.close-btn:hover {
  background: #cc0000;
}

/* ROI Styling */
.roi-positive {
  color: #00ff55;
}

.roi-negative {
  color: #ff4444;
}

.roi-neutral {
  color: #bbb;
}

/* Loading Animation */
.loading-animation {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #fff;
  border-top: 4px solid #00ff55;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 10px auto;
}

/* Animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes popIn {
  from {
    transform: scale(0.8);
  }

  to {
    transform: scale(1);
  }
}

.roi-chart {
  margin-top: 20px;
  background-color: #2a2a2a;
  padding: 10px;
  border-radius: 8px;
}
.transfer-fee {
  color: #ff6b6b; /* Red tone for cost */
}

.market-value {
  color: #00ff55; /* Green tone for asset value */
}
.transfer-fee,
.market-value {
  font-weight: 600;
  font-size: 1.4rem;
}


</style>