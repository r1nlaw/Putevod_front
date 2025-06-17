<template>
  <div :class="['sidebar-wrapper', { open: modelValue, collapsed: !modelValue }]">
    <div class="sidebar-header">
      <span class="sidebar-title" v-show="modelValue">Разделы</span>
      <button
        class="sidebar-back"
        title="Назад"
        @click="$emit('update:modelValue', false)"
        v-show="modelValue"
      >
        &#8592;
      </button>
    </div>

    <ul class="sidebar-nav">
      <li
        v-for="(item, index) in menuItems"
        :key="item.label"
        :class="['sidebar-item', { 'sidebar-item--active': activeIndex === index }]"
        @click="handleClick(item.label, index)"
      >
        <span class="sidebar-icon">
          <img :src="item.icon" :alt="item.label" />
        </span>
        <span v-show="modelValue">{{ item.label }}</span>
      </li>
    </ul>

    <button class="menu-toggle" @click="$emit('update:modelValue', !modelValue)">
      <span v-if="modelValue">&#10005;</span>
      <span v-else>&#9776;</span>
    </button>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import challenges from '@/assets/icons/challenges.png'
import events from '@/assets/icons/events.png'
import feed from '@/assets/icons/feed.png'
import landmarks from '@/assets/icons/landmarks.png'
import navmap from '@/assets/icons/navmap.png'
import routes from '@/assets/icons/routes.png'

import { useRouter } from 'vue-router'
const router = useRouter()

defineProps({
  modelValue: Boolean
})
defineEmits(['update:modelValue'])

const activeIndex = ref(0)

const menuItems = [
  { label: 'Достопримечательности', icon: landmarks },
  { label: 'Профиль', icon: landmarks },
  { label: 'Маршруты', icon: routes },
  { label: 'Лента', icon: feed },
  { label: 'Мероприятия', icon: events },
  { label: 'Испытания', icon: challenges },
  { label: 'Путеводитель', icon: navmap }
]

const handleClick = (label, index) => {
  activeIndex.value = index

  if (label === 'Профиль') {
    router.push('/profile')
  }
  if (label === 'Достопримечательности') {
    router.push('/')
  }

}

</script>

<style scoped>
.sidebar-icon img {
  width: 22px;
  height: 22px;
  min-width: 22px;
}
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 0 16px 0;
  margin: 24px 24px 0 24px;
}
.sidebar-title {
  font-size: 20px;
  color: #1d1d1d;
  font-weight: 700;
  transition: opacity 0.3s;
}
.sidebar-back {
  background: #f7f7f7;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  color: #fff;
  border: none;
  font-size: 2em;
  cursor: pointer;
  z-index: 10;
}
.sidebar-wrapper {
  z-index: 1;
  position: relative;
  left: 30px;
  top: 110px;
  width: 300px;
  height: 82vh;
  overflow-y: hidden;
  overflow-x: hidden;
  background: #fff;
  opacity: 1;
  transition: all .4s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border-radius: 24px;
  margin-top: 0px;
}
.sidebar-wrapper.open {
  width: 300px;
}
.sidebar-wrapper.collapsed {
  width: 60px; /* минимальная ширина для отображения иконок */
}
.menu-toggle {
  position: absolute;
  top: 16px;
  right: -48px;
  background: #fff;
  color: #fff;
  border: none;
  font-size: 2em;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  padding: 8px 12px;
  transition: all .4s;
  z-index: 2;
}
.sidebar-nav {
  padding: 0;
  list-style: none;
  width: 100%;
  text-align: left;
  margin: 0;
  margin-top: 8px;
}
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  padding: 6px 25px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  color: #222;
  font-weight: 400;
}
.sidebar-item:hover {
  background: #f7f7f7;
}
.sidebar-item--active {
  background: #ededed;
  font-weight: 600;
  padding-left: 15px;
  padding-right: 24px;
  margin-left: 8px;
  margin-right: 8px;
  border-radius: 8px;
}


.sidebar-icon {
  font-size: 18px;
  width: 22px;
  text-align: center;
}

/* --- Adaptive styles --- */
@media (max-width: 900px) {
  .sidebar-wrapper {
    position: fixed;
    z-index: 2000;
    box-shadow: none;
    width: 0;
    min-width: 0;
    max-width: 80vw;
    border-radius: 0 16px 16px 0;
  }
  .sidebar-wrapper.open {
    width: 80vw;
    min-width: 220px;
    max-width: 80vw;
  }
  .menu-toggle {
    right: -44px;
    top: 10px;
    font-size: 1.5em;
  }
}
@media (max-width: 600px) {
  .sidebar-wrapper {
    max-width: 100vw;
    border-radius: 0;
  }
  .sidebar-wrapper.open {
    width: 100vw;
    min-width: 0;
    max-width: 100vw;
  }
  .menu-toggle {
    right: -40px;
    top: 6px;
    font-size: 1.2em;
  }
}
</style> 