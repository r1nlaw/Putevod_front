<template>
  <div class="wrapper">
    <Header :sidebarOpen="sidebarOpen" />
    <div class="content-row">
      <Sidebar v-model="sidebarOpen" />
      <main class="main-content" :class="{ 'with-sidebar': sidebarOpen }">
        <router-view />
        
        <template v-if="showMainComponents">
          <MapView :sidebar-open="sidebarOpen" />
          <FiltersAccordion :sidebar-open="sidebarOpen" />
          <LandmarksGrid :sidebar-open="sidebarOpen" />
        </template>
        
      </main>
      <button class="burger-btn" v-if="!sidebarOpen" @click="sidebarOpen = true">
        <span>&#9776;</span>
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import MapView from './components/MapView.vue'
import FiltersAccordion from './components/FiltersAccordion.vue'
import LandmarksGrid from './components/LandmarksGrid.vue'
const sidebarOpen = ref(true)
const route = useRoute()
const showMainComponents = computed(() => {
  return route.path !== '/profile'
})
</script>

<style scoped>
.wrapper {
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
  position: fixed;
  top: 110px;
  left: 30px;
  background: #ffffffd5;
  color: #000000;
  border: none;
  font-size: 2em;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px 12px;
  z-index: 1002;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.08);
}
@media (max-width: 900px) {
  .burger-btn {
    top: 12px;
    left: 12px;
    font-size: 1.5em;
    padding: 6px 10px;
  }
}
@media (max-width: 600px) {
  .burger-btn {
    top: 8px;
    left: 8px;
    font-size: 1.2em;
    padding: 4px 8px;
  }
}
</style>

<style>
body, html {
  background: #f7f7f7d5 !important;
  overflow-x: hidden;
}
</style>
