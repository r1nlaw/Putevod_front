<template>
  <div class="filters-chips">
    <div class="filters-title"></div>
    <div class="chips-list">
      <button
        v-for="chip in chips"
        :key="chip.label"
        class="chip"
        :class="[chip.className, { 'chip--selected': selectedChips.includes(chip.label) }]"
        @click="toggleChip(chip.label)"
        type="button"
      >
        <span class="chip-emoji">
          <img :src="chip.emoji" :alt="chip.label" class="chip-icon" />
        </span>
        {{ chip.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import zamkiIcon from '@/assets/emoji/zamki.png'
import religionIcon from '@/assets/emoji/religion.png'
import museumIcon from '@/assets/emoji/museum.png'
import cryptIcon from '@/assets/emoji/crypt.png'
import zooIcon from '@/assets/emoji/zoo.png'
import parkIcon from '@/assets/emoji/park.png'
import natureIcon from '@/assets/emoji/nature.png'

import archaeologyIcon from '@/assets/emoji/archaeology.png'
import architectureIcon from '@/assets/emoji/architecture.png'
import artobjectIcon from '@/assets/emoji/art-object.png'
import concerthallIcon from '@/assets/emoji/concerthall.png'
import fountainIcon from '@/assets/emoji/fountain.png'
import monumentIcon from '@/assets/emoji/monument.png'
import scienceIcon from '@/assets/emoji/science.png'
import theatreIcon from '@/assets/emoji/theatre.png'
import unusualIcon from '@/assets/emoji/unusual.png'

const chips = [
  { emoji: zamkiIcon, label: 'Храм', className: 'filter-gray' },
  { emoji: religionIcon, label: 'Религиозное', className: 'filter-green' },
  { emoji: museumIcon, label: 'Музеи', className: 'filter-museam' },
  { emoji: architectureIcon, label: 'Архитектура', className: 'filter-brown' },
  { emoji: monumentIcon, label: 'Памятники', className: 'filter-orange' },
  { emoji: parkIcon, label: 'Парки', className: 'filter-green-nature' },
  { emoji: natureIcon, label: 'Природа', className: 'filter-green-nature' },
  { emoji: theatreIcon, label: 'Театр', className: 'filter-pink' },
  { emoji: concerthallIcon, label: 'Концертный зал', className: 'filter-blue' },
  { emoji: unusualIcon, label: 'Необычное', className: 'filter-brown-cons' },
  { emoji: archaeologyIcon, label: 'Археология', className: 'filter-beige' },
  { emoji: artobjectIcon, label: 'Арт-объект', className: 'filter-white' },
  { emoji: fountainIcon, label: 'Фонтаны', className: 'filter-blue-fountain' },
  { emoji: scienceIcon, label: 'Наука', className: 'filter-gold' },
]

const selectedChips = ref([])

// Функция переключения выбора
function toggleChip(label) {
  const index = selectedChips.value.indexOf(label)
  if (index === -1) {
    selectedChips.value.push(label)
  } else {
    selectedChips.value.splice(index, 1)
  }
}
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
.chips-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
}
.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid transparent; 
  border-radius: 18px;
  padding: 7px 16px;
  font-size: 1rem;
  color: #222;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s, border-color 0.15s;
  box-shadow: none;
  outline: none;
  font-family: "Montserrat", sans-serif;
}
.chip:hover,
.chip:focus {
  filter: brightness(1);
  color: #ffffff;
}

.chip--selected {
  border: 1px solid #569464;
  background-color: rgba(43, 75, 51, 0.507); /* лёгкий зеленоватый фон */
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.1);
  filter: none;
  color: #222;
}


.chip-emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  line-height: 1;
}
.chip-icon {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

/* Цвета для фонов */
.filter-gray {
  background: #e0e0e0;
}
.filter-green {
  background: #cce5cc;
}
.filter-blue {
  background: #67b0ec73;
}
.filter-pink {
  background: #fddcdc;
}
.filter-museam {
  background: #8dc7c485;
}
.filter-orange {
  background: #dba20693;
}
.filter-gold {
  background: #d7d8a0b9;
}
.filter-brown {
  background: #b370327e;
}
.filter-brown-cons {
  background: #5e44cf7e;
}
.filter-green-nature {
  background: #54886f81;
}
.filter-beige {
  background: #fae6a3cc;
}
.filter-blue-fountain {
  background: #2576e073;
}
.filter-white {
  background: #eee8e8bb;
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
