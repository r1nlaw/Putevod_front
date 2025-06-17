<template>
  <div class="landmark-card" :class="{ selected, 'wide-card': props.sidebarOpened }">
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
          :class="{ remove: selected }"
          @click="$emit('toggle', id)"
        >
          {{ selected ? 'Убрать' : 'Добавить' }}
          <span class="action-icon">
            <img class="action-icon-img" :src="routes" alt="routes" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import routes from '@/assets/icons/routes.png'
import likeIcon from '@/assets/icons/like.png'
import reviewIcon from '@/assets/icons/review.png'

const props = defineProps({
  id: [String, Number],
  image: String,
  title: String,
  address: String,
  likes: Number,
  comments: Number,
  selected: Boolean,
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

  if (lastSpaceIndex === -1) {
    return truncated + '...'
  }

  return truncated.slice(0, lastSpaceIndex)
})
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

@media (max-width: 600px) {
  .landmark-card {
    min-width: 90vw;
    max-width: 100vw;
    border-radius: 16px;
  }
  .landmark-image {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    height: 120px;
  }
  .landmark-content {
    padding: 12px 10px 10px 10px;
  }
}
</style>
