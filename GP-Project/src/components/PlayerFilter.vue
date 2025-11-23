<template>
    <div class="filter-wrapper">
      <button class="toggle-button" @click="showFilters = !showFilters">
        <i :class="showFilters ? 'fas fa-chevron-up' : 'fas fa-filter'"></i>
        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      </button>
  
      <div v-if="showFilters" class="filter-box">
        <h2>Filter Players</h2>
        <div class="filters">
          <input v-model="filters.Name" placeholder="Name" />
          <input type="number" v-model="filters.age" placeholder="Max Age" />
          <input type="number" v-model="filters.XGBoost_predicted_values" placeholder="Max Value (€)" />
  
          <select v-model="filters.sub_position">
            <option value="">All Positions</option>
            <option value="Goalkeeper">Goalkeeper</option>
            <option value="Centre-Back">Centre-Back</option>
            <option value="Central Midfield">Central Midfield</option>
            <option value="Defensive Midfield">Defensive Midfield</option>
            <option value="Right-Back">Right-Back</option>
            <option value="Left-Back">Left-Back</option>
            <option value="Right Winger">Right Winger</option>
            <option value="Left Winger">Left Winger</option>
            <option value="Centre-Forward">Centre-Forward</option>
          </select>
  
          <select v-model="filters.sortBy">
            <option value="">Sort By</option>
            <option value="XGBoost_predicted_values">Market Value</option>
            <option value="age">Age</option>
            <option value="current_club_domestic_competition_id">League</option>
          </select>
  
          <select v-model="filters.sortOrder" :disabled="!filters.sortBy">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
  
          <button @click="applyFilters">Apply</button>
          <button class="clear-button" @click="clearFilters">Clear Filters</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "PlayerFilter",
    data() {
      return {
        showFilters: false,
        filters: {
          Name: "",
          age: "",
          XGBoost_predicted_values: "",
          sub_position: "",
          sortBy: "",
          sortOrder: "asc",
        },
      };
    },
    methods: {
      applyFilters() {
        const cleanedFilters = {};
  
        if (this.filters.Name) cleanedFilters.Name = this.filters.Name;
        if (this.filters.age && !isNaN(this.filters.age)) cleanedFilters.age = this.filters.age;
        if (this.filters.XGBoost_predicted_values && !isNaN(this.filters.XGBoost_predicted_values)) {
          cleanedFilters.XGBoost_predicted_values = this.filters.XGBoost_predicted_values;
        }
        if (this.filters.sub_position) cleanedFilters.sub_position = this.filters.sub_position;
  
        if (this.filters.sortBy) {
          cleanedFilters.sortBy = this.filters.sortBy;
          cleanedFilters.sortOrder = this.filters.sortOrder || "asc";
        }
  
        this.$emit("filter", cleanedFilters);
      },
      clearFilters() {
        this.filters = {
          Name: "",
          age: "",
          XGBoost_predicted_values: "",
          sub_position: "",
          sortBy: "",
          sortOrder: "asc",
        };
        this.$emit("filter", {}); // Emit empty filter to fetch original list
      },
    },
  };
  </script>
  
  <style scoped>
  .filter-wrapper {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .toggle-button {
    background-color: #00ff00;
    color: black;
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 10px;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.4);
  }
  
  .toggle-button i {
    margin-right: 6px;
  }
  
  .filter-box {
    background: #1f1f1f;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.4);
  }
  
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 10px;
  }
  
  .filters input,
  .filters select {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #555;
    background: #2b2b2b;
    color: #fff;
    flex: 1 1 200px;
  }
  
  .filters button {
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .filters button:not(.clear-button) {
    background-color: #00ff00;
    color: #000;
    border: none;
  }
  
  .filters .clear-button {
    background-color: #ff4444;
    color: white;
    border: none;
  }
  
  .filters button:hover {
    opacity: 0.9;
  }
  </style>
  