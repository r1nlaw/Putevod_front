<template>
  <div class="container">
    <!-- Баннер -->
    <div
        class="banner"
        :style="{ backgroundImage: `url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1470&q=80')` }"
    >
      <label v-if="isEditing" class="avatar-upload">
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
            <div v-if="isEditing">
              <input v-model="edited.user_name" class="edit-input title-input" placeholder="Имя пользователя" />
            </div>
            <h1 v-else>{{ profile.user_name || 'Без имени' }}</h1>
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
          <div v-if="isEditing">
            <input v-model="edited.bio" class="edit-input subtitle-input" placeholder="Биография" />
            <input v-model="edited.country" class="edit-input" placeholder="Страна" />
            <input v-model="edited.city" class="edit-input" placeholder="Город" />
            <input v-model="edited.website_url" class="edit-input" placeholder="Веб-сайт" />
            <input v-model="edited.gender" class="edit-input" placeholder="Пол" />
          </div>
          <p v-else class="subtitle">
            {{ profile.bio || 'Нет биографии' }} <span class="emoji">💀</span>
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

        <div class="buttons-group">
          <button>Статистика</button>
          <button @click="toggleEdit">
            {{ isEditing ? 'Сохранить' : 'Редактировать' }}
          </button>
          <button aria-label="Дополнительные опции">...</button>
        </div>
      </div>

      <div class="info-grid">
        <div>
          <h3>Информация</h3>
          <div v-if="isEditing">
            <textarea v-model="edited.bio" class="edit-input description-input" placeholder="Биография"></textarea>
          </div>
          <div v-else>
            <p><strong>Страна:</strong> {{ profile.country || 'Не указана' }}</p>
            <p><strong>Город:</strong> {{ profile.city || 'Не указан' }}</p>
            <p><strong>Веб-сайт:</strong> {{ profile.website_url || 'Не указан' }}</p>
            <p><strong>Пол:</strong> {{ profile.gender || 'Не указан' }}</p>
          </div>
        </div>

        <div class="location-category">
          <div class="location">
            <h3>Местоположение</h3>
            <p v-if="isEditing">
              <input v-model="edited.city" class="edit-input" placeholder="Город" />
              <input v-model="edited.country" class="edit-input" placeholder="Страна" />
            </p>
            <p v-else>{{ profile.city || 'Астана' }}, {{ profile.country || 'Казахстан' }}</p>
          </div>
          <div class="category">
            <h3>Категория</h3>
            <p v-if="isEditing">
              <input v-model="edited.category" class="edit-input" placeholder="Категория" />
            </p>
            <p v-else>{{ profile.category || 'Пешие путешествия' }}</p>
          </div>
        </div>
      </div>

      <div class="social-links">
        <!-- ... остальные ссылки без изменений ... -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import avatarImage from '@/assets/images/user_avatar.png'

const isEditing = ref(false)
const router = useRouter()

const profile = reactive({
  user_id: null,
  user_name: '',
  bio: '',
  city: '',
  country: '',
  website_url: '',
  gender: '',
  avatar_url: '',
  category: '',
  rating: 0,
  routes: []
})

const edited = reactive({
  user_name: '',
  bio: '',
  city: '',
  country: '',
  website_url: '',
  gender: '',
  avatar: null,
  category: ''
})

const domain = import.meta.env.VITE_BACKEND_URL

onMounted(async () => {
  const token = localStorage.getItem('token')
  const user_id = localStorage.getItem('user_id')

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

    // Инициализация полей редактирования
    Object.assign(edited, {
      user_name: profile.user_name,
      bio: profile.bio,
      city: profile.city,
      country: profile.country,
      website_url: profile.website_url,
      gender: profile.gender,
      avatar: null,
      category: profile.category
    })
  } catch (err) {
    console.error('Ошибка при загрузке профиля:', err)
    alert('Не удалось загрузить профиль: ' + err.message)
  }
})
const getAvatarSrc = computed(() => {
  if (edited.avatar) {
    return URL.createObjectURL(edited.avatar) // Предпросмотр загруженного файла
  }
  return profile.avatar_url || avatarImage
})

