<template>
  <div class="container" :class="{'with-sidebar': sidebarOpen}">
    <!-- Баннер -->
    <div
        class="banner"
        :style="{ backgroundImage: `url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1470&q=80')` }"
    >
      <label v-if="showModal" class="avatar-upload">
        <input type="file" accept="image/*" @change="onFileChange" hidden />
        <img :src="getAvatarSrc" alt="Аватар" class="avatar editable" />
      </label>
      <img v-else :src="getAvatarSrc" alt="Аватар" class="avatar" />
    </div>

    <!-- Основная информация -->
    <div class="info-block">
      <div class="info-header">
        <div class="text-info">
          <div class="title-with-icon">
            <h1>{{ profile.user_name || 'Без имени' }}</h1>
            <svg
                class="check-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
              />
            </svg>
          </div>
          <p class="status">
            {{ profile.status || '' }} <span class="emoji"></span>
          </p>
          <p class="readers-count">
            <svg
                class="icon-message"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6l-4 4V5z" />
            </svg>
            3 529 читателей
          </p>
        </div>

        <div class="buttons-group" :class="{'with-sidebar': sidebarOpen}">
          <button>Статистика</button>
          <button @click="openModal">Редактировать</button>
          <button aria-label="Дополнительные опции">...</button>
        </div>
      </div>

      <div class="info-grid">
        <div>
          <h3>Био</h3>
          <div>
            <p class="subtitle">
            {{ profile.bio || '' }} <span class="emoji"></span>
          </p>
          </div>
        </div>

        <div class="location-category">
          <div class="location">
            <h3>Местоположение</h3>
            <p>{{ profile.city || 'Астана' }}, {{ profile.country || 'Казахстан' }}</p>
          </div>
          <div class="category">
            <h3>Категория</h3>
            <p>{{ profile.category || 'Пешие путешествия' }}</p>
          </div>
        </div>

        <div class="social-media">
          <div v-for="(social, index) in profile.social_media" :key="index" class="social-card">
            <div class="social-icon">
              <svg v-if="social.platform === 'youtube'" class="platform-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <svg v-if="social.platform === 'twitch'" class="platform-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.149 0l-2.149 2.15v18.846h7.168v3.004h3.004v-3.004h3.996v-7.168h-14.019zm18.846 0h-7.168l2.149 2.15 5.019 5.019v-7.169zm-10.019 10.019h3.996v3.996h-3.996v-3.996zm8.004-8.004h-18.85v21.152h5.019v-14.019h13.831v-7.133z"/>
              </svg>
              <svg v-if="social.platform === 'meteliyox'" class="platform-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <div class="social-content">
              <span class="social-name">{{ social.name }}</span>
              <a :href="social.link" target="_blank" class="social-link">{{ social.link }}</a>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal for editing -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <button class="close-button" @click="closeModal" aria-label="Закрыть модальное окно">
          <svg
            class="close-icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <h2>Редактировать профиль</h2>
        <form @submit.prevent="saveProfile">
          <div class="modal-content">
            <label class="avatar-upload">
              <input type="file" accept="image/*" @change="onFileChange" hidden />
              <img :src="getAvatarSrc" alt="Аватар" class="avatar-small" />
              <h3 class="edit_avatar_modal">Изменить аватар</h3>
            </label>

            <label>Имя пользователя
              <span class="char-count">Осталось: {{ remainingChars.userName }} / 20</span>
            </label>
            <input v-model="edited.user_name" class="edit-input" placeholder="Имя пользователя" maxlength="20" />

            <label>Статус
              <span class="char-count">Осталось: {{ remainingChars.status }} / 50</span>
            </label>
            <input v-model="edited.status" class="edit-input" placeholder="Статус" maxlength="50" />

            <label>Биография
              <span class="char-count">Осталось: {{ remainingChars.bio }} / 500</span>
            </label>
            <textarea v-model="edited.bio" class="edit-input description-input" placeholder="Биография" maxlength="500"></textarea>

            <label>Страна</label>
            <select v-model="edited.country" class="edit-input" @change="updateCities">
              <option value="" disabled>Выберите страну</option>
              <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
            </select>

            <label>Город</label>
            <select v-model="edited.city" class="edit-input">
              <option value="" disabled>Выберите город</option>
              <option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option>
            </select>

            <label>Веб-сайт</label>
            <input v-model="edited.website_url" class="edit-input" placeholder="Веб-сайт" />

            <label>Пол</label>
            <select v-model="edited.gender" class="edit-input">
              <option value="" disabled>Выберите пол</option>
              <option v-for="(label, value) in genderMap" :key="value" :value="value">{{ label }}</option>
            </select>

            <label>Категория</label>
            <input v-model="edited.category" class="edit-input" placeholder="Категория" />

            <label>Социальные сети</label>
            <div v-for="(social, index) in edited.social_media" :key="index" class="social-edit">
              <input v-model="social.name" class="edit-input" placeholder="Название" />
              <input v-model="social.link" class="edit-input" placeholder="Ссылка" />
              <button type="button" @click="removeSocial(index)" class="remove-social">Удалить</button>
            </div>
            <button type="button" @click="addSocial" class="add-social">Добавить соцсеть</button>
          </div>

          <div class="modal-actions">
            <button class="save-action" type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import avatarImage from '@/assets/images/user_avatar.png'

