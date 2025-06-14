<template>
  <header class="header">
    <div class="header__logo">
      <div class="header__logo-img">
        <img src="/src/assets/logo.png" alt="logo" />
      </div>
      <div class="header__logo-text">
        <div class="header__logo-subtitle">достопримечательности</div>
        <div class="header__logo-title">путевод</div>
      </div>
    </div>
    <div class="header__center" :class="{ 'header__center--sidebar': sidebarOpen }">
      <div class="header__search">
        <input type="text" placeholder="поиск" />
        <img :src="search_icon" alt="search" class="header__search-icon" />
      </div>

      <div class="header__actions">
        <div class="header__counter">
          <div class="header__circle">2</div>
          <img :src="directionsIcon" alt="directions" class="header__arrow" />
        </div>

        <div class="header__message">

        <button class="header__button">
          <img :src="messageIcon" alt="messages" />
        </button>
      </div>
        <div class="header__avatar-wrapper">
          <div class="header__avatar">A</div>
          <button class="header__arrow-btn"><img :src="arrow" alt="arrow" /></button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import messageIcon from '@/assets/icons/messages.png'
import arrow from '@/assets/icons/arrow.png'
import search_icon from '@/assets/icons/search_icon.png'
import directionsIcon from '@/assets/icons/directions.png'

const props = defineProps({
  sidebarOpen: Boolean
})
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
  z-index: 100;
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
  margin-top: -7px;
  letter-spacing: -1px;
}
.header__logo-subtitle {
  font-size: 9px;
  color: #2d4834;
  opacity: 0.7;
  margin-top: -4px;
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

</style>