async function toggleEdit() {
  const token = localStorage.getItem('token')
  const user_id = localStorage.getItem('user_id')

  if (!token || !user_id) {
    alert('Пожалуйста, войдите в систему')
    router.push('/login')
    return
  }

  if (isEditing.value) {
    try {
      const formData = new FormData()
      formData.append('user_id', user_id)
      formData.append('user_name', edited.user_name || '')
      formData.append('bio', edited.bio || '')
      formData.append('country', edited.country || '')
      formData.append('city', edited.city || '') // Используем "city" вместо "cite"
      formData.append('website_url', edited.website_url || '')
      formData.append('gender', edited.gender || '')
      if (edited.avatar instanceof File) {
        formData.append('avatar', edited.avatar)
      }

      console.log('Отправляем FormData:', [...formData.entries()]) // Отладка

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
        bio: edited.bio,
        city: edited.city,
        country: edited.country,
        website_url: edited.website_url,
        gender: edited.gender,
        avatar_url: data.avatar_url ? `${domain}/assets/avatars/${data.avatar_url}` : profile.avatar_url,
        category: edited.category
      })

      edited.avatar = null // Сброс файла аватара
    } catch (err) {
      console.error('Ошибка при сохранении профиля:', err)
      alert('Ошибка при сохранении профиля: ' + err.message)
    }
  } else {
    // Вход в режим редактирования
    Object.assign(edited, {
      user_name: profile.user_name,
      bio: profile.bio,
      city: profile.city,
      country: profile.country,
      website_url: profile.website_url,
      gender: profile.gender,
      avatar: null,
      category: profile.category
    })
  }

  isEditing.value = !isEditing.value
}
function onFileChange(e) {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Пожалуйста, войдите в систему')
    return
  }

  const file = e.target.files[0]
  if (file) {
    // Проверка размера файла (5 МБ = 5 * 1024 * 1024 байт)
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5 МБ.')
      return
    }
    edited.avatar = file // Сохраняем объект File
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
  .edit-input.title-input {
    margin-left: 0;
    width: 105%;
  }
  .edit-input.subtitle-input {
    margin-left: 8.06vw;
    width: 49%;
  }
  .edit-input {
    resize: none;
    border: 1px solid #4949493d;
    border-radius: 5px;
  }
  .edit-input.description-input {
    resize: none;
    width: 100%;
  }

  .banner {
    position: relative;
    background-size: cover;
    background-position: center;
    border-radius: 2rem;
    overflow: visible;
    margin-bottom: -0.0rem;
    height: 220px;
  }

  .avatar {
    position: absolute;
    left: 1.5rem;
    bottom: -100px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 7px solid white;
    object-fit: cover;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }

  .avatar-small {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 7px solid white;
    object-fit: cover;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
  }


  .info-block {
    position: relative;
    background-color: white;
    border-radius: 1rem;
    padding: 1.5rem;
    padding-top: 0.1rem;
    margin-bottom: 1.9rem;
  }

  .info-header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: space-between;
  }


  .avatar-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }

  .text-info {
    display: flex;
    flex-direction: column;
    margin-left: 0.5rem;
  }

  .title-with-icon {
    display: flex;
    align-items: center;
    margin-left: 9.7rem;
    gap: 0.5rem;
  }

  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .check-icon {
    width: 20px;
    height: 20px;
    color: #22c55e;
  }

  .subtitle {
    color: #4b5563;
    margin-top: -0.5rem;
    font-size: 1.125rem;
    line-height: 1.4;
    margin-left: 9.7rem;
  }

  .emoji {
    font-size: 1.25rem;
  }

  .readers-count {
    color: #6b7280;
    margin-top: 0.25rem;
    margin-left: 9.7rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .icon-message {
    width: 16px;
    height: 16px;
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


.info-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  color: #374151;
  align-items: start;
  margin-left: 2rem;
}

.location-category {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 3rem;

}

.location-category h3 {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #111827;
}

.location-category p {
  margin: 0;
  color: #374151;
}

@media (max-width: 900px) {
  .banner{
    max-height: 40vw;
    border-radius: 1rem;
  }
  h1 {
    font-size: 1.4rem;
  }
  .subtitle {
    font-size: 1.0rem;
  }
  .avatar {
    max-width: 30vw;
    max-height: 30vw;
    left: 0.5rem;
    bottom: -3rem;
  }
  .readers-count {
    font-size: 0.8rem;
  }
  .edit-input.subtitle-input {
    margin-left: 41.4vw;
  }
  .info-grid {
    margin-top: 5rem;
    margin-left: 0rem;
  }

  .buttons-group {
    position: absolute;
    top: 28%;
    right: 0;
  }
  button {
    padding: 0.3rem 0.5rem;
    font-size: 0.8rem;

  }
  .info-block {
    padding: 0rem;
  }



}


@media (max-width: 640px) {
  .info-grid {
    grid-template-columns: 2fr 1fr;
  }
  .text-info{
    margin-left: 0%;
  }
}

@media (max-width: 412px) {

  .text-info{
    margin-left: -8%;
  }
}


  h3 {
    margin: 0 0 0.25rem 0;
    font-weight: 600;
    color: #111827;
  }

  .social-links {
    margin-top: 3rem;
    margin-bottom: 2rem;
    margin-left: 2rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .social-link {
    display: flex;
    align-items: center;
    background-color: white;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.1);
    text-decoration: none;
    color: #111827;
    flex-grow: 1;
    max-width: 320px;
    transition: box-shadow 0.2s ease;
  }

  .social-link:hover {
    box-shadow: 0 4px 6px rgb(0 0 0 / 0.15);
  }

  .social-icon {
    width: 30px;
    height: 30px;
    margin-right: 0.75rem;
    object-fit: contain;
  }

  .social-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .social-text .name {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25;
  }

  .social-text .subs {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .social-link.youtube:hover {
    box-shadow: 0 0 10px #ff0000aa;
  }

  .social-link.twitch:hover {
    box-shadow: 0 0 10px #9146ffaa;
  }

  .social-link.vk:hover {
    box-shadow: 0 0 10px #4a76a8aa;
  }

  .add-button {
    justify-content: center;
    color: #2563eb;
    border: 2px dashed #2563eb;
    background-color: transparent;
    max-width: 100px;
  }

  .add-icon {
    width: 24px;
    height: 24px;
    margin-right: 0.5rem;
  }
  </style>
