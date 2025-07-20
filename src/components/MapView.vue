<template>
  <div class="map-container" :class="{ expanded: isMapExpanded, 'with-sidebar': sidebarOpen }" :style="{ minHeight: isMapExpanded ? (isMobile ? '200px' : '800px') : mapHeight + 'px' }">
    <img
      v-if="!isMapVisible"
      src="@/assets/images/map_placeholder.png"
      alt="Карта"
      class="map-image"
    />
    <div v-show="isMapVisible" id="map" style="z-index: 0;"></div>

    <button class="map-button" @click="toggleMap">
      <img :src="mapToggleIcon" alt="Toggle Map" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount, computed  } from 'vue';
import maplibregl from 'maplibre-gl';
import expandIcon from '@/assets/icons/expand.png';
import collapseIcon from '@/assets/icons/collapse.png';
import routes from '@/assets/icons/routes.png';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRouter } from 'vue-router';
const defaultThumbnailPath = 'assets/landmarks/default.jpg'
const props = defineProps({ sidebarOpen: Boolean });
const map_style = import.meta.env.VITE_MAP_STYLE_URL;
const domain = import.meta.env.VITE_BACKEND_URL;

const isMapVisible = ref(true);
const isMapExpanded = ref(false);
const mapHeight = ref(500);
const isMobile = ref(window.innerWidth <= 768);

const geojson = { type: 'FeatureCollection', features: [] };
let map = null;

const routeSourceId = 'route';

const markers = ref({});
const isRouting = ref(false);
const selectedRoutePoints = ref([]);

const router = useRouter();


const mapToggleIcon = computed(() => (isMapExpanded.value ? collapseIcon : expandIcon));

function toggleMap() {
  isMapExpanded.value = !isMapExpanded.value;
}
const loadOptimizedImage = async (url, targetWidth) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = targetWidth / img.width;
      canvas.width = targetWidth;
      canvas.height = img.height * ratio;

      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      const radius = Math.min(canvas.width, canvas.height) / 2;
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(blob => {
        resolve(URL.createObjectURL(blob));
      }, 'image/webp', 0.7);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

