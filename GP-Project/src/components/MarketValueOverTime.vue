<template>
  <div class="value-history-container">
    <h3>📈 Market Value Over Time</h3>
    <div v-if="loading" class="loading-text">Loading chart...</div>
    <canvas v-show="!loading" ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  props: {
    playerId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      chart: null,
      loading: true
    };
  },
  async mounted() {
    await this.fetchMarketValueData();
  },
  methods: {
    async fetchMarketValueData() {
      try {
        const apiUrl = `${import.meta.env.VITE_TransferMarkt_Api_URL}/players/${this.playerId}/market_value`;
        const response = await axios.get(apiUrl);
        const history = response.data.marketValueHistory;

        if (history && history.length) {
          this.drawChart(history);
        }
      } catch (err) {
        console.error("Error fetching market value history:", err);
      } finally {
        this.loading = false;
      }
    },
    drawChart(history) {
      const labels = history.map(entry =>
        new Date(entry.date).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short"
        })
      );
      const data = history.map(entry => entry.marketValue);

      const ctx = this.$refs.chartCanvas.getContext("2d");

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Market Value (€)",
              data,
              borderColor: "#00ff55",
              backgroundColor: "#00ff5566",
              pointBackgroundColor: "#00ff55",
              pointBorderColor: "#222",
              pointHoverBackgroundColor: "#fff",
              fill: true,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#1f1f1f',
              borderColor: '#00ff55',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12,
              displayColors: false,
              titleFont: {
                size: 14,
                weight: 'bold',
                family: 'Arial'
              },
              bodyFont: {
                size: 13,
                family: 'Arial'
              },
              titleColor: '#00ff55',
              bodyColor: '#ffffff',
              callbacks: {
                title: (tooltipItems) => {
                  return `📅 ${labels[tooltipItems[0].dataIndex]}`;
                },
                label: (context) => {
                  const index = context.dataIndex;
                  const point = history[index];
                  return [
                    `🏟️ Club: ${point.clubName}`,
                    `🧍 Age: ${point.age}`,
                    `💰 Value: €${point.marketValue.toLocaleString()}`
                  ];
                }
              }
            }

            ,
            legend: {
              labels: {
                color: "#fff"
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: "#ccc"
              },
              title: {
                display: true,
                text: "Date",
                color: "#ccc"
              }
            },
            y: {
              ticks: {
                callback: value => `€${value.toLocaleString()}`,
                color: "#ccc"
              },
              title: {
                display: true,
                text: "Market Value (€)",
                color: "#ccc"
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
.value-history-container {
  margin-top: 30px;
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 255, 85, 0.15);
  color: white;
  max-width: 100%;
  position: relative;
  min-height: 300px;
}

canvas {
  width: 100% !important;
  height: 400px !important;
}

.loading-text {
  text-align: center;
  font-size: 1.2rem;
  padding: 40px;
  color: #ccc;
}
</style>
