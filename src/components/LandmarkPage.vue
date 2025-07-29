<template>
  <div class="landmark-page">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="landmark" class="landmark-card">
      <div class="landmark-top">
        <div class="image-placeholder">
          <img
              :src="domain + '/' + landmark.data.images[0].large_path"
              alt="Фото"
              v-if="landmark?.data?.images?.length && landmark.data.images[0]?.large_path"
          />
        </div>

        <div class="landmark-info">
          <h1 class="landmark-title">{{ landmark.data.name }}</h1>
          <div class="landmark-tags">
            <span class="tag">🏛️ {{ landmark.data.category }}</span>
          </div>
          <div class="landmark-tabs">
            <span>Рейтинг: {{ averageRating }}</span>
            <span>Отзывов: {{ reviewCount }}</span>
            <span>Посещений: {{ landmark.data.visits || 'N/A' }}</span>
          </div>
          <div class="landmark-description-block">
            <h2 class="description-title">Описание</h2>
            <p class="landmark-description description-text">
              {{ firstPartDescription }}
            </p>
          </div>
        </div>
      </div>

      <div class="landmark-details">
        <p v-if="remainingDescription" class="landmark-description">
          {{ remainingDescription }}
        </p>

        <h2 class="description-title">История</h2>
        <p class="landmark-description">{{ landmark.data.history }}</p>

        <div v-if="landmark.data.schedules && landmark.data.schedules.length">
          <h2 class="description-title">Расписание</h2>
          <ul>
            <li v-for="schedule in landmark.data.schedules" :key="schedule.id">
              {{ schedule.description }}: с {{ formatDate(schedule.start) }} по
              {{ formatDate(schedule.end) }}
            </li>
          </ul>
        </div>

        <div v-if="landmark.data.prices && landmark.data.prices.length">
          <h2 class="description-title">Цены</h2>
          <ul>
            <li v-for="price in landmark.data.prices" :key="price.id">
              {{ price.description }}: {{ price.amount }} ₽
            </li>
          </ul>
        </div>

        <!-- Reviews Section -->
        <div class="reviews-section">
          <h2 class="description-title">⭐ Путевые заметки </h2>

          <!-- Review Form -->
          <div v-if="isAuthenticated" class="review-form">
            <h3>Оставить отзыв</h3>
            <form @submit.prevent="submitReview">
              <div class="form-group">
                <label for="rating">Оценка:</label>
                <select id="rating" v-model="newReview.rating" class="form-control">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="review_text">Текст отзыва:</label>
                <textarea
                    id="review_text"
                    v-model="newReview.review_text"
                    class="form-control"
                    placeholder="Напишите ваш отзыв здесь..."
                ></textarea>
              </div>
              <div class="form-group">
                <label for="images">Изображения (до 5 файлов):</label>
                <input
                    type="file"
                    id="images"
                    multiple
                    accept=".jpg,.jpeg,.png,.mp4,.dng"
                    @change="handleFileUpload"
                    class="form-control-file"
                />
                <div v-if="newReview.images.length" class="selected-files">
                  <p>Выбрано файлов: {{ newReview.images.length }}</p>
                  <ul>
                    <li v-for="(file, index) in newReview.images" :key="index">{{ file.name }}</li>
                  </ul>
                  <button type="button" class="clear-btn" @click="clearFiles">Очистить</button>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">Отправить</button>
            </form>
            <p v-if="submitMessage" :class="submitMessage.includes('Ошибка') ? 'error-message' : 'success-message'">
              {{ submitMessage }}
            </p>
          </div>
          <div v-else>
            <p>Войдите в аккаунт, чтобы оставить отзыв.</p>
          </div>

          <!-- Reviews List -->
          <div v-if="reviews.length" class="reviews-list">
            <div v-for="review in reviews" :key="review.id" class="review-card">
              <div class="review-header">
                <div class="user-info">
                  <font-awesome-icon icon="user" class="user-icon" />
                  <p class="review-user">Пользователь: {{ review.user.username || review.user_id }}</p>
                </div>
                <p class="review-rating">Оценка: {{ review.rating }}</p>
              </div>
              <p class="review-text">{{ review.review_text || 'Без текста' }}</p>
              <div v-if="review.images && review.images.length" class="review-media">
                <!-- Photo Carousel -->
                <div v-if="review.images.some(media => media.media_type === 'photo')" class="carousel">
                  <div class="carousel-inner">
                    <img
                        v-for="(media, index) in review.images.filter(m => m.media_type === 'photo')"
                        :key="media.id || media.path"
                        :src="domain + '/' + media.path"
                        :class="{ active: currentImageIndex[review.id] === index }"
                        alt="Review photo"
                        @click="openModal(domain + '/' + media.path)"
                        class="carousel-image clickable"
                    />
                  </div>
                  <button
                      v-if="review.images.filter(m => m.media_type === 'photo').length > 1"
                      class="carousel-btn prev"
                      @click="prevImage(review.id, review.images.filter(m => m.media_type === 'photo').length)"
                  >
                    &lt;
                  </button>
                  <button
                      v-if="review.images.filter(m => m.media_type === 'photo').length > 1"
                      class="carousel-btn next"
                      @click="nextImage(review.id, review.images.filter(m => m.media_type === 'photo').length)"
                  >
                    &gt;
                  </button>
                  <div v-if="review.images.filter(m => m.media_type === 'photo').length > 0" class="carousel-counter">
                    {{ currentImageIndex[review.id] + 1 }} / {{ review.images.filter(m => m.media_type === 'photo').length }}
                  </div>
                </div>
                <!-- Videos -->
                <div
                    v-if="review.images.some(media => media.media_type === 'video')"
                    class="video-container"
                >
                  <video
                      v-for="media in review.images.filter(m => m.media_type === 'video')"
                      :key="media.id || media.path"
                      :src="domain + '/' + media.path"
                      controls
                      class="review-video"
                  ></video>
                </div>
              </div>
              <button
                  v-if="isAuthenticated && review.user_id === currentUserId"
                  @click="deleteReview(review.id, landmark.data.id)"
                  class="delete-btn"
              >
                Удалить
              </button>
            </div>
          </div>
          <p v-else class="no-reviews">Отзывов пока нет. Будьте первым!</p>
        </div>
      </div>
      <ImageModal :show="showModal" :image-src="currentImage" @close="closeModal" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ImageModal from './ImageModal.vue';

