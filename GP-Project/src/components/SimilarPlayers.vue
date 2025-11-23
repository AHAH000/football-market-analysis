<template>
  <div class="similar-players-container">
    <h3 class="title">Similar Players</h3>

    <div v-if="loading" class="status">Loading...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    <div v-else-if="pagedPlayers.length === 0" class="status">No similar players found.</div>

    <div v-else class="player-grid">
      <div
        v-for="player in pagedPlayers"
        :key="player['Player ID']"
        class="player-card"
      >
        <img :src="player.image_url" alt="Player Image" class="player-img" />
        <div class="player-info">
          <h4>{{ player.Name }}</h4>
          <p>{{ player.Position }} • Age: {{ player.Age }}</p>
          <p>Club: {{ player.Club }}</p>
          <button @click="goToProfile(player['Player ID'])">View Profile</button>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="page === 1">⟨</button>
      <span>Page {{ page }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages">⟩</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  playerId: {
    type: Number,
    required: true
  }
})

const router = useRouter()
const players = ref([])
const loading = ref(true)
const error = ref('')
const page = ref(1)
const perPage = 3

const totalPages = computed(() =>
  Math.ceil(players.value.length / perPage)
)

const pagedPlayers = computed(() =>
  players.value.slice((page.value - 1) * perPage, page.value * perPage)
)

const fetchSimilarPlayers = async () => {
  loading.value = true
  error.value = ''
  players.value = []

  try {
    const res = await axios.get(`http://localhost:8003/similar_players/${props.playerId}`)
    players.value = res.data['Similar Players'] || []
  } catch (err) {
    error.value = 'Failed to fetch similar players.'
  } finally {
    loading.value = false
  }
}

const prevPage = () => {
  if (page.value > 1) page.value--
}

const nextPage = () => {
  if (page.value < totalPages.value) page.value++
}

const goToProfile = async (playerId) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/players/playerId/${playerId}`)
    const playerSlug = response.data._id

    if (playerSlug) {
      // 👇 navigate with a unique key to force reload in the PlayerView.vue
      router.push({ path: `/playerView/${playerSlug}`, query: { t: Date.now() } })
    }
  } catch (error) {
    console.error("Error fetching player slug:", error)
  }
}

watch(
  () => props.playerId,
  (newId) => {
    if (newId) fetchSimilarPlayers()
  },
  { immediate: true }
)
</script>


<style scoped>
.similar-players-container {
  background-color: #111;
  color: #0f0;
  padding: 2rem;
  border-radius: 12px;
  max-width: 90%;
  margin: 2rem auto;
  font-family: 'Segoe UI', sans-serif;
  border: 2px solid #0f0;
  box-shadow: 0 0 15px #0f0;
}

.title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #0f0;
  text-align: center;
}

.status {
  text-align: center;
  font-style: italic;
  margin: 1rem 0;
  color: #aaa;
}
.status.error {
  color: red;
}

.player-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  justify-content: center;
}

.player-card {
  background: #1a1a1a;
  border: 2px solid #0f0;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 10px #0f0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.player-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px #0f0;
}

.player-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0f0;
  margin-bottom: 1rem;
}

.player-info {
  text-align: center;
}

.player-info h4 {
  color: #0f0;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.player-info p {
  color: #ccc;
  font-size: 0.9rem;
  margin: 0.2rem 0;
}

.player-info button {
  margin-top: 0.8rem;
  background-color: #0f0;
  color: #000;
  border: none;
  padding: 6px 14px;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.player-info button:hover {
  background-color: #4f4;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1.2rem;
  font-size: 1rem;
  color: #aaa;
}

.pagination button {
  background-color: #0f0;
  color: #000;
  border: none;
  padding: 6px 14px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.pagination button:hover {
  background-color: #3f3;
}

/* Responsive */
@media (max-width: 1024px) {
  .player-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .player-grid {
    grid-template-columns: 1fr;
  }
}
</style>