const loadFacilities = async (targetMap, selectedIds = selectedRoutePoints.value) => {
  if (!targetMap || !targetMap.getSource) {
    console.error('Invalid map instance');
    return;
  }

  const markerSize = isMobile.value ? 150 : 100;
  let facilities = [];
  let results;
  try {
    if (selectedIds.length > 0) {
      // Загрузка достопримечательностей по ID
      const response = await fetch(`${domain}/landmarks/facilities`, {
        method: 'POST',
        body: JSON.stringify(selectedIds),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      results = await response.json();
    } else {
      // Загрузка достопримечательностей по bounds карты
      const bounds = targetMap.getBounds().toArray();
      const response = await fetch(`${domain}/landmarks/facilities`, {
        method: 'POST',
        body: JSON.stringify({
          sw: { lng: bounds[0][0], lat: bounds[0][1] },
          ne: { lng: bounds[1][0], lat: bounds[1][1] }
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      results = await response.json();
    }
    facilities = results.data;
    if (!facilities?.length) return;

    const newFeatures = await Promise.all(facilities.map(async facility => {
      const isSelected = selectedIds.includes(facility.id);
      const imageUrl = facility.images?.length>0? facility.images[0].thumbnail_path: defaultThumbnailPath;


      return {
        type: 'Feature',
        properties: {
          id: facility.id,
          name: facility.name,
          address: facility.address,
          url: `${domain}/${facility.url}` || '',
          image: `${domain}/${imageUrl}`,
          markerImage: `${domain}/${imageUrl}`,
          isSelected: isSelected
        },
        geometry: {
          type: 'Point',
          coordinates: [facility.location[0], facility.location[1]]
        }
      };
    }));

    const source = targetMap.getSource('markers');
    if (!source) return;

    source.setData({ type: 'FeatureCollection', features: newFeatures });

    if (targetMap.getLayer('unclustered-point')) {
      targetMap.removeLayer('unclustered-point');
    }

    targetMap.addLayer({
      id: 'unclustered-point',
      type: 'symbol',
      source: 'markers',
      filter: selectedIds.length > 0
        ? ['all', ['!', ['has', 'point_count']], ['==', ['get', 'isSelected'], true]]
        : ['!', ['has', 'point_count']],
      layout: {
        'icon-image': ['coalesce', ['get', 'markerImage'], 'default-marker'],
        'icon-size': isMobile.value ? 0.6 : 0.6,
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
        'icon-padding': 10
      },
      paint: {
        'icon-opacity': 1
      }
    });

    const uniqueImages = [...new Set(newFeatures
      .filter(f => f.properties.markerImage)
      .map(f => f.properties.markerImage))];

    await Promise.all(uniqueImages.map(async url => {
      try {
        if (!targetMap.hasImage(url)) {
          const optimizedUrl = await loadOptimizedImage(url, markerSize);
          if (optimizedUrl) {
            const img = new Image();
            img.src = `${optimizedUrl}`;
            await img.decode();
            targetMap.addImage(url, img);
          }
        }
      } catch (e) {
        console.warn(`Error loading image ${url}`, e);
      }
    }));

  } catch (error) {
    console.error('Error loading facilities:', error);
  }
};

const showPopup = (feature, targetMap) => {
  const { geometry, properties } = feature;
  const { name, translated_name, image, address } = properties;

  const truncateAddress = (addr, maxLen) => {
    if (!addr) return '';
    return addr.length > maxLen ? addr.slice(0, maxLen) + '...' : addr;
  };

  const popupHTML = `
    <div class="popup-card">
      ${image ? `<img src="${image}" alt="${name}" class="popup-card-image" />` : ''}
      <div class="popup-card-body">
        <h3 class="popup-card-title">${name || 'Без названия'}</h3>
        ${address ? `
          <p class="popup-card-address">
            <p class="popup-card-address">${address}</p>
          </p>` : ''}
        <div style="margin-top:10px; text-align: right; display: flex; justify-content: flex-end; gap: 10px;">
          <button
            class="popup-add-btn landmark-action ${selectedRoutePoints.value.includes(properties.id) ? 'remove' : ''}"
            data-id="${properties.id}"
          >
            ${selectedRoutePoints.value.includes(properties.id) ? 'Убрать' : 'Добавить'}
            ${!selectedRoutePoints.value.includes(properties.id) ? `<img class="action-icon-img" src="${routes}" alt="routes" />` : ''}
          </button>
          <button class="popup-card-link landmark-action" data-name="${translated_name || name}">Подробнее</button>
        </div>
      </div>
    </div>
  `;

  const popup = new maplibregl.Popup({ closeOnClick: true, className: 'custom-popup', maxWidth: '300px' })
    .setLngLat(geometry.coordinates)
    .setHTML(popupHTML)
    .addTo(targetMap);

  setTimeout(() => {
    const btn = popup.getElement().querySelector('.popup-card-link');
    if (btn) {
      btn.addEventListener('click', () => {
        const n = btn.getAttribute('data-name');
        if (n) {
          router.push(`/landmarks/${encodeURIComponent(n)}`);
          popup.remove();
        }
      });
    }
    const addBtn = popup.getElement().querySelector('.popup-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const id = parseInt(addBtn.getAttribute('data-id'));
        if (isNaN(id)) return;

        const index = selectedRoutePoints.value.indexOf(id);
        if (index === -1) {
          selectedRoutePoints.value.push(id);
          addBtn.textContent = 'Убрать';
        } else {
          selectedRoutePoints.value.splice(index, 1);
          addBtn.textContent = 'Добавить';
        }
      });
    }
  });
};

onMounted(async () => {
  map = new maplibregl.Map({
    container: 'map',
    style: map_style,
    center: [34.09847, 44.94249],
    zoom: 13
  });

  map.on('load', async () => {
    map.addSource('markers', {
      type: 'geojson',
      data: geojson,
      cluster: true,
      clusterMaxZoom: 11,
      clusterRadius: 30
    });

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'markers',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#61dafb',
          10,
          '#24a5e6',
          30,
          '#0077b6'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          15,
          10,
          20,
          30,
          25
        ]
      }
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'markers',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Roboto Bold', 'Arial Unicode MS Bold'],
        'text-size': 14
      }
    });

    await loadFacilities(map);

    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('markers').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom
        });
      });
    });

    map.on('click', 'unclustered-point', (e) => {
      if (e.features.length === 0) return;
      showPopup(e.features[0], map);
    });

    map.on('mouseenter', 'clusters', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('moveend', async () => {
      if (!isRouting.value) {
        await loadFacilities(map, []);
      }
    });
  });

  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 768;
  });
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  min-height: 300px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
  background: #fff;
  position: relative;
  transition: min-height 0.3s, margin-left 0.3s;
  padding: 5px 5px;
  max-width: 1750px;
  margin: 0 auto;
}
.map-container.expanded {
  min-height: 800px;
}
.map-container.with-sidebar {
  margin-left: 50px;
  width: calc(100% - 80px);
}
.map-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  z-index: 1;
}
#map {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 20px;
  background: #f7f7f7;
}

