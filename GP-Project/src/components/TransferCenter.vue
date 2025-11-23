<template>
    <section class="transfer-center">
      <h2>Transfer Center</h2>
      <div class="transfer-list">
        <div v-for="(transfer, index) in transfers" :key="index" class="transfer-card">
          <img :src="transfer.image" alt="Player Image" />
          <h3>{{ transfer.player }}</h3>
          <p>{{ transfer.from }} → {{ transfer.to }}</p>
          <p class="transfer-fee">{{ transfer.fee }}</p>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        transfers: [
        //   { image: "@/assets/Haaland.png", player: "Erling Haaland", from: "Dortmund", to: "Man City", fee: "€100M" },
        //   { image: "@/assets/bellingham.png", player: "Jude Bellingham", from: "Dortmund", to: "Real Madrid", fee: "€120M" }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .transfer-center {
    text-align: center;
    padding: 30px;
  }
  .transfer-card {
    background: #292929;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    color: white;
  }
  .transfer-fee {
    color: #00ff99;
  }
  </style>
  