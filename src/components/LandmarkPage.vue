<template>
  <div class="landmark-page" v-if="landmark">
    <img :src="landmark.image" class="landmark-image" alt="Фото достопримечательности" />
    <h1 class="landmark-title">{{ landmark.title }}</h1>
    <p class="landmark-address">{{ landmark.address }}</p>
    <p class="landmark-description">{{ landmark.description }}</p>
    <div class="landmark-stats">
      <span>❤️ {{ landmark.likes }} лайков</span>
      <span>💬 {{ landmark.comments }} комментариев</span>
    </div>
  </div>
  <div v-else class="loading">Загрузка...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Имитация API-запроса
const mockLandmarks = [
  {
    title: 'Ай-Петри',
    image: 'https://example.com/ai-petri.jpg',
    address: 'Крым, Ялта, гора Ай-Петри',
    description: 'Ай-Петри — одна из самых живописных горных вершин Крыма.',
    likes: 256,
    comments: 34
  },
  {
    title: 'Ласточкино гнездо',
    image: 'https://example.com/swallow-nest.jpg',
    address: 'Крым, Гаспра',
    description: 'Знаменитый замок на скале над морем.',
    likes: 389,
    comments: 48
  }
]

const route = useRoute()
const landmark = ref(null)

onMounted(() => {
  const name = route.params.name
  landmark.value = mockLandmarks.find(l => l.title === decodeURIComponent(name))
})
</script>

<style scoped>
.landmark-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  font-family: sans-serif;
}
.landmark-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 16px;
}
.landmark-title {
  font-size: 2rem;
  margin-top: 16px;
  color: #333;
}
.landmark-address {
  font-size: 1.1rem;
  margin: 8px 0;
  color: #555;
}
.landmark-description {
  font-size: 1rem;
  margin-top: 16px;
  line-height: 1.6;
  color: #444;
}
.landmark-stats {
  margin-top: 24px;
  display: flex;
  gap: 20px;
  font-size: 1rem;
  color: #777;
}
.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
}
</style>
