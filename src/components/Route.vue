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
            <div class="route-details">
              <h3>Ваш маршрут</h3>
              <div class="route-line"></div>
              <ul class="route-list">
                <li v-for="(place, index) in selectedPlaces" :key="place.id" class="route-item">
                  <div class="dot"></div>
                  <div class="route-name">{{ place.name }}</div>
                  <div class="route-distance">{{ place.distance }}</div>
                </li>
              </ul>
              <div class="button-action">
                <button class="build-route-button" @click="buildRoute">Следовать</button>
                <button class="build-route-button secondary" @click="clearRoute">Очистить маршрут</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import MapView from '@/components/MapView.vue'

const selectedPlaces = ref([])

onMounted(() => {
  const savedPlaces = JSON.parse(localStorage.getItem('selectedPlaces') || '[]')
  selectedPlaces.value = savedPlaces
  updateRouteLine()
})

watch(selectedPlaces, () => {
  updateRouteLine()
})

const updateRouteLine = () => {
  const routeLine = document.querySelector('.route-line')
  const firstDot = document.querySelector('.route-item .dot')
  const lastDot = document.querySelector('.route-item:last-of-type .dot')

  if (firstDot && lastDot && routeLine) {
    const firstDotTop = firstDot.offsetTop
    const lastDotBottom = lastDot.offsetTop + lastDot.offsetHeight
    routeLine.style.top = `${firstDotTop}px`
    routeLine.style.height = `${lastDotBottom - firstDotTop}px`
  }
}

const removePlace = (index, id) => {
  selectedPlaces.value.splice(index, 1)
  localStorage.setItem('selectedPlaces', JSON.stringify(selectedPlaces.value))
}

const buildRoute = () => {
  alert('Маршрут построен с ' + selectedPlaces.value.length + ' точками!')
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
  background-color: #f5f3f3;
  border-radius: 16px;
  margin-bottom: 5px;
  padding: 5px;
  border-bottom: 1px solid #eee;
}

.place-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.place-image {
  width: 6vw;
  height: 100%;
  max-width: 100px;
  max-height: 65px;
  object-fit: cover;
  border-radius: 8px;
}

.place-details {
  display: flex;
  flex-direction: column;
}

.place-name {
  font-family: "Montserrat", sans-serif;
  font-size: 15px;
  color: #000000;
  font-weight: 600;
}

.place-distance {
  font-size: 12px;
  color: #1d1d1d;
}

.remove-button {
  background: none;
  border: none;
  padding: 2vh;
  font-size: 25px;
  cursor: pointer;
  color: #1d1d1d;
}

.route-details {
  margin-bottom: 16px;
  padding: 1vw;
  position: relative;
  background-color: #f5f3f3;
  border-radius: 16px;
}

.button-action {
  display: flex;
  gap: 15px;
}

.route-line {
  position: absolute;
  width: 2px;
  background-color: #2d4834;
  left: 5px; /* Выравнивание по центру точек */
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #2d4834;
  border-radius: 50%;
  position: absolute;
  left: -19px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1; /* Точки поверх линии */
}

.route-list {
  font-family: "Montserrat", sans-serif;
  list-style-type: none;
  padding-left: 20px;
  margin: 0 0 16px 0;
}

.route-item {
  margin-bottom: 24px;
  color: #1d1d1d;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.route-name {
  font-size: 15px;
  font-weight: 400;
  color: #1d1d1d;
}

.route-distance {
  font-size: 12px;
  color: #1d1d1d;
}

p {
  color: #1d1d1d;
  margin-bottom: 8px;
  font-family: "Montserrat", sans-serif;
}

.route-duration {
  color: #1d1d1d;
}

.build-route-button {
  font-family: "Montserrat", sans-serif;
  background-color: #2d4834;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  width: 30%;
  margin-bottom: 8px;
  font-size: 16px;
}

.build-route-button.secondary {
  background-color: #fff;
  color: #2d4834;
  border: 1px solid #2d4834;
}

@media (max-width: 900px) {
  .map-section {
    height: 50vh;
  }
  .selected-places {
    width: 100%;
    height: 50vh;
  }
  .button-action {
    width: 100%;
  
  }
  .build-route-button {
    width: 50%;
  }
  .route-details {
    padding: 6px;
  }
  .place-name {
    font-size: 0.8rem;
  }
  .place-distance {
    font-size: 0.6rem;
  }
  .place-image {
    width: 20vw;
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
    left: 5px;
  }

}
</style>