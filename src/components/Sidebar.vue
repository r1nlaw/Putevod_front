<template>
  <div :class="['sidebar-wrapper', { open: modelValue }]">

    <div class="sidebar-header">
      <span class="sidebar-title">Разделы</span>
      <button class="sidebar-back" title="Назад" @click="$emit('update:modelValue', false)">&#8592;</button>
    </div>
    <ul class="sidebar-nav">
      <li class="sidebar-item sidebar-item--active">
        <span class="sidebar-icon">🏛️</span>
        <span>Достопримечательности</span>
      </li>
      <li class="sidebar-item">
        <span class="sidebar-icon">🔤</span>
        <span>Маршруты</span>
      </li>
      <li class="sidebar-item">
        <span class="sidebar-icon">#</span>
        <span>Лента</span>
      </li>
      <li class="sidebar-item">
        <span class="sidebar-icon">🔥</span>
        <span>Мероприятия</span>
      </li>
      <li class="sidebar-item">
        <span class="sidebar-icon">🎯</span>
        <span>Испытания</span>
      </li>
      <li class="sidebar-item">
        <span class="sidebar-icon">🗺️</span>
        <span>Путеводитель</span>
      </li>
    </ul>
    <button class="menu-toggle" @click="$emit('update:modelValue', !modelValue)">
      <span v-if="modelValue">&#10005;</span>
      <span v-else>&#9776;</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 0 16px 0;
  margin: 24px 24px 0 24px;
}
.sidebar-title {
  font-size: 20px;
  color: #000000a8;
  font-weight: 700;
}
.sidebar-back {
  background: #f7f7f7;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  color: #fff;
  border: none;
  font-size: 2em;
  cursor: pointer;
  z-index: 10;
}
.sidebar-wrapper {
  z-index: 1;
  position: relative;
  left: 45px;
  top: 100px;
  width: 0;
  height: 82vh;
  overflow-y: hidden;
  overflow-x: hidden;
  background: #fff;
  opacity: 1;
  transition: all .4s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border-radius: 24px;
  margin-top: 0px;
}
.sidebar-wrapper.open {
  width: 300px;
}
.menu-toggle {
  position: absolute;
  top: 16px;
  right: -48px;
  background: #fff;
  color: #fff;
  border: none;
  font-size: 2em;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  padding: 8px 12px;
  transition: all .4s;
  z-index: 2;
}
.sidebar-nav {
  padding: 0;
  list-style: none;
  width: 100%;
  text-align: left;
  margin: 0;
  margin-top: 8px;
}
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  padding: 6px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  color: #222;
  font-weight: 400;
}
.sidebar-item:hover {
  background: #f7f7f7;
}
.sidebar-item--active {
  background: #ededed;
  font-weight: 600;
}
.sidebar-icon {
  font-size: 18px;
  width: 22px;
  text-align: center;
}

/* --- Adaptive styles --- */
@media (max-width: 900px) {
  .sidebar-wrapper {
    position: fixed;
    z-index: 2000;
    box-shadow: none;
    width: 0;
    min-width: 0;
    max-width: 80vw;
    border-radius: 0 16px 16px 0;
  }
  .sidebar-wrapper.open {
    width: 80vw;
    min-width: 220px;
    max-width: 80vw;
  }
  .menu-toggle {
    right: -44px;
    top: 10px;
    font-size: 1.5em;
  }
}
@media (max-width: 600px) {
  .sidebar-wrapper {
    max-width: 100vw;
    border-radius: 0;
  }
  .sidebar-wrapper.open {
    width: 100vw;
    min-width: 0;
    max-width: 100vw;
  }
  .menu-toggle {
    right: -40px;
    top: 6px;
    font-size: 1.2em;
  }
}
</style> 