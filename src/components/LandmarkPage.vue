<template>
  <div class="landmark-page">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="landmark" class="landmark-card">
      <div class="landmark-top">
        <div class="image-placeholder">
          <img :src="domain + '/' + landmark.data.images[0].large_path" alt="Фото" v-if="landmark?.data?.images?.length && landmark.data.images[0]?.large_path" />
        </div>

        <div class="landmark-info">
          <h1 class="landmark-title">{{ landmark.data.name }}</h1>

          <div class="landmark-tags">
            <span class="tag">🏛️ {{ landmark.data.category }}</span>
          </div>

          <div class="landmark-tabs">
            <span>Рейтинг</span>
            <span>Отзывов</span>
            <span>Посещений</span>
          </div>

          <div class="landmark-description-block">
            <h2 class="description-title">Описание</h2>
            <p class="landmark-description description-text">
              {{ firstPartDescription }}
            </p>
          </div>
        </div>
      </div>

      <div class="landmark-details">
        <p v-if="remainingDescription" class="landmark-description">
          {{ remainingDescription }}
        </p>

        <h2 class="description-title">История</h2>
        <p class="landmark-description">{{ landmark.data.history }}</p>

        <div v-if="landmark && landmark.data.prices && landmark.data.prices.length">
          <h2 class="description-title">Цены</h2>
          <ul>
            <li v-for="price in landmark.data.prices" :key="price.id">
              {{ price.description }}: {{ price.amount }} ₽
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const landmark = ref(null)
const loading = ref(false)
const error = ref(null)
const domain = import.meta.env.VITE_BACKEND_URL;

const firstPartDescription = computed(() => {
  if (!landmark.value || !landmark.value.data.description) return ''
  const maxLength = 700
  const text = landmark.value.data.description
  if (text.length <= maxLength) return text
  const lastSpaceIndex = text.lastIndexOf(' ', maxLength)
  const splitIndex = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength
  return text.slice(0, splitIndex)
})

const remainingDescription = computed(() => {
  if (!landmark.value || !landmark.value.data.description) return ''
  const maxLength = 700
  const text = landmark.value.data.description
  if (text.length <= maxLength) return ''
  const lastSpaceIndex = text.lastIndexOf(' ', maxLength)
  const splitIndex = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength
  return text.slice(splitIndex).trim()
})

const fetchLandmark = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(`${domain}/landmarks/${encodeURIComponent(route.params.name)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.message || 'Ошибка загрузки достопримечательности')
    }

    landmark.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLandmark()
})
</script>

<style scoped>
.landmark-page {
  padding: 0px;
  display: flex;
  justify-content: center;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f5f5f5;
}

.landmark-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  border-radius: 24px;
  padding: 32px;
  max-width: 1540px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.landmark-top {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.image-placeholder {
  max-width: 320px;
  max-height: 320px;
  background-color: #e0e0e0;
  border-radius: 16px;
  flex-shrink: 0;
  overflow: hidden;
}

.image-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.landmark-info {
  flex: 1 1 60%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.landmark-description-block {
  display: flex;
  flex-direction: column;
  max-height: 280px; /* Ограничиваем высоту блока описания под размер картинки */
  overflow: hidden;
}

.description-text {
  max-height: 240px; /* Учитываем заголовок */
  overflow: hidden;
  text-align: justify;
}

.landmark-details {
  flex: 1 1 100%;
}

.landmark-title {
  font-size: 28px;
  color: #1d1d1d;
  font-weight: bold;
  margin: 0;
}

.landmark-tags {
  display: flex;
  gap: 12px;
  color: #1d1d1d;
}

.tag {
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.landmark-tabs {
  display: flex;
  gap: 20px;
  font-weight: 500;
  color: #1d1d1d;
}

.description-title {
  font-size: 20px;
  margin-bottom: 8px;
  margin-top: 12px;
  color: #1d1d1d;
}

.landmark-description {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
  color: #444;
}

.loading {
  text-align: center;
  font-size: 1.4rem;
  padding: 40px;
}

.error {
  text-align: center;
  font-size: 1.4rem;
  padding: 40px;
  color: #ff0000;
}

/* Адаптивность */
@media (max-width: 768px) {
  .landmark-top {
    flex-direction: column;
    align-items: center;
  }

  .image-placeholder {
    width: 100%;
    height: auto;
  }

  .landmark-info {
    width: 100%;
    align-items: center;
    text-align: center;
  }

  .landmark-description-block {
    max-height: none; /* Снимаем ограничение высоты на мобильных */
  }

  .description-text {
    max-height: none; /* Снимаем ограничение высоты текста */
  }

  .landmark-tags,
  .landmark-tabs {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>