#map,
.maplibregl-canvas {
  width: 100% !important;
  height: 100% !important;
  min-height: inherit !important;
  transition: height 0.3s;
}
.map-button {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  background: #fff;
  border: 1px solid #ccc;
  padding: 8px 10px;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  gap: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  font-size: 16px;
  transition: box-shadow 0.2s;
}
.map-button:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.map-button img {
  width: 20px;
  height: 20px;
}

/* Popup styles */
:deep(.popup-card) {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fff;
  border-radius: 25px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  overflow: hidden;
  width: 280px;
  max-width: 90vw;
  color: #333;
  display: flex;
  flex-direction: column;
  user-select: none;

  /* Зададим фиксированную высоту, например 400px */
  height: 350px;
}

:deep(.popup-card-image) {
  width: 100%;
  height: 160px;
  padding: 10px;
  object-fit: cover;
  border-radius: 25px;
}

:deep(.popup-card-link .landmark-action) {
  font-weight: 100 !important; 
  height: 30px;
  padding: 0 10px;
  font-size: 12px;
  border-radius: 10px;
}

:deep(.popup-card-body) {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 50%; 
}

:deep(.popup-card-title) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #222;
}
:deep(.action-icon-img) {
  filter: brightness(0) invert(1);
  width: 18px;
  height: 18px;
}
:deep(.popup-add-btn) {
  color: #fff !important;
  background: #3d5a40 !important;
}

:deep(.maplibregl-popup-close-button) {
  position: absolute;
  top: 15px;
  right: -45px;
  cursor: pointer;
  z-index: 10;
  width: 28px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white; 
  font-size: 20px;
  box-shadow: 0 0 5px rgba(0,0,0,0.7); 
  transition: background-color 0.3s ease;
}

:deep(.maplibregl-popup-close-button):hover {
  background-color: rgba(0, 0, 0, 0.8);
}



:deep(.popup-card-address) {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1px 0;
}

:deep(.popup-card-link) {
  align-self: flex-end;
  background-color: #2d4834;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 400;
  transition: background-color 0.3s ease;
}

:deep(.popup-card-link):hover {
  background-color: #385a41;
}
:deep(.maplibregl-popup-content) {
  min-width: 220px;
  background-color: RGBA(0,0,0,0);
  padding: 0;
}
:deep(.custom-popup) {
  width: 220px !important;
  height: auto !important;
  padding: 0 !important;
  margin: 0 !important;
  background: none !important;
  box-shadow: none !important;
  border: none !important;
}

:deep(.landmark-action) {
  background: #f3f3f3;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 1rem;
  color: #222;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s, color 0.15s;
}

:deep(.landmark-action .action-icon) {
  font-weight: 700;
  font-size: 1.1em;
  margin-left: 2px;
  color: #888;
}

:deep(.landmark-action.remove) {
  background: #fffdfd;
  color: #954848;
}

:deep(.landmark-action.remove .action-icon) {
  color: #e57373;
}

:deep(.landmark-action:hover) {
  background: #e6f2ed;
  color: #125341;
}


@media (max-width: 900px) {
  .map-container.expanded {
    min-height: 600px;
  }
  .map-container.with-sidebar {
    margin-left: 0;
    width: calc(100%);
  }
}
@media (max-width: 600px) {
  .map-container {
    min-height: 200px;
    border-radius: 12px;
  }
  .map-container.expanded {
    min-height: 550px;
  }
  #map {
    border-radius: 12px;
    min-height: 400px;
  }
  .map-button {
    top: 8px;
    right: 8px;
    font-size: 14px;
    padding: 6px 10px;
  }
}
</style>
