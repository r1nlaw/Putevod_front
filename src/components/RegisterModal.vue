<template>
  <div v-show="isOpen" class="modal-overlay" @click.self="close">
    <!-- Ошибка-модалка -->
    <div v-if="errorModal" class="error-modal">
      <div class="error-box">
        <h3>Ошибка</h3>
        <p>{{ errorMessage }}</p>
        <button @click="errorModal = false" class="primary-btn">Закрыть</button>
      </div>
    </div>

    <div class="modal-content">
      <button class="close-btn" @click="close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 6L18 18" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <h2>Войдите в Путевод</h2>
      <div class="switch-container">
        <div class="switch-tabs">
          <button 
            class="switch-tab" 
            :class="{ 'active': !isRegistering }"
            @click="isRegistering = false"
          >
            Вход
          </button>
          <button 
            class="switch-tab" 
            :class="{ 'active': isRegistering }"
            @click="isRegistering = true"
          >
            Регистрация
          </button>
          <div class="switch-indicator" :class="{ 'right': isRegistering }"></div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="isRegistering" class="form-group">
          <input id="name" v-model="name" type="text" required placeholder="Имя" />
        </div>

        <div class="form-group">
          <input id="email" v-model="email" type="email" required placeholder="Email" />
        </div>
        <div class="form-group password-group">
          <div class="password-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Пароль"
            />
            <button
              type="button"
              class="toggle-password"
              @click="togglePassword"
              :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
            >
              <img
                :src="showPassword ? eyeOffIcon : eyeIcon"
                alt="toggle password visibility"
                class="toggle-icon"
              />
            </button>
          </div>
        </div>
          <div class="options-row">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="rememberPassword" />
              <span class="checkmark"></span>
              Сохранить пароль?
            </label>

            <button type="button" class="forgot-password" @click="onForgotPassword">
              Забыли пароль?
            </button>
          </div>        

        <div class="modal-actions">
          <div class="auth-buttons">

            <button type="submit" class="primary-btn">
              {{ isRegistering ? 'Зарегистрироваться' : 'Войти' }}
            </button>
            <div class="social-buttons">
              <button type="button" class="social-btn google" @click="authWithGoogle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Google icon -->
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                  <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.1H2.18V16.94C4 20.53 7.7 23 12 23Z" fill="#34A853"/>
                  <path d="M5.84 14.1C5.62 13.43 5.5 12.72 5.5 12C5.5 11.28 5.62 10.57 5.84 9.9V7.06H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.94L5.84 14.1Z" fill="#FBBC05"/>
                  <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 4 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
                </svg>
                <span class="social-label">Google</span>
              </button>

              <button type="button" class="social-btn vk" @click="authWithVK">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- VK icon -->
                  <path d="M12.65 16.11C7.27 16.11 4.07 12.98 3.91 7H6.71C6.81 11.45 9.05 13.11 10.58 13.47V7H13.21V10.93C14.73 10.78 16.31 9.23 16.85 7H19.47C19.09 9.8 17.22 11.73 15.8 12.5C17.22 13.16 19.26 14.8 20 16.11H17.13C16.55 14.92 15.21 13.55 13.21 13.4V16.11H12.65Z" fill="#07F"/>
                </svg>
                <span class="social-label">VK</span>
              </button>

              <button type="button" class="social-btn apple" @click="authWithApple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Apple icon -->
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.1C14.21 5.85 13.07 6.5 12 6.39C11.9 5.21 12.45 4.05 13 3.5Z" fill="#999"/>
                </svg>
                <span class="social-label">Apple</span>
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from 'vue'
import eyeIcon from '@/assets/icons/eye.png'
import eyeOffIcon from '@/assets/icons/eye-off.png'
const rememberPassword = ref()

const emit = defineEmits(['modal-open', 'close'])

const isOpen = ref(false)
const isRegistering = ref(false)

const name = ref('')
const email = ref('')
const password = ref('')

const showPassword = ref(false)

const errorModal = ref(false)
const errorMessage = ref('')

function togglePassword() {
  showPassword.value = !showPassword.value
}

function open() {
  isOpen.value = true
  isRegistering.value = false
  emit('modal-open')
}

function close() {
  isOpen.value = false
  isRegistering.value = false
  name.value = ''
  email.value = ''
  password.value = ''
  showPassword.value = false
  emit('close')
}


function toggleMode() {
  isRegistering.value = !isRegistering.value
}

function showError(message) {
  errorMessage.value = message
  errorModal.value = true
}

function authWithGoogle() {
  // Реализация авторизации через Google
  console.log('Авторизация через Google')
}

function authWithVK() {
  // Реализация авторизации через VK
  console.log('Авторизация через VK')
}

function authWithApple() {
  // Реализация авторизации через Apple
  console.log('Авторизация через Apple')
}

