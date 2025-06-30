<template>
  <div class="deck-selector-modal" v-if="visible">
    <div class="modal-overlay" @click="$emit('cancel')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ headerText }}</h2>
        <button class="modal-close" @click="$emit('cancel')">×</button>
      </div>

      <div v-if="selectionLimit > 1" class="selected-display">
        <span v-if="localSelection.length === 0" class="placeholder">请选择 {{ selectionLimit }} 个卡组</span>
        <span v-for="(deck, idx) in localSelection" :key="idx" class="selected-item">
          {{ deck.zhName }}
          <button class="remove-btn" @click="removeLocalDeck(idx)">×</button>
        </span>
      </div>

      <div v-if="selectionLimit > 1" class="deck-list-header">
        <span>所有卡组</span>
      </div>
      <div class="deck-list">
        <button
          v-for="deck in decks"
          :key="deck.id"
          class="deck-btn"
          @click="handleDeckClick(deck)"
          :disabled="selectionLimit > 1 && localSelection.length >= selectionLimit"
        >
          {{ deck.zhName }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  decks: { type: Array, required: true },
  visible: { type: Boolean, default: false },
  selectionLimit: { type: Number, default: 3 },
});
const emit = defineEmits(['confirm', 'cancel']);

const localSelection = ref([]);

const headerText = computed(() => {
  if (props.selectionLimit === 1) {
    return '选择一个卡组';
  }
  return `选择卡组（请选择 ${props.selectionLimit} 个，可重复）`;
});

watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    localSelection.value = [];
  }
});

function handleDeckClick(deck) {
  if (props.selectionLimit === 1) {
    emit('confirm', deck);
  } else {
    addLocalDeck(deck);
  }
}

function addLocalDeck(deck) {
  if (localSelection.value.length < props.selectionLimit) {
    localSelection.value.push(deck);
  }
  
  if (localSelection.value.length === props.selectionLimit) {
    confirmMultiSelection();
  }
}

function removeLocalDeck(index) {
  localSelection.value.splice(index, 1);
}

function confirmMultiSelection() {
  emit('confirm', [...localSelection.value]);
}
</script>

<style scoped>
/* Modal Structure */
.deck-selector-modal {
  position: fixed;
  z-index: 1000;
  left: 0; top: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-overlay {
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
}
.modal-content {
  position: relative;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.1);
  padding: 24px;
  width: 90vw;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  animation: pop-in 0.25s cubic-bezier(.4,1.4,.6,1);
}
@keyframes pop-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}
.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}
.modal-close {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #888;
  cursor: pointer;
}

/* Selected Display */
.selected-display {
  background: #f7f8fa;
  border-radius: 8px;
  padding: 12px;
  min-height: 50px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}
.selected-item {
  display: inline-flex;
  align-items: center;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.9rem;
  font-weight: 500;
}
.remove-btn {
  margin-left: 6px;
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  font-weight: bold;
}
.placeholder {
  color: #aaa;
  font-size: 0.9rem;
}

/* Deck List */
.deck-list-header {
  text-align: left;
  color: #555;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  flex-shrink: 0;
}
.deck-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
  max-height: 45vh;
  overflow-y: auto;
  padding: 8px;
  margin: -8px; /* Counteract padding */
  flex-grow: 1;
}
.deck-btn {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.deck-btn:hover {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
}
.deck-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f7f8fa;
  color: #aaa;
  border-color: #e0e0e0;
}
</style> 