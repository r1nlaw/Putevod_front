<template>
  <div class="route-container">
    <div class="route-content">
      <div class="map-section">
        <MapView :sidebar-open="sidebarOpen" />
        <div id="map" class="map"></div>
      </div>

      <div class="selected-places">
        <div class="places-split">
          <div class="places-list-container">
            <h3>Ваш маршрут</h3>
            <ul class="places-list">
              <li v-for="(place, index) in selectedPlaces" :key="place.id" class="place-item">
                <div class="place-info">
                  <img :src="place.image" :alt="place.name" class="place-image" />
                  <div class="place-details">
                    <span class="place-name">{{ place.name }}</span>
                    <span class="place-distance">{{ place.distance }}</span>
                  </div>
                </div>
                <button class="remove-button" @click="removePlace(index, place.id)">×</button>
              </li>
            </ul>
          </div>
          <div class="route-summary">
            <h3>Ваш маршрут</h3>
            <div class="route-details">
              <div class="route-line">
                <div v-for="(item, index) in routeItems" :key="index" class="dot"></div>
              </div>
              <ul class="route-list">
                <li v-for="(place, index) in selectedPlaces" :key="place.id">
                  {{ place.name }} <span class="route-distance">{{ place.distance }}</span>
                </li>
              </ul>
              <p>Пешеходный маршрут <span class="route-duration">24 мин</span></p>
              <button class="build-route-button" @click="buildRoute">Сохранить</button>
              <button class="build-route-button secondary" @click="clearRoute">Очистить маршрут</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MapView from '@/components/MapView.vue'

const selectedPlaces = ref([])

onMounted(() => {
  // Load saved places from localStorage
  const savedPlaces = JSON.parse(localStorage.getItem('selectedPlaces') || '[]')
  selectedPlaces.value = savedPlaces
})

const routeItems = computed(() => selectedPlaces.value.length)

const removePlace = (index, id) => {
  selectedPlaces.value.splice(index, 1)
  // Update localStorage
  localStorage.setItem('selectedPlaces', JSON.stringify(selectedPlaces.value))
}

const buildRoute = () => {
  alert('Route built with ' + selectedPlaces.value.length + ' places!')
}

const clearRoute = () => {
  selectedPlaces.value = []
  localStorage.setItem('selectedPlaces', JSON.stringify([]))
}
</script>

<style scoped>
.route-container {
  font-family: "Montserrat", sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.route-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.selected-places {
  width: 94%;
  background: #fff;
  padding: 16px;
  margin: 0 auto;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow-y: auto;
  position: relative;
}

.places-split {
  display: flex;
  gap: 16px;
}

.places-list-container {
  flex: 1;
}

.route-summary {
  flex: 1;
  padding-left: 16px;
  border-left: 1px solid #eee;
}

.selected-places h3 {
  font-size: 20px;
  color: #1d1d1d;
  font-weight: 700;
  margin-bottom: 16px;
}

.places-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.place-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.place-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.place-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
}

.place-details {
  display: flex;
  flex-direction: column;
}

.place-name {
  font-size: 15px;
  color: #1d1d1d;
  font-weight: 400;
}

.place-distance {
  font-size: 12px;
  color: #1d1d1d;
}

.remove-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #1d1d1d;
}

.route-details {
  margin-bottom: 16px;
  position: relative;
}

.route-line {
  position: absolute;
  left: -20px;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: #2e7d32;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #2e7d32;
  border-radius: 50%;
  margin-bottom: 20px;
}

.dot:first-child {
  margin-top: -5px;
}

.route-list {
  list-style-type: none;
  padding-left: 20px;
  margin: 0 0 16px 0;
}
li {
  color: #1d1d1d;
}

.route-item {
  margin-bottom: 20px;
  color: #1d1d1d;
  position: relative;
}

p {
  color: #1d1d1d;
  margin-bottom: 8px;
}

.route-distance {
  color: #1d1d1d;
  margin-left: 8px;
}

.route-duration {
  color: #1d1d1d;
}

.build-route-button {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 8px;
  font-size: 16px;
}

.build-route-button.secondary {
  background-color: #fff;
  color: #2e7d32;
  border: 1px solid #2e7d32;
}

@media (max-width: 900px) {
  .map-section {
    height: 50vh;
  }

  .places-split {
    flex-direction: column;
  }

  .route-summary {
    padding-left: 0;
    border-left: none;
    margin-top: 16px;
  }

  .route-line {
    left: -10px;
  }
}
</style>