<template>
  <header class="header">
    <div id="burger-target"></div>
    <div class="header__logo">
      <div class="header__logo-img">
        <router-link to="/" class="header__logo-img">
          <img src="/src/assets/logo.png" alt="logo" />
        </router-link>
        
      </div>
      <div class="header__logo-text">
        <div class="header__logo-subtitle">достопримечательности</div>
        <router-link to="/" class="header__logo-title">
          путевод
        </router-link>
      </div>
    </div>
    <div class="header__center" :class="{ 'header__center--sidebar': sidebarOpen }">
      <div class="header__search">
        <input type="text" placeholder="поиск" />
        <img :src="search_icon" alt="search" class="header__search-icon" />
      </div>

      <div class="header__actions">
        <router-link to="/routeList" class="header__counter-router">
          <div class="header__counter">
          <div class="header__circle">2</div>
          <img :src="directionsIcon" alt="directions" class="header__arrow" />
        </div>
        </router-link>

        <div class="header__message">
          <button class="header__button">
            <img :src="messageIcon" alt="messages" />
          </button>
        </div>

        <RegisterModal ref="registerModal" @close="closeModal" />
        <div class="header__avatar-wrapper" @click="handleProfileClick">
          <div class="header__avatar">A</div>
          <button class="header__arrow-btn">
            <img :src="arrow" alt="arrow" />
          </button>
        </div>

      </div>
    </div>
    
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import messageIcon from '@/assets/icons/messages.png'
import arrow from '@/assets/icons/arrow.png'
import search_icon from '@/assets/icons/search_icon.png'
import directionsIcon from '@/assets/icons/directions.png'
import RegisterModal from '@/components/RegisterModal.vue'

const props = defineProps({
  sidebarOpen: Boolean,
})

const registerModal = ref(null)
const router = useRouter()

function openRegisterModal() {
  if (registerModal.value) {
    registerModal.value.open()
  }
}

function closeModal() {
  console.log('Register modal closed')
}

function handleProfileClick() {
  const token = localStorage.getItem('token')

  if (token) {
    router.push('/profile')
  } else {
    openRegisterModal()
  }
}

</script>
<style scoped>
.header__search img {
  width: 22px;
  height: 22px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(to bottom, rgb(247, 247, 247) 50%, rgba(247, 247, 247, 0.377) 100%);
  padding: 15px 88px;
  border-radius: 0;
  margin: 0;
  width: 100vw;
  box-sizing: border-box;
  min-height: 100px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 32px;
}
.header__logo-img {
  max-width: 45px;
  max-height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  background: #f7f7f7d5;
}

.header__logo-img img {
  height: 37px;
  width: auto;
}

.header__arrow {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}


.header__logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}
.header__logo-title {
  font-size: 32px;
  font-weight: 700;
  color: #2d4834;
  background: #f7f7f7d5;
  margin-top: -7px;
  letter-spacing: -1px;
  text-decoration: none;
  cursor: pointer;
}
.header__logo-subtitle {
  font-size: 9px;
  color: #2d4834;
  opacity: 0.7;
  margin-top: -4px;
  margin-left: 2px;
}
.header__center {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 32px;
  padding: 8px 24px 8px 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  flex: 1;
  min-width: 0;
  justify-content: space-between;
  transition: max-width 0.4s cubic-bezier(.77,0,.18,1);
  max-width: 100vw;
}
.header__center--sidebar {
  max-width: calc(100vw - 250px);
}
.header__search {
  position: relative;
  flex: 1;
  max-width: 470px;
  margin-right: 24px;
}
.header__search input {
  width: 100%;
  padding: 10px 20px 10px 44px; 
  border: none;
  border-radius: 24px;
  background: #f7f7f7;
  font-size: 18px;
  color: #333;
}
.header__search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  pointer-events: none;
}

#burger-target {
  position: absolute;
  left: 16px;
  top: 16px;
  z-index: 10;
}

.header__button {
  width: 32px;
  height: 32px;
  background: #ffffff;
  border: none;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header__message{
  border-radius: 20px;
  
}
.header__counter-router {
  text-decoration: none;
  background: #ffffffd5;
}

.header__button img {
  width: 24px;  
  height: 24px;
  object-fit: contain;
  pointer-events: none; 
  background: #f7f7f7d5;
}
.header__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header__counter {
  display: flex;
  align-items: center;
  background: #2d4834;
  color: #fff;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  padding: 0 12px 0 0; /* убрали левый паддинг */
  font-size: 18px;
  font-weight: 600;
  gap: 8px;
  position: relative;
  height: 36px;
}


.header__circle {
  width: 37px;
  height: 36px;
  background: #3a5f45; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  flex-shrink: 0;
  margin-left: -12px; 
  z-index: 1;
}

.header__arrow {
  font-size: 20px;
}
.header__button {
  width: 32px;
  height: 32px;
  background: #ffffff;
  border: none;
  border-radius: 50%;
}
.header__avatar {
  width: 36px;
  height: 36px;
  background: #f7b6c2;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}
.header__arrow-btn {
  width: 32px;
  height: 32px;
  background: #fff;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  color: #2d4834;
  font-weight: 700;
}
.header__avatar-wrapper {
  display: flex;
  align-items: center;
  background: #f7f7f7d5;
  border-radius: 20px;
  gap: 8px;
}


.header__arrow-btn img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.header__register-button {
  background-color: #2d4834;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.header__register-button:hover {
  background-color: #3a5f45;
}
@media (max-width: 900px) {
  .header {
    width: 100vw;
    left: 0;
    right: 0;
    border-radius: 0;
    min-height: 70px;
    padding: 0 10px;
    min-width: 0;
    margin: 0;
    gap: 40px;
    box-sizing: border-box;
  }
  #burger-target {
    left: 38px;
    top: 11px;
    font-size: 1rem;
    

  }

  .header__logo {
    margin-right: 4px;
    gap: 4px;
  }
  .header__center--sidebar {
    max-width: 100vh;
  }
  .header__logo-title,
  .header__logo-subtitle {
    display: none !important;
  }
  .header__logo-img {
    max-width: 24px;
    max-height: 24px;
    border-radius: 6px;
  }
  .header__logo-img img {
    height: 27px;
  }
  .header__search-icon {
    width: 20px !important;
    height: 20px !important;
    left: 6px;
  }
  .header__button img {
    width: 27px;
    height: 27px;
  }
  .header__arrow {
    width: 14px;
    height: 14px;
    margin-right: 0.5vh;
  }
  .header__avatar {
    width: 27px;
    height: 27px;
    font-size: 10px;
  }
  .header__avatar-wrapper {
    gap: 2px;
    border-radius: 15px;
    width: 50px;
  }
  .header__arrow-btn {
    width: 12px;
    height: 19px;
    font-size: 8px;
  }
  .header__counter {
    font-size: 8px;
    height: 27px;
    padding: 0 2px 0 0;
    border-radius: 10px;
  }
  .header__circle {
    width: 27px;
    height: 27px;
    font-size: 14px;
    margin-left: -2px;
  }
  .header__center {
    padding: 2px 4px 2px 2px;
    border-radius: 15px;
    
  }
  .header__search {
    max-width: 150px;
    margin-right: 6px;
  }
  .header__search input {
    font-size: 14px;
    padding: 6px 10px 6px 28px;
    border-radius: 15px;
    height: 37px;
    min-width: 0;
  }
  .header__actions {
    gap: 4px;
    margin-right: 1%;
  }
  .header__register-button {
    display: none !important;
    padding: 2px 5px;
    font-size: 9px;
    border-radius: 5px;
  }
}
</style>
