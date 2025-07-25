<template>
  <div class="sidebar-wrapper" :class="{ open: modelValue, collapsed: !modelValue }">
    <Teleport to="#burger-target" v-if="isMobile">
      <button 
        class="burger-button" 
        v-show="!modelValue"
        @click="$emit('update:modelValue', true)"
      >
        ☰
      </button>
    </Teleport>
    
    <button 
      class="burger-button" 
      v-show="!modelValue && !isMobile"
      @click="$emit('update:modelValue', true)"
    >
      ☰
    </button>
    
    <div class="sidebar-header" v-show="modelValue">
      <span class="sidebar-title">Разделы</span>
      <button
        class="sidebar-back"
        title="Назад"
        @click="$emit('update:modelValue', false)"
      >
        ←
      </button>
      <RegisterModal ref="registerModal" @close="closeModal" />
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
      <span v-if="modelValue">✕</span>
      <span v-else>☰</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import challenges from '@/assets/icons/challenges.png'
import events from '@/assets/icons/events.png'
import feed from '@/assets/icons/feed.png'
import landmarks from '@/assets/icons/landmarks.png'
import navmap from '@/assets/icons/navmap.png'
import routes from '@/assets/icons/routes.png'
import RegisterModal from './RegisterModal.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function closeModal() {
  console.log('Модалка закрыта')
}

defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'open-register-modal'])

const registerModal = ref(null)
function openRegisterModal() {
  if (registerModal.value) {
    registerModal.value.open()
  }
}

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

const isMobile = ref(window.innerWidth <= 900)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 900
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

const handleClick = (label, index) => {
  activeIndex.value = index

  if (label === 'Профиль') {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/profile')
    } else {
      openRegisterModal() 
    }
    return
  }

  if (label === 'Достопримечательности') {
    router.push('/')
  }
  if (label === 'Маршруты') {
    const selectedPlaces = JSON.parse(localStorage.getItem('selectedPlaces') || '[]');
    if (selectedPlaces.length >= 2) {
      router.push('/routeList');
    } else {
      alert('Выберите хотя бы 2 достопримечательности');
    }
  }

  emit('update:modelValue', false)
}
</script>

<style scoped>
.burger-button {
  position: absolute;
  top: 8px;
  left: 11px;
  background: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1.1em;
  cursor: pointer;
  z-index: 2001;
  transition: opacity 0.3s;
}

.burger-button:hover {
  background: #f7f7f7;
}

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
  margin: 48px 24px 0 24px;
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
  width: 60px;
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
  margin-top: 45px;
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
@media (max-width: 1919px) {
  .sidebar-wrapper {
    margin-right: 50px;
  }
}

/* --- Adaptive styles --- */
@media (max-width: 900px) {
  .sidebar-wrapper {
    position: fixed;
    z-index: 2000;
    box-shadow: none;
    width: 0;
    min-width: 0;
    max-width: 0;
    top: 0;
    left: 0;
    height: 100vh;
    border-radius: 0 16px 16px 0;
  }
  .sidebar-wrapper.open {
    width: 35vw;
    min-width: 220px;
    max-width: 80vw;
  }
  .menu-toggle {
    right: -44px;
    top: 10px;
    font-size: 1.5em;
  }
  .burger-button {
    top: 10px;
    left: 10px;
    padding: 5px 9px;
  }
}
@media (max-width: 600px) {
  .sidebar-wrapper {
    max-width: 100vw;
    border-radius: 0;
    top: 0;
    height: 100vh;
    left: 0;
  }
  .sidebar-wrapper.collapsed {
    width: 0px;
  }
  .sidebar-wrapper.open {
    width: 100vw;
    min-width: 0;
    max-width: 100vw;
    margin: 0;
  }
  .menu-toggle {
    right: -40px;
    top: 6px;
    font-size: 1.2em;
  }
  .burger-button {
    top: 6px;
    left: 6px;
    font-size: 1.2em;
  }
}
</style>