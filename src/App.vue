<template>
  <div class="wrapper">
    <Header :sidebarOpen="sidebarOpen" />
    <button 
      class="burger-btn" 
      v-show="!isModalOpen"
      @click="toggleSidebar"
    >
      <span>&#9776;</span>
    </button>

    <div class="content-row">
      <Sidebar 
        v-model="sidebarOpen" 
        @open-register-modal="registerModal?.open()" 
      />

      <main class="main-content" :class="{ 'with-sidebar': sidebarOpen }">
        <RegisterModal 
          ref="registerModal" 
          @register="handleRegister" 
          @modal-open="onModalOpen"
          @close="onModalClose"
        />
        <router-view />
        
        <template v-if="showMainComponents">
          <MapView :sidebar-open="sidebarOpen" />
          <FiltersAccordion :sidebar-open="sidebarOpen" />
          <LandmarksGrid :sidebar-open="sidebarOpen" />
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import RegisterModal from './components/RegisterModal.vue'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import MapView from './components/MapView.vue'
import FiltersAccordion from './components/FiltersAccordion.vue'
import LandmarksGrid from './components/LandmarksGrid.vue'

const sidebarOpen = ref(false)
const route = useRoute()
const registerModal = ref()
const isModalOpen = ref(false) // Track modal open state
const isMobile = ref(false)

function updateIsMobile() {
  isMobile.value = window.innerWidth <= 900
}
function toggleSidebar() {
  if (isModalOpen.value) return
  sidebarOpen.value = !sidebarOpen.value
}
function onModalOpen() {
  console.log('modal opened')
  isModalOpen.value.open()
  console.log(isModalOpen.value.open())
  
}

function onModalClose() {
  isModalOpen.value = false
}


onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

function handleRegister(userData) {
  console.log('Зарегистрирован пользователь:', userData)
}

const showMainComponents = computed(() => {
  return route.name !== 'Profile' && route.name !== 'LandmarkPage'
})
</script>

<style scoped>
.wrapper {
  height: 100%;
  min-height: 100vh;
  width: 100vw;
  background: #f7f7f7d5;
  display: flex;
  flex-direction: column;
}

.content-row {
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
}

.main-content {
  flex: 1;
  width: 100%;
  margin: 0;
  padding: 0;
  background: #f7f7f7d5;
  border-radius: 0;
  box-shadow: none;
  padding-top: 110px;
}

.burger-btn {
  position: absolute;
  top: 115px;
  left: 39px;
  background: #ffffffd5;
  color: #000000;
  border: none;
  font-size: 1.3em;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px 12px;
  z-index: 30;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.08);
  transition: opacity 0.3s ease; 
}

.burger-btn.dimmed {
  opacity: 0.5; 
  pointer-events: none;
}

@media (max-width: 900px) {
  .burger-btn {
    position: fixed;
    top: 18px;
    left: 46px;
    font-size: 1.3em;
    padding: 4px 8px;
    border-radius: 15px;
  }
  .main-content {
    padding-top: 60px;
  }
  .with-sidebar {
    margin-left: 0;
  }
}

@media (max-width: 600px) {
  .burger-btn {
    top: 18px;
    left: 46px;
    font-size: 1.3em;
    padding: 4px 8px;
    border-radius: 15px;
  }
  .with-sidebar {
    margin-left: 0;
  }
}
</style>

<style>
body, html {
  background: #f7f7f7d5 !important;
  overflow-x: hidden;
}
</style>