const route = useRoute();
const landmark = ref(null);
const reviews = ref([]);
const loading = ref(false);
const error = ref(null);
const domain = import.meta.env.VITE_BACKEND_URL;

const isAuthenticated = ref(false);
const currentUserId = ref(null);
const jwtToken = ref(null);
const submitMessage = ref('');

const newReview = ref({
  rating: 5, // Default rating set to 5
  review_text: '',
  images: [],
});

const showModal = ref(false);
const currentImage = ref('');
const currentImageIndex = ref({}); // Track carousel index for each review

const firstPartDescription = computed(() => {
  if (!landmark.value || !landmark.value.data.description) return '';
  const maxLength = 700;
  const text = landmark.value.data.description;
  if (text.length <= maxLength) return text;
  const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
  const splitIndex = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength;
  return text.slice(0, splitIndex);
});

const remainingDescription = computed(() => {
  if (!landmark.value || !landmark.value.data.description) return '';
  const maxLength = 700;
  const text = landmark.value.data.description;
  if (text.length <= maxLength) return '';
  const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
  const splitIndex = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength;
  return text.slice(splitIndex).trim();
});

const averageRating = computed(() => {
  if (!Array.isArray(reviews.value) || reviews.value.length === 0) return 'N/A';
  const total = reviews.value.reduce((sum, review) => sum + (review.rating || 0), 0);
  return (total / reviews.value.length).toFixed(1);
});

const reviewCount = computed(() => {
  return Array.isArray(reviews.value) ? reviews.value.length : 0;
});

const formatDate = (date) => {
  return new Date(date).toLocaleString('ru-RU');
};

const checkAuth = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  if (token && userId) {
    isAuthenticated.value = true;
    currentUserId.value = parseInt(userId);
    jwtToken.value = token;
  } else {
    isAuthenticated.value = false;
    currentUserId.value = null;
    jwtToken.value = null;
  }
};