const showModal = ref(false)
const router = useRouter()

const props = defineProps({
  sidebarOpen: Boolean,
});

const profile = reactive({
  user_id: null,
  user_name: '',
  status: '',
  bio: '',
  city: '',
  country: '',
  website_url: '',
  gender: '',
  avatar_url: '',
  category: '',
  rating: 0,
  routes: [],
  social_media: [
    { platform: 'youtube', name: 'Блог Дениса', link: 'https://youtube.com/@blogdenisa' },
    { platform: 'twitch', name: 'TripLive', link: 'https://twitch.tv/triplive' },
    { platform: 'meteliyox', name: 'Денис Иващенко', link: 'https://meteliyox.com' },
    { platform: 'youtube', name: 'Блог Дениса', link: 'https://youtube.com/@blogdenisa' },
    { platform: 'twitch', name: 'TripLive', link: 'https://twitch.tv/triplive' },
    { platform: 'meteliyox', name: 'Денис Иващенко', link: 'https://meteliyox.com' },
  ]
})

const edited = reactive({
  user_name: '',
  status: '',
  bio: '',
  city: '',
  country: '',
  website_url: '',
  gender: '',
  avatar: null,
  category: '',
  social_media: [...profile.social_media]
})

const genderMap = ref({
  male: 'Мужской',
  female: 'Женский',
  prefer_not_to_say: 'Не указан'
})

const countries = ref(['Казахстан', 'Россия', 'Беларусь', 'Узбекистан'])

const cityMap = ref({
  Казахстан: ['Астана', 'Алматы', 'Караганда', 'Шымкент', 'Актобе'],
  Россия: [
    'Москва',
    'Санкт-Петербург',
    'Симферополь',
    'Севастополь',
    'Керчь',
    'Евпатория',
    'Судак',
    'Бахчисарай',
    'Феодосия',
    'Новосибирск',
    'Екатеринбург',
    'Казань',
    'Нижний Новгород',
    'Челябинск',
    'Самара',
    'Омск',
    'Ростов-на-Дону',
    'Уфа',
    'Красноярск',
    'Воронеж',
    'Пермь',
    'Волгоград',
    'Краснодар',
    'Саратов',
    'Тюмень',
    'Тольятти',
    'Ижевск'
  ],
  Украина: ['Киев', 'Харьков', 'Одесса', 'Днепр', 'Львов'],
  Беларусь: ['Минск', 'Гомель', 'Могилёв', 'Витебск', 'Гродно'],
  Узбекистан: ['Ташкент', 'Самарканд', 'Бухара', 'Фергана', 'Наманган']
})

const availableCities = ref([])

const domain = import.meta.env.VITE_BACKEND_URL

