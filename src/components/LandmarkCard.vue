<template>
  <div
    class="landmark-card"
    :class="{ selected: isSelected, 'wide-card': props.sidebarOpened }"
    @click="goToLandmark(translated_name)"
  >
    <img :src="image" class="landmark-image" alt="Фото" />
    <div class="landmark-content">
      <div class="landmark-title">{{ title }}</div>

      <div class="landmark-address">
        <span>{{ displayAddress }}</span>
        <span
          v-if="isTruncated"
          class="address-toggle"
          @click="showFull = !showFull"
        >
          {{ showFull ? ' (Скрыть)' : '...' }}
        </span>
      </div>

      <div class="landmark-weather">
        <span class="weather-dot"></span>
        Ясно, 25°C
      </div>

      <div class="landmark-footer">
        <div class="landmark-stats">
          <span class="stat">
            <img class="icon-img" :src="likeIcon" alt="like" />
            {{ likes }}
          </span>
          <span class="stat">
            <img class="icon-img" :src="reviewIcon" alt="comment" />
            {{ comments }}
          </span>
        </div>
        <button
          class="landmark-action"
          :class="{ remove: isSelected }"
          @click.stop="toggleSelection"
        >
          {{ isSelected ? 'Убрать' : 'Добавить' }}
          <span class="action-icon">
            <img class="action-icon-img" :src="routes" alt="routes" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import routes from '@/assets/icons/routes.png'
import likeIcon from '@/assets/icons/like.png'
import reviewIcon from '@/assets/icons/review.png'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLandmark(nameTranslate) {
  if (!nameTranslate) return
  router.push(`/landmark/${encodeURIComponent(nameTranslate)}`)
}

const props = defineProps({
  id: [String, Number],
  image: String,
  title: String,
  translated_name: String,
  address: String,
  likes: Number,
  comments: Number,
  sidebarOpened: Boolean
})

const showFull = ref(false)
const isTruncated = computed(() => props.address.length > 30)

const displayAddress = computed(() => {
  if (showFull.value || props.address.length <= 30) {
    return props.address
  }
  const truncated = props.address.slice(0, 30)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  return lastSpaceIndex === -1 ? truncated + '...' : truncated.slice(0, lastSpaceIndex)
})

const isSelected = ref(false)

onMounted(() => {
  // Check if the card is in localStorage to set initial isSelected state
  const savedPlaces = JSON.parse(localStorage.getItem('selectedPlaces') || '[]')
  isSelected.value = savedPlaces.some(p => p.id === props.id)
})

function toggleSelection() {
  const savedPlaces = JSON.parse(localStorage.getItem('selectedPlaces') || '[]')
  const place = {
    id: props.id,
    name: props.title,
    image: props.image,
    distance: props.address // Using address as distance for simplicity; adjust as needed
  }

  if (isSelected.value) {
    // Remove from localStorage
    const updatedPlaces = savedPlaces.filter(p => p.id !== props.id)
    localStorage.setItem('selectedPlaces', JSON.stringify(updatedPlaces))
    isSelected.value = false
  } else {
    // Add to localStorage
    savedPlaces.push(place)
    localStorage.setItem('selectedPlaces', JSON.stringify(savedPlaces))
    isSelected.value = true
  }
}
</script>

<style scoped>
.action-icon-img,
.icon-img {
  width: 18px;
  height: 18px;
}

.landmark-card {
  background: #fff;
  border-radius: 35px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 280px;
  max-width: 280px;
  min-height: 460px;
  max-height: 580px;
  margin: 0;
  transition: box-shadow 0.2s;
  transition: width 0.3s ease;
}

.landmark-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.landmark-card.wide-card {
  min-width: 300px;
  max-width: 340px;
}

.landmark-card.selected {
  box-shadow: 0 4px 16px rgba(18,83,65,0.12);
}

.landmark-image {
  width: 100%;
  min-height: 240px;
  max-height: 240px;
  padding: 5px;
  border: 1px solid #f7f7f7;
  object-fit: cover;
  border-radius: 35px;
}

.landmark-content {
  padding: 18px 18px 14px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.landmark-title {
  font-size: 1.1rem;
  color: #1d1d1d;
  font-weight: 700;
  margin-bottom: 2px;
}

.landmark-address {
  font-size: 0.98rem;
  color: #1d1d1d;
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.address-toggle {
  color: #1a73e8;
  cursor: pointer;
  user-select: none;
}

.landmark-weather {
  font-size: 0.95rem;
  color: #595959;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.weather-dot {
  width: 10px;
  height: 10px;
  background: #ffc700;
  border-radius: 50%;
  display: inline-block;
}

.landmark-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.landmark-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #888;
  font-size: 1rem;
}

.landmark-action {
  background: #f3f3f3;
  border: none;
  border-radius: 18px;
  padding: 10px 16px;
  font-size: 1rem;
  color: #222;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s, color 0.15s;
}

.landmark-action .action-icon {
  font-weight: 700;
  font-size: 1.1em;
  margin-left: 2px;
  color: #888;
}

.landmark-action.remove {
  background: #fffdfd;
  color: #954848;
}

.landmark-action.remove .action-icon {
  color: #e57373;
}

.landmark-action:hover {
  background: #e6f2ed;
  color: #125341;
}

.landmark-card.selected {
  background-color: #f0f0f0;
  box-shadow: 0 4px 16px rgba(18, 83, 65, 0.12);
}

@media (max-width: 768px) {
  .landmark-card {
    min-width: 40vw;
    max-width: 60vw;
    border-radius: 16px;
    min-height: 80vw;
    max-height: 120vw;
    box-shadow: none;
  }

  .landmark-image {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    height: 120px;
    padding: 1px;
    border: none;
  }

  .landmark-content {
    padding: 12px 10px 10px 10px;
  }

  .landmark-card.wide-card {
    min-width: 40vw;
    max-width: 60vw;
  }

  .landmark-title {
    font-size: 0.8rem;
  }

  .landmark-address {
    font-size: 0.6rem;
  }

  .landmark-weather {
    font-size: 0.7rem;
  }

  .landmark-action {
    min-width: 5vw;
    max-width: 50vw;
    min-height: 5vw;
    max-height: 10vw;
    font-size: 0.75rem;
    gap: 0;
  }

  .landmark-stats {
    gap: 4px;
  }

  .icon-img {
    width: 12px;
    height: 12px;
  }

  .stat {
    font-size: 0.7rem;
  }
}
</style>