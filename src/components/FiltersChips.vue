<template>
  <div class="filters-chips">
    <div class="filters-title">
    </div>
    <div class="chips-list">
      <button v-for="chip in chips" :key="chip.label" class="chip">
        <span class="chip-emoji">{{ chip.emoji }}</span>
        {{ chip.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
const chips = [
  { emoji: '🏰', label: 'Храм' },
  { emoji: '⛪', label: 'Религиозное' },
  { emoji: '🏛️', label: 'Музеи' },
  { emoji: '🗿', label: 'Архитектура' },
  { emoji: '🌳', label: 'Памятники' },
  { emoji: '🏞️', label: 'Парки' },
  { emoji: '🐝', label: 'Природа' },
  { emoji: '🧚‍♀️', label: 'Театр' },
  { emoji: '🏰', label: 'Концертный зал' },
  { emoji: '⛪', label: 'Необычное' },
  { emoji: '🏛️', label: 'Археология' },
  { emoji: '🗿', label: 'Арт-объект' },
  { emoji: '🌳', label: 'Фонтаны' },
  { emoji: '🏞️', label: 'Наука' },

];
</script>

<style scoped>
.filters-chips {
  margin: 24px 0 0 0;
}
.filters-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.filters-arrow {
  font-size: 1.1em;
  color: #888;
}
.chips-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
}
.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f3f3f3;
  border: none;
  border-radius: 18px;
  padding: 7px 16px;
  font-size: 1rem;
  color: #222;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  box-shadow: none;
  outline: none;
}
.chip:hover, .chip:focus {
  background: #e6f2ed;
  color: #125341;
}
.chip-emoji {
  font-size: 1.2em;
  line-height: 1;
}
@media (max-width: 600px) {
  .chips-list {
    gap: 8px 8px;
  }
  .chip {
    font-size: 0.95rem;
    padding: 6px 12px;
  }
}
</style> 