onMounted(async () => {
  const token = localStorage.getItem('token')
  const user_id = localStorage.getItem('user_id')
  console.log('sidebarOpen:', props.sidebarOpen)

  if (!token || !user_id) {
    console.warn('Токен или user_id отсутствует')
    alert('Пожалуйста, войдите в систему')
    router.push('/login')
    return
  }

  try {
    const response = await fetch(`${domain}/user/profile/${user_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      if (response.status === 401) {
        alert('Сессия истекла. Пожалуйста, войдите снова.')
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        router.push('/login')
        return
      }
      throw new Error(errorData.message || 'Не удалось загрузить профиль')
    }

    const responseData = await response.json()
    const data = responseData.data || responseData

    // Заполнение профиля
    profile.user_id = data.user_id || user_id
    profile.user_name = data.user_name || localStorage.getItem('username') || ''
    profile.status = data.status || 'Люблю путешествовать.'
    profile.bio = data.bio || 'Люблю путешествовать и открывать новые маршруты!'
    profile.city = data.city || ''
    profile.country = data.country || ''
    profile.website_url = data.website_url || ''
    profile.gender = data.gender || ''
    profile.avatar_url = data.avatar_url ? `${domain}/assets/avatars/${data.avatar_url}` : ''
    profile.category = data.category || 'Пешие путешествия'
    profile.rating = data.rating || 4.7
    profile.routes = data.routes || [
      { id: 1, name: 'Крымская тропа' },
      { id: 2, name: 'Пеший маршрут по горам' },
      { id: 3, name: 'Велоэкскурсия по городу' }
    ]
    profile.social_media = data.social_media || [
      { platform: 'youtube', name: 'Блог Дениса', link: 'https://youtube.com/@blogdenisa' },
      { platform: 'twitch', name: 'TripLive', link: 'https://twitch.tv/triplive' },
      { platform: 'meteliyox', name: 'Денис Иващенко', link: 'https://meteliyox.com' },
      { platform: 'youtube', name: 'Блог Дениса', link: 'https://youtube.com/@blogdenisa' },
      { platform: 'twitch', name: 'TripLive', link: 'https://twitch.tv/triplive' },
      { platform: 'meteliyox', name: 'Денис Иващенко', link: 'https://meteliyox.com' },
    ]

    // Инициализация полей редактирования
    Object.assign(edited, {
      user_name: profile.user_name,
      status: profile.status,
      bio: profile.bio,
      city: profile.city,
      country: profile.country,
      website_url: profile.website_url,
      gender: profile.gender,
      avatar: null,
      category: profile.category,
      social_media: [...profile.social_media]
    })

    // Инициализация списка городов для текущей страны
    updateCities()
  } catch (err) {
    console.error('Ошибка при загрузке профиля:', err)
    alert('Не удалось загрузить профиль: ' + err.message)
  }
})

const getAvatarSrc = computed(() => {
  if (edited.avatar) {
    return URL.createObjectURL(edited.avatar)
  }
  return profile.avatar_url || avatarImage
})

const displayGender = computed(() => {
  return (gender) => genderMap.value[gender] || gender
})

const remainingChars = computed(() => {
  return {
    userName: 20 - (edited.user_name || '').length,
    status: 50 - (edited.status || '').length,
    bio: 500 - (edited.bio || '').length
  }
})

function updateCities() {
  const selectedCountry = edited.country
  availableCities.value = cityMap.value[selectedCountry] || []
  if (!availableCities.value.includes(edited.city)) {
    edited.city = ''
  }
}

function openModal() {
  Object.assign(edited, {
    user_name: profile.user_name,
    status: profile.status,
    bio: profile.bio,
    city: profile.city,
    country: profile.country,
    website_url: profile.website_url,
    gender: profile.gender,
    avatar: null,
    category: profile.category,
    social_media: [...profile.social_media]
  })
  updateCities()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function addSocial() {
  edited.social_media.push({ platform: 'dobaviti', name: '', link: '' })
}

function removeSocial(index) {
  edited.social_media.splice(index, 1)
}

async function saveProfile() {
  const token = localStorage.getItem('token')
  const user_id = localStorage.getItem('user_id')

  if (!token || !user_id) {
    alert('Пожалуйста, войдите в систему')
    router.push('/login')
    return
  }

  try {
    const formData = new FormData()
    formData.append('user_id', user_id)
    formData.append('user_name', edited.user_name || '')
    formData.append('status', edited.status || '')
    formData.append('bio', edited.bio || '')
    formData.append('country', edited.country || '')
    formData.append('city', edited.city || '')
    formData.append('website_url', edited.website_url || '')
    formData.append('gender', edited.gender || '')
    if (edited.avatar instanceof File) {
      formData.append('avatar', edited.avatar)
    }
    formData.append('category', edited.category || '')
    formData.append('social_media', JSON.stringify(edited.social_media))

    const response = await fetch(`${domain}/user/profile/change/${user_id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      if (response.status === 401) {
        alert('Сессия истекла. Пожалуйста, войдите снова.')
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        router.push('/login')
        return
      }
      throw new Error(errorData.message || 'Ошибка при сохранении профиля')
    }

    const responseData = await response.json()
    const data = responseData.data || responseData

    // Обновление профиля
    Object.assign(profile, {
      user_name: edited.user_name,
      status: edited.status,
      bio: edited.bio,
      city: edited.city,
      country: edited.country,
      website_url: edited.website_url,
      gender: edited.gender,
      avatar_url: data.avatar_url ? `${domain}/assets/avatars/${data.avatar_url}` : profile.avatar_url,
      category: edited.category,
      social_media: edited.social_media
    })

    edited.avatar = null
    showModal.value = false
  } catch (err) {
    console.error('Ошибка при сохранении профиля:', err)
    alert('Ошибка при сохранении профиля: ' + err.message)
  }
}

function onFileChange(e) {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Пожалуйста, войдите в систему')
    return
  }

  const file = e.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5 МБ.')
      return
    }
    edited.avatar = file
  }
}
</script>