const fetchLandmark = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(
        `${domain}/landmarks/${encodeURIComponent(route.params.name)}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Ошибка загрузки достопримечательности');
    }
    landmark.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const fetchReviews = async () => {
  try {
    const response = await fetch(
        `${domain}/user/review/?url=${encodeURIComponent(route.params.name)}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) throw new Error('Ошибка загрузки отзывов');
    const data = await response.json();
    reviews.value = Array.isArray(data.data) ? data.data : [];
    // Initialize carousel index for each review
    reviews.value.forEach(review => {
      currentImageIndex.value[review.id] = 0;
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    reviews.value = [];
  }
};

const handleFileUpload = (event) => {
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 5;
  const allowedExts = ['.jpg', '.jpeg', '.png', '.mp4', '.dng'];
  const files = Array.from(event.target.files);

  if (files.length > maxFiles) {
    submitMessage.value = `Вы можете загрузить не более ${maxFiles} файлов.`;
    setTimeout(() => (submitMessage.value = ''), 3000);
    event.target.value = '';
    return;
  }

  newReview.value.images = files.filter((file) => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (file.size > maxFileSize) {
      submitMessage.value = `Файл ${file.name} слишком большой (макс. 10 МБ)`;
      setTimeout(() => (submitMessage.value = ''), 3000);
      return false;
    }
    if (!allowedExts.includes(ext)) {
      submitMessage.value = `Недопустимое расширение файла ${file.name}`;
      setTimeout(() => (submitMessage.value = ''), 3000);
      return false;
    }
    return true;
  });
};

const clearFiles = () => {
  newReview.value.images = [];
  document.getElementById('images').value = ''; // Reset file input
};

const submitReview = async () => {
  const formData = new FormData();
  formData.append('user_id', currentUserId.value);
  formData.append('landmark_id', landmark.value.data.id);
  formData.append('rating', newReview.value.rating);
  formData.append('review_text', newReview.value.review_text);
  newReview.value.images.forEach((file, index) => {
    formData.append(`images[${index}]`, file);
  });

  try {
    const response = await fetch(`${domain}/user/review/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwtToken.value}` },
      body: formData,
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Ошибка отправки отзыва');
    }
    await fetchReviews();
    newReview.value = { rating: 5, review_text: '', images: [] }; // Reset with default rating 5
    submitMessage.value = 'Отзыв успешно отправлен';
    setTimeout(() => (submitMessage.value = ''), 3000);
  } catch (err) {
    console.error('Error submitting review:', err);
    submitMessage.value = `Ошибка: ${err.message}`;
    setTimeout(() => (submitMessage.value = ''), 3000);
  }
};

const deleteReview = async (reviewId, landmarkId) => {
  try {
    const response = await fetch(`${domain}/user/review/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken.value}`,
      },
      body: JSON.stringify({
        user_id: currentUserId.value,
        review_id: reviewId,
        landmark_id: landmarkId,
      }),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Ошибка удаления отзыва');
    }
    await fetchReviews();
    submitMessage.value = 'Отзыв успешно удален';
    setTimeout(() => (submitMessage.value = ''), 3000);
  } catch (err) {
    console.error('Error deleting review:', err);
    submitMessage.value = `Ошибка: ${err.message}`;
    setTimeout(() => (submitMessage.value = ''), 3000);
  }
};

