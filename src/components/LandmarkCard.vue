<template>
  <div class="landmark-card" :class="{ selected }">
        <img :src="image" class="landmark-image" alt="Фото" />
        <div class="landmark-content">
        <div class="landmark-title">{{ title }}</div>
        <div class="landmark-address">{{ address }}</div>
        <div class="landmark-weather">
            <span class="weather-dot"></span>
            Ясно, 25°C
        </div>
        <div class="landmark-footer">
            <div class="landmark-stats">
            <span class="stat"><i class="icon-heart"></i>{{ likes }}</span>
            <span class="stat"><i class="icon-comment"></i>{{ comments }}</span>
            </div>
            <button
            class="landmark-action"
            :class="{ remove: selected }"
            @click="$emit('toggle', id)"
            >
            {{ selected ? 'Убрать' : 'Добавить' }}
            <span class="action-icon">A<sub>2</sub>B</span>
            </button>
        </div>
        </div>
  </div>
</template>

<script setup>
defineProps({
  id: [String, Number],
  image: String,
  title: String,
  address: String,
  likes: Number,
  comments: Number,
  selected: Boolean
});
</script>

<style scoped>
.landmark-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 290px;
  max-width: 320px;
  margin: 0;
  transition: box-shadow 0.2s;
}
.landmark-card.selected {
  box-shadow: 0 4px 16px rgba(18,83,65,0.12);
}
.landmark-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}
.landmark-content {
  padding: 18px 18px 14px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.landmark-title {
  font-size: 1.1rem;
  color: #000000a8;
  font-weight: 700;
  margin-bottom: 2px;
}
.landmark-address {
  font-size: 0.98rem;
  color: #666;
  margin-bottom: 8px;
}
.landmark-weather {
  font-size: 0.95rem;
  color: #888;
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
.icon-heart::before {
  content: '♥';
  color: #e57373;
  font-size: 1.1em;
}
.icon-comment::before {
  content: '💬';
  font-size: 1.1em;
}
.landmark-action {
  background: #f3f3f3;
  border: none;
  border-radius: 18px;
  padding: 7px 16px;
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
  background: #ffeaea;
  color: #e57373;
}
.landmark-action.remove .action-icon {
  color: #e57373;
}
.landmark-action:hover {
  background: #e6f2ed;
  color: #125341;
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