async function handleSubmit() {
  if (!email.value || !password.value || (isRegistering.value && !name.value)) {
    showError('Пожалуйста, заполните все поля формы.')
    return
  }

  try {
    const endpoint = isRegistering.value
      ? `${import.meta.env.VITE_BACKEND_URL}/user/signUp`
      : `${import.meta.env.VITE_BACKEND_URL}/user/signIn`

    const payload = isRegistering.value
      ? { username: name.value, email: email.value, password_hash: password.value }
      : { email: email.value, password_hash: password.value }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      let message = 'Неизвестная ошибка'

      const errorData = await response.json()

      switch (response.status) {
        case 400:
          message = errorData.message || 'Неверно введена электронная почта'
          break
        case 401:
          message = errorData.error === 'user is not verified'
            ? 'Пользователь не верифицирован. Пожалуйста, проверьте вашу почту для подтверждения регистрации.'
            : errorData.message || 'Недопустимый никнейм'
          break
        case 402:
          message = errorData.message || 'Имя должно состоять только из латиницы или кириллицы'
          break
        case 403:
          message = errorData.message || 'Пароль должен содержать больше 6 символов'
          break
        case 405:
          message = errorData.message || 'Неверный email или пароль'
          break
        default:
          message = errorData.message || errorData.error || 'Произошла ошибка при обработке запроса'
      }

      showError(`Ошибка: ${message}`)
      return
    }

    const data = await response.json()

    if (isRegistering.value) {
      // После успешной регистрации автоматически логинимся
      isRegistering.value = false
      // Меняем payload и endpoint под логин
      const loginPayload = { email: email.value, password_hash: password.value }
      const loginResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/signIn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload)
      })

      if (!loginResponse.ok) {
        showError('Ошибка входа после регистрации.')
        return
      }

      const loginData = await loginResponse.json()
      if (loginData.user) {
        localStorage.setItem('username', loginData.user.username)
        localStorage.setItem('user_id', loginData.user.id)
      }
      if (loginData.token) {
        localStorage.setItem('token', loginData.token)
      }
      window.location.reload()
      close()
      return
    }

    if (data.user) {
      localStorage.setItem('username', data.user.username)
      localStorage.setItem('user_id', data.user.id)
    }
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    window.location.reload()
    close()

  } catch (error) {
    console.error('Ошибка при отправке запроса:', error)
    showError('Не удалось подключиться к серверу. Проверьте соединение.')
  }
}

defineExpose({ open, close })
</script>

<style scoped>
input {
  max-width: 675px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  pointer-events: auto;
  justify-content: center;
  align-items: center;
  z-index: 1500;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  position: relative;
  background-color: #ffffff;
  border-radius: 55px;
  padding: 3rem;
  width: 90%;
  pointer-events: auto;
  max-width: 700px;
  z-index: 1501;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
  
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f0f0f0;
}

h2 {
  margin-bottom: 1.5rem;
  text-align: left;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.switch-container {
  margin-bottom: 1.5rem;
}

.switch-tabs {
  position: relative;
  display: flex;
  background-color: #f0f0f0;
  border-radius: 15px;
  padding: 4px;
  height: 50px;
}

.switch-tab {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  z-index: 1;
  transition: color 0.3s ease;
  border-radius: 15px;
}

.switch-tab.active {
  color: #444;
}

.switch-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background-color: #ffffff;
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.switch-indicator.right {
  transform: translateX(100%);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #444;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.2s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

.modal-actions {
  margin-top: 1.5rem;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.primary-btn {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: #0d3c2f;
  color: white;
  border: none;
  min-width: 180px;
}

.primary-btn:hover {
  background-color: #125341;
}

.social-buttons {
  display: flex;
  gap: 10px;
}

.social-btn {
  width: 130px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.social-label {
  font-size: 14px;
  padding: 20%;
  font-weight: 500;
}
.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.social-btn.google {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
}

.social-btn.vk {
  background-color: #f0f0f0;
  border: 1px solid;
  border-color:#e4e2e2;
}

.social-btn.apple {
  border: 1px solid;
  border-color:#e4e2e2;
  background-color: #f0f0f0;
  color: #000000;
}

.toggle-section {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
  color: #555;
}

.link-btn {
  background: none;
  border: none;
  color: #125341;
  cursor: pointer;
  font-weight: 600;
  margin-left: 6px;
  padding: 0;
}

.link-btn:hover {
  text-decoration: underline;
}


.error-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1600;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-box {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.error-box h3 {
  color: #b00020;
  margin-bottom: 1rem;
}

.error-box p {
  color: #333;
  margin-bottom: 1.5rem;
}

.password-group {
  position: relative;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.toggle-icon {
  width: 20px;
  height: 20px;
}

.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.remember-password {
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px; 
}
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.custom-checkbox input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-color: #eee;
  border: none;
  outline: none;
  cursor: pointer;
  position: relative;
  border-radius: 4px;
}

.custom-checkbox input[type="checkbox"]::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 6px;
  width: 6px;
  height: 12px;
  align-items: center;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(35deg);
  opacity: 0;
  transition: opacity 0.2s;
}
.custom-checkbox input[type="checkbox"]:checked {
  background-color: #0d3c2f;
}

.custom-checkbox input[type="checkbox"]:checked::after {
  opacity: 1;
}

.forgot-password {
  background: none;
  border: none;
  color: #0d3c2f;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0;
}

/* Animations */
@keyframes fadeIn {
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.6);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 900px){
  .auth-buttons {
    display: block;
  }
  .primary-btn {
    width: 100%;
  }
  .social-buttons {
    margin-top: 5vw;
    gap: 0.5rem;
  }
}
</style>