<style scoped>
.container {
  max-width: 92rem;
  margin: 0 auto;
  padding: 1rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #ffffff;
  color: #333;
  border-radius: 2rem;
}

.banner {
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 2rem;
  overflow: visible;
  margin-bottom: -0.5rem;
  height: 20vw;
  min-height: 150px;
  max-height: 300px;
}

.avatar {
  position: absolute;
  left: 1.5rem;
  bottom: -5rem;
  width: 12vw;
  min-width: 100px;
  max-width: 150px;
  height: 12vw;
  min-height: 100px;
  max-height: 150px;
  border-radius: 50%;
  border: 0.5rem solid white;
  object-fit: cover;
  background-color: white;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.avatar-upload {
  display: flex;
  gap: 1vw;
  align-items: center;
}

.avatar-small {
  width: 8vw;
  min-width: 80px;
  max-width: 100px;
  height: 8vw;
  min-height: 80px;
  max-height: 100px;
  border-radius: 50%;
  border: 0.3rem solid white;
  object-fit: cover;
  background-color: white;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
}

.info-block {
  position: relative;
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
}

.text-info {
  display: flex;
  flex-direction: column;
  margin-left: 10rem;
  margin-top: -1rem;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

h1 {
  font-size: clamp(1.2rem, 4vw, 1.875rem);
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.check-icon {
  width: 1.2rem;
  height: 1.2rem;
  color: #22c55e;
}

.save-action {
  width: 100%;
}

.edit_avatar_modal {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
}

.subtitle {
  color: #4b5563;
  font-size: clamp(0.9rem, 2vw, 1.125rem);
  line-height: 1.4;
}

.readers-count {
  color: #6b7280;
  font-size: clamp(0.7rem, 1.5vw, 0.875rem);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon-message {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.buttons-group {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.75rem;
}

button {
  padding: 0.8rem 2.5rem;
  border-radius: 12px;
  background-color: #f3f4f6;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #e5e7eb;
}

.status {
  color: #4b5563;
  font-size: clamp(0.9rem, 2vw, 1.125rem);
  line-height: 1.4;
}

.info-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
  color: #374151;
  align-items: start;
}

.location-category {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.location-category h3 {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #111827;
  font-size: clamp(0.9rem, 2vw, 1.125rem);
}

.location-category p {
  margin: 0;
  color: #374151;
  font-size: clamp(0.8rem, 1.8vw, 1rem);
}

.social-media {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  flex-wrap: wrap;
}

.social-card {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: #f9f9f9;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 80px;
}

.social-icon {
  margin-right: 0.5rem;
}

.platform-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.social-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.social-name {
  font-weight: 600;
  color: #333;
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.social-link {
  color: #666;
  font-size: clamp(0.6rem, 1.2vw, 0.8rem);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 15ch;
}

.social-link:hover {
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin-top: 0;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #111827;
  font-size: clamp(1rem, 3vw, 1.5rem);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.buttons-group.with-sidebar {
    position: static;
    justify-content: end;
    margin-top: 0rem;
}

.close-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #374151;
}

.close-button:hover .close-icon {
  color: #111827;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-content label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: space-between;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
}

.char-count {
  font-size: clamp(0.7rem, 1.5vw, 0.8rem);
  color: #6b7280;
}

.edit-input {
  border: 1px solid #4949493d;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: clamp(0.9rem, 2vw, 1rem);
  width: 100%;
}

.edit-input.description-input {
  resize: vertical;
  min-height: 80px;
}

.social-edit {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.remove-social {
  background: #ff4444;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
  cursor: pointer;
}

.remove-social:hover {
  background: #cc0000;
}

.add-social {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
  cursor: pointer;
  margin-top: 0.5rem;
}

.add-social:hover {
  background: #45a049;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

select.edit-input {
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 98%;
  background-position-y: 50%;
}
@media (max-width: 1450px) {
  .buttons-group {
    position: static;
    justify-content: end;
    margin-top: 0rem;
  }
}
@media (max-width: 1200px) {
  .buttons-group {
    position: static;
    justify-content: end;
    margin-top: 0rem;
  }
  .avatar {
    left: 0.5rem;
    width: 18vw;
    height: 18vw;
    min-width: 80px;
    min-height: 80px;
  }
  .text-info {
    margin-left: 9.4rem;
  }
  button {
    padding: 0.5rem 1.5rem;

  }
}

@media (max-width: 1150px) {
  .text-info {
    margin-left: 8.8rem;
  }
}

@media (max-width: 900px) {
  .banner {
    height: 25vw;
    min-height: 120px;
  }
  .avatar {
    bottom: -3rem;
    left: 0.5rem;
    width: 18vw;
    height: 18vw;
    min-width: 80px;
    min-height: 80px;
  }
  .text-info {
    margin-left: 7.4rem;
  }
  .title-with-icon {
    margin-left: 0;
  }
  .readers-count {
    margin-left: 0;
  }
  .status {
    margin-left: 0;
  }
  .info-grid {
    grid-template-columns: 1fr;
    margin-left: 0;
  }
  .location-category {
    margin-left: 0;
  }
  .buttons-group {
    position: static;
    margin-top: 1rem;
  }
  .social-media {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

@media (max-width: 640px) {
  .banner {
    height: 30vw;
    min-height: 100px;
  }
  .avatar {
    width: 25vw;
    height: 25vw;
    min-width: 80px;
    min-height: 80px;
  }
  .avatar-small {
    width: 10vw;
    height: 10vw;
    min-width: 60px;
    min-height: 60px;
  }
  h1 {
    font-size: clamp(1rem, 3vw, 1.4rem);
  }
  .social-media {
    grid-template-columns: 1fr;
  }
  .modal {
    width: 95%;
    padding: 1rem;
  }
  .text-info {
    margin-left: 7.9rem;
  }
}

@media (max-width: 480px) {
  .banner {
    height: 35vw;
    min-height: 80px;
  }
  .avatar {

    left: 0.3rem;
  }
  .info-block {
    padding: 1rem;
  }
  .buttons-group button {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
  }
  .social-card {
    min-height: 60px;
    padding: 0.3rem;
  }
  .platform-icon {
    width: 1.2rem;
    height: 1.2rem;
  }
  .social-name {
    font-size: 0.6rem;
  }
  .social-link {
    font-size: 0.5rem;
    max-width: 10ch;
  }
  .text-info {
    margin-left: 6.9rem;
  }
}

@media (max-width: 320px) {
  .banner {
    height: 40vw;
    min-height: 60px;
  }
  .avatar {
    width: 18vw;
    height: 18vw;
    min-width: 60px;
    min-height: 60px;
  }
  .avatar-small {
    width: 12vw;
    height: 12vw;
    min-width: 50px;
    min-height: 50px;
  }
  h1 {
    font-size: 0.9rem;
  }
  .modal h2 {
    font-size: 1rem;
  }
  .edit-input {
    font-size: 0.8rem;
    padding: 0.3rem;
  }
  .char-count {
    font-size: 0.6rem;
  }
  .modal-actions button {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
}
</style>