const openModal = (imageSrc) => {
  currentImage.value = imageSrc;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const prevImage = (reviewId, photoCount) => {
  currentImageIndex.value[reviewId] = (currentImageIndex.value[reviewId] - 1 + photoCount) % photoCount;
};

const nextImage = (reviewId, photoCount) => {
  currentImageIndex.value[reviewId] = (currentImageIndex.value[reviewId] + 1) % photoCount;
};

onMounted(() => {
  checkAuth();
  fetchLandmark();
  fetchReviews();
});
</script>

<style scoped>
.landmark-page {
  padding: 0;
  display: flex;
  justify-content: center;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f5f5f5;
}

.landmark-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  border-radius: 24px;
  padding: 32px;
  max-width: 1540px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.landmark-top {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.image-placeholder {
  max-width: 320px;
  max-height: 320px;
  background-color: #e0e0e0;
  border-radius: 16px;
  flex-shrink: 0;
  overflow: hidden;
}

.image-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.landmark-info {
  flex: 1 1 60%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.landmark-description-block {
  display: flex;
  flex-direction: column;
  max-height: 280px;
  overflow: hidden;
}

.description-text {
  max-height: 240px;
  overflow: hidden;
  text-align: justify;
}

.landmark-details {
  flex: 1 1 100%;
}

.landmark-title {
  font-size: 28px;
  color: #1d1d1d;
  font-weight: bold;
  margin: 0;
}

.landmark-tags {
  display: flex;
  gap: 12px;
  color: #1d1d1d;
}

.tag {
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.landmark-tabs {
  display: flex;
  gap: 20px;
  font-weight: 500;
  color: #1d1d1d;
}

.description-title {
  font-size: 20px;
  margin-bottom: 8px;
  margin-top: 12px;
  color: #1d1d1d;
}

.landmark-description {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
  color: #444;
}

.loading {
  text-align: center;
  font-size: 1.4rem;
  padding: 40px;
}

.error {
  text-align: center;
  font-size: 1.4rem;
  padding: 40px;
  color: #ff0000;
}

.reviews-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #eee;
}

.review-form {
  margin-bottom: 32px;
  padding: 24px;
  background-color: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.review-form h3 {
  font-size: 22px;
  margin-bottom: 20px;
  color: #1d1d1d;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: #fff;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  outline: none;
}

.form-control-file {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.selected-files {
  margin-top: 10px;
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
}

.selected-files p {
  margin: 0 0 8px;
  font-weight: 600;
  color: #333;
}

.selected-files ul {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  color: #444;
}

.clear-btn {
  margin-top: 8px;
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-btn:hover {
  background-color: #5a6268;
}

.btn-primary {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.success-message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  background-color: #d4edda;
  color: #155724;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8d7da;
  color: #721c24;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e0e0e0;
}

.review-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-icon {
  margin-right: 8px;
  color: #666;
  font-size: 18px;
}

.review-user {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.review-rating {
  font-weight: 600;
  color: #e67e22;
  font-size: 16px;
  background-color: #fff3e0;
  padding: 4px 12px;
  border-radius: 12px;
}

.review-text {
  font-size: 16px;
  line-height: 1.8;
  color: #2c3e50;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-style: italic;
  position: relative;
}

.review-text::before {
  content: '“';
  font-size: 24px;
  color: #007bff;
  position: absolute;
  left: 8px;
  top: 8px;
}

.review-text::after {
  content: '”';
  font-size: 24px;
  color: #007bff;
  position: absolute;
  right: 8px;
  bottom: 8px;
}

.carousel {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 16px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 300px;
}

.carousel-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.carousel-image.active {
  opacity: 1;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.carousel-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.carousel-btn.prev {
  left: 10px;
}

.carousel-btn.next {
  right: 10px;
}

.carousel-counter {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 14px;
}

.video-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.review-video {
  max-width: 200px;
  border-radius: 8px;
}

.clickable {
  cursor: pointer;
}

.delete-btn {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.delete-btn:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

.no-reviews {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .landmark-top {
    flex-direction: column;
    align-items: center;
  }
  .image-placeholder {
    width: 100%;
    height: auto;
  }
  .landmark-info {
    width: 100%;
    align-items: center;
    text-align: center;
  }
  .landmark-description-block {
    max-height: none;
  }
  .description-text {
    max-height: none;
  }
  .landmark-tags,
  .landmark-tabs {
    justify-content: center;
    flex-wrap: wrap;
  }
  .review-card {
    padding: 16px;
  }
  .carousel {
    max-width: 100%;
    height: 200px;
  }
  .carousel-inner {
    height: 200px;
  }
  .review-video {
    max-width: 100%;
  }
  .review-form {
    padding: 16px;
  }
  .form-control,
  .form-control-file {
    width: 100%;
  }
  .review-text {
    padding: 12px;
    font-size: 14px;
  }
  .review-text::before,
  .review-text::after {
    font-size: 20px;
  }
}
</style>