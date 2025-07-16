<template>
  <div class="landmarks-grid" :class="{ 'with-sidebar': sidebarOpen }">
    <transition-group name="fade" tag="div" class="landmarks-grid-inner">
      <LandmarkCard
        v-for="item in places"
        :key="item.id"
        v-bind="item"
        :selected="selectedIds.includes(item.id)"
        :sidebar-opened="sidebarOpen"
        @toggle="toggleSelect"
      />
    </transition-group>
    <div v-if="isLoading" class="loading">Загрузка...</div>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import LandmarkCard from './LandmarkCard.vue';

const props = defineProps({ sidebarOpen: Boolean });

const places = ref([]);
const isLoading = ref(false);
const noMoreData = ref(false);
const currentPage = ref(1);
const selectedCategories = ref([]);
const selectedIds = ref([]);

const route = useRoute();

async function loadLandmark(categories = selectedCategories.value) {
  if (isLoading.value || noMoreData.value) return;

  isLoading.value = true;

  const domain = import.meta.env.VITE_BACKEND_URL;
  let url = `${domain}/landmarks?page=${currentPage.value}`;

  if (categories.length > 0) {
    url += '&' + categories.map(cat => `category=${encodeURIComponent(cat)}`).join('&');
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const landmarks = await response.json();

    if (!landmarks || landmarks.length === 0) {
      noMoreData.value = true;
      return;
    }

    const newPlaces = landmarks.map(element => ({
      id: element.id,
      title: element.name,
      address: element.address,
      translated_name: element.translated_name,
      category: element.category,
      time: element.time ?? '',
      price: element.price ?? '',
      rating: element.rating ?? '',
      reviews: element.reviews ?? '',
      image: `${domain}/images/${element.image_path}`,
      weathers: element.weathers,
      likes: element.likes ?? 0,
      comments: element.comments ?? 0
    }));

    if (currentPage.value === 1) {
      places.value = newPlaces;
    } else {
      places.value.push(...newPlaces);
    }

    currentPage.value++;
  } catch (error) {
    console.error("Ошибка при загрузке достопримечательностей:", error);
  } finally {
    isLoading.value = false;
  }
}

// Считываем категории из URL (если массив или строка)
onMounted(() => {
  const cats = route.query.categories;
  if (cats) {
    if (Array.isArray(cats)) {
      selectedCategories.value = cats;
    } else {
      selectedCategories.value = cats.split(',');
    }
  } else {
    selectedCategories.value = [];
  }

  currentPage.value = 1;
  noMoreData.value = false;
  loadLandmark();

  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

function handleScroll() {
  const scrollY = window.scrollY || window.pageYOffset;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  if (scrollY + windowHeight >= docHeight - 300) {
    loadLandmark();
  }
}

function toggleSelect(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(i => i !== id);
  } else {
    selectedIds.value.push(id);
  }
}

watch(
  () => route.query.categories,
  (newCategories) => {
    if (newCategories) {
      if (Array.isArray(newCategories)) {
        selectedCategories.value = newCategories;
      } else {
        selectedCategories.value = newCategories.split(',');
      }
    } else {
      selectedCategories.value = [];
    }
    currentPage.value = 1;
    noMoreData.value = false;
    loadLandmark();
  }
);
</script>

<style scoped>
.landmarks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 5px 5px;
  margin: 0 auto;
  padding: 35px 0.5%;
  background: #fff;
  max-width: 1750px;
}
.landmarks-grid-inner {
  display: contents;
}

/* Анимация появления карточек */
.fade-enter-active, .fade-leave-active {
  transition: all 0.6s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.landmarks-grid.with-sidebar {
  margin-left: 50px;
  width: calc(100% - 80px);
}
@media (max-width: 900px) {
  .landmarks-grid.with-sidebar {
    margin-left: 0;
    width: calc(100%);
  }
}
@media (max-width: 768px) {
  .landmarks-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
  }

}

</style> 