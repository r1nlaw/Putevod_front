<template>
  <div v-if="show" class="modal" @click="close" tabindex="-1" ref="modalRef">
    <div class="modal-content" @click.stop>
      <button @click="close" class="close-btn">
        <font-awesome-icon icon="times" />
      </button>
      <img :src="imageSrc" alt="Full size image" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  imageSrc: String,
  show: Boolean,
});

const emit = defineEmits(['close']);
const modalRef = ref(null);

const close = () => {
  emit('close');
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    nextTick(() => {
      modalRef.value.focus();
    });
  }
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-content img {
  max-width: 100%;
  height: auto;
}
</style>