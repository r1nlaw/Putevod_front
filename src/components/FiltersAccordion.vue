<template>
  <div class="accordion" :class="{ 'with-sidebar': sidebarOpen }">
    <div class="accordion-item" v-for="(item, idx) in items" :key="idx">
      <h2 class="accordion-header">
        <button
          class="accordion-button"
          :class="{ collapsed: opened !== idx }"
          type="button"
          @click="toggle(idx)"
          :aria-expanded="opened === idx ? 'true' : 'false'"
        >
          {{ item.title }}
        </button>
      </h2>
      <div
        ref="bodies"
        class="accordion-collapse"
        :style="{
          maxHeight: opened === idx ? heights[idx] + 'px' : '0px'
        }"
      >
        <div class="accordion-body">
          <template v-if="idx === 0">
            <FiltersChips />
          </template>
          <template v-else>
            <strong>{{ item.bodyTitle }}</strong> {{ item.bodyText }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

  
<script setup>
import { ref, onMounted, nextTick } from 'vue';
import FiltersChips from './FiltersChips.vue';
import Archaeology from '../assets/emoji/archaeology.png'
const props = defineProps({ sidebarOpen: Boolean });

const opened = ref(-1);
const bodies = ref([]);
const heights = ref([]);

const items = [
  {
    title: 'Фильтры',
    bodyTitle: 'Это тело аккордеона первого элемента.',
    bodyText: 'По умолчанию оно скрыто, пока плагин сворачивания не добавит соответствующие классы...'
  }
];

function toggle(idx) {
  opened.value = opened.value === idx ? -1 : idx;
  nextTick(updateHeights);
}

function updateHeights() {
  heights.value = bodies.value.map(el => (el ? el.scrollHeight : 0));
}

onMounted(() => {
  nextTick(() => {
    bodies.value = document.querySelectorAll('.accordion-collapse');
    updateHeights();
  });
});

</script>
  
  <style scoped>
  .accordion {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    padding: 0;
    margin: 0 auto;
    max-width: 1750px;
    transition: margin-left 0.3s;
    font-family: "Montserrat", sans-serif;
  }

  .accordion.with-sidebar {
    margin-left: 50px;
    width: calc(100% - 80px);
  }
  .accordion-item + .accordion-item {
    border-top: 1px solid #eee;
  }
  .accordion-header {
    margin: 0;
  }
  .accordion-button {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    outline: none;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 18px 24px;
    border-radius: 0;
    transition: background 0.2s;
    cursor: pointer;
    color: #2d4834;
  }
  .accordion-button:hover {
    background: radial-gradient(ellipse at bottom, #87e0fd 0%,#01262b 55%);
  }
  .accordion-button.collapsed {
    background: #ffffff;
    color: #333;
  }
  .accordion-button.collapsed:hover {
    background: #79797917;
  }
  .accordion-button:not(.collapsed) {
    background: #ffffff7a;
    color: #125341;
  }
  .accordion-collapse {
  transition: max-height 0.4s ease;
  overflow: hidden;
  background: #fff;
}

  .accordion-collapse.show {
    animation: fadeIn 0.2s;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .accordion-body {
    padding: 0px 24px;
    font-size: 1rem;
    color: #444;
    background: #fff;
  }

@media (max-width: 900px) {
  .accordion.with-sidebar {
    margin-left: 0;
    width: calc(100%);
  }
}
  </style>