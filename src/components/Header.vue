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
      </div>
      <div class="header__actions">
        <div class="header__counter">
          <span>2</span>
          <span class="header__arrow">→</span>
        </div>
        <button class="header__button"></button>
        <div class="header__avatar">А</div>
        <button class="header__arrow-btn">→</button>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  sidebarOpen: Boolean
})
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #f7f7f7;
  padding: 25px 88px;
  border-radius: 0;
  margin: 0;
  width: 100vw;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  min-height: 100px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-bottom: 1px solid #f7f7f7d5;
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
  padding: 8px 24px 8px 16px;
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
  flex: 1;
  max-width: 470px;
  margin-right: 24px;
}
.header__search input {
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 24px;
  background: #f7f7f7;
  font-size: 18px;
  color: #333;
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
  border-radius: 24px;
  padding: 4px 16px;
  font-size: 18px;
  font-weight: 600;
  gap: 8px;
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
</style>
