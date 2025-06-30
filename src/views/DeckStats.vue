<template>
  <div class="deckstats-root">
    <div class="deckstats-header">
      <h2>卡组统计</h2>
    </div>
    <div class="deckstats-toolbar">
      <div class="deckstats-select-group deckstats-select-left">
        <label for="set-select">版本</label>
        <select id="set-select" v-model="selectedSetId" @change="refreshDecks">
          <option v-for="set in sets" :key="set.id" :value="set.id">
            {{ set.zhName }}（{{ set.version }}）
          </option>
        </select>
      </div>
      <button class="deckstats-btn" @click="openDrawer">全部卡组</button>
    </div>
    <div class="deckstats-card">
      <div v-if="decks.length && matchups">
        <div class="deckstats-table-scroll">
          <table class="deckstats-table">
            <thead>
              <tr>
                <th></th>
                <th v-for="deck in decks" :key="deck.id">{{ deck.zhName }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rowDeck in decks" :key="rowDeck.id">
                <th>{{ rowDeck.zhName }}</th>
                <td v-for="colDeck in decks" :key="colDeck.id"
                  :style="cellStyle(rowDeck.id, colDeck.id)"
                  class="deckstats-cell"
                >
                  <span v-if="rowDeck.id === colDeck.id" class="diag">—</span>
                  <span v-else>{{ getWinrate(rowDeck.id, colDeck.id) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="deckstats-loading">加载中...</div>
    </div>
    <!-- 极简右侧抽屉，全部卡组管理 -->
    <div v-if="showDrawer" class="deckstats-drawer-mask" @click.self="closeDrawer">
      <div class="deckstats-drawer">
        <div class="drawer-header">
          <span>全部卡组</span>
          <button class="drawer-close" @click="closeDrawer">×</button>
        </div>
        <div class="drawer-content">
          <div v-if="editDecks.length === 0" class="drawer-placeholder">暂无卡组数据</div>
          <template v-for="deck in editDecks" :key="deck.id">
            <div class="drawer-deck-row">
              <span class="drawer-deck-name">{{ deck.zhName }}</span>
              <button class="drawer-vs-btn" @click="toggleEdit(deck.id)">
                {{ editingDeckId === deck.id ? '收起' : '编辑胜率' }}
              </button>
              <button class="drawer-del-btn" @click="removeDeck(deck.id)">删除</button>
            </div>
            <!-- 行内编辑区 -->
            <div v-if="editingDeckId === deck.id" class="vs-inline-edit">
              <div v-for="opp in editDecks.filter(o => o.id !== deck.id)" :key="opp.id" class="vs-row">
                <span class="vs-opp-name">{{ opp.zhName }}</span>
                <div class="vs-input-wrap">
                  <input type="number"
                    v-model.number="editMatchups[deck.id][opp.id]"
                    min="0" max="100" class="vs-input"
                  >
                  <span>%</span>
                </div>
              </div>
              <button class="vs-inline-save" @click="editingDeckId = null">完成</button>
            </div>
          </template>
          <button class="drawer-save-btn" @click="saveAll">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeckStats',
  data() {
    return {
      sets: [],
      decks: [],
      matchups: {},
      selectedSetId: 1,
      showDrawer: false,
      editDecks: [],
      editMatchups: {},
      editingDeckId: null
    }
  },
  mounted() {
    this.loadAll();
  },
  methods: {
    async loadAll() {
      const baseUrl = import.meta.env.BASE_URL;
      const setsText = await (await fetch(`${baseUrl}data/sets.json`)).text();
      const decksText = await (await fetch(`${baseUrl}data/decks.json`)).text();
      const matchupsText = await (await fetch(`${baseUrl}data/matchups.json`)).text();

      const sets = JSON.parse(localStorage.getItem('sets') || setsText);
      const decks = JSON.parse(localStorage.getItem('decks') || decksText);
      const matchups = JSON.parse(localStorage.getItem('matchups') || matchupsText);
      
      this.sets = sets;
      this.selectedSetId = sets[0]?.id || 1;
      this.decks = decks.filter(d => d.set === this.selectedSetId);
      this.matchups = matchups;
    },
    refreshDecks() {
      const baseUrl = import.meta.env.BASE_URL;
      this.decks = this.sets.length
        ? JSON.parse(localStorage.getItem('decks') || '[]').filter(d => d.set === this.selectedSetId)
        : [];
      if (!this.decks.length) {
        fetch(`${baseUrl}data/decks.json`).then(r => r.json()).then(decks => {
          this.decks = decks.filter(d => d.set === this.selectedSetId);
        });
      }
    },
    getWinrate(rowId, colId) {
      if (rowId === colId) return '—';
      const val = this.matchups?.[rowId]?.[colId];
      return val !== undefined ? Math.round(val * 100) + '%' : '—';
    },
    cellStyle(rowId, colId) {
      if (rowId === colId) {
        return { background: '#f6f6f8', color: '#222', fontWeight: 400 };
      }
      const val = this.matchups?.[rowId]?.[colId];
      if (val === undefined) return { color: '#222' };
      const diff = Math.abs(val - 0.5);
      let alpha = 0.05 + diff * 2.0;
      if (alpha > 0.85) alpha = 0.85;
      let bg = '#fff';
      if (val > 0.5) {
        bg = `rgba(0,160,0,${alpha})`;
      } else if (val < 0.5) {
        bg = `rgba(200,0,0,${alpha})`;
      } else {
        bg = '#fff';
      }
      return { background: bg, color: '#222', fontWeight: 500 };
    },
    openDrawer() {
      console.log('openDrawer called');
      this.showDrawer = true;
      this.editingDeckId = null; // 重置编辑状态
      if (!this.decks || !this.decks.length) {
        this.editDecks = [];
        this.editMatchups = {};
        return;
      }
      // 初始化编辑数据
      this.editDecks = this.decks.map(d => ({ ...d }));
      // 深拷贝matchups
      this.editMatchups = {};
      for (const d of this.editDecks) {
        this.editMatchups[d.id] = {};
        for (const o of this.editDecks) {
          if (d.id !== o.id) {
            const val = this.matchups?.[d.id]?.[o.id];
            this.editMatchups[d.id][o.id] = val !== undefined ? Math.round(val * 100) : 50;
          }
        }
      }
    },
    closeDrawer() {
      this.showDrawer = false;
      this.editingDeckId = null; // 重置编辑状态
    },
    toggleEdit(id) {
      console.log('toggleEdit called with id:', id, 'current editingDeckId:', this.editingDeckId);
      this.editingDeckId = this.editingDeckId === id ? null : id;
      console.log('after toggle, editingDeckId:', this.editingDeckId);
    },
    removeDeck(id) {
      this.editDecks = this.editDecks.filter(d => d.id !== id);
      delete this.editMatchups[id];
      for (const k in this.editMatchups) {
        delete this.editMatchups[k][id];
      }
      // 如果删除的是正在编辑的卡组，重置编辑状态
      if (this.editingDeckId === id) {
        this.editingDeckId = null;
      }
    },
    saveAll() {
      // 保存decks
      const allDecks = JSON.parse(localStorage.getItem('decks') || '[]');
      // 只保留非当前set的+当前set编辑后的
      const newDecks = allDecks.filter(d => d.set !== this.selectedSetId).concat(this.editDecks);
      localStorage.setItem('decks', JSON.stringify(newDecks));
      // 保存matchups
      const allMatchups = JSON.parse(localStorage.getItem('matchups') || '{}');
      for (const d of this.editDecks) {
        allMatchups[d.id] = allMatchups[d.id] || {};
        for (const o of this.editDecks) {
          if (d.id !== o.id) {
            allMatchups[d.id][o.id] = this.editMatchups[d.id][o.id] / 100;
          }
        }
      }
      // 移除已删卡组的胜率
      const validIds = this.editDecks.map(d => d.id);
      for (const k in allMatchups) {
        if (!validIds.includes(Number(k))) {
          delete allMatchups[k];
        } else {
          for (const kk in allMatchups[k]) {
            if (!validIds.includes(Number(kk))) {
              delete allMatchups[k][kk];
            }
          }
        }
      }
      localStorage.setItem('matchups', JSON.stringify(allMatchups));
      this.closeDrawer();
      this.loadAll();
    }
  }
}
</script>

<style scoped>
.deckstats-root {
  min-height: calc(100vh - 150px);
  background: #f7f8fa;
  padding-bottom: 40px;
}
.deckstats-header {
  max-width: 900px;
  margin: 0 auto 0 auto;
  padding-top: 32px;
  text-align: left;
}
.deckstats-header h2 {
  font-size: 2.1rem;
  font-weight: 700;
  color: #222;
  letter-spacing: 0.02em;
  margin: 0 0 10px 0;
}
.deckstats-toolbar {
  max-width: 900px;
  margin: 0 auto 18px auto;
  display: flex;
  align-items: center;
  gap: 18px;
}
.deckstats-select-group {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 12px;
  padding: 4px 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
}
.deckstats-select-left {
  margin-right: auto;
}
#set-select {
  border: none;
  background: transparent;
  font-size: 1.08rem;
  color: #222;
  padding: 4px 8px;
  outline: none;
}
.deckstats-btn {
  background: #222;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 1.08rem;
  font-weight: 500;
  padding: 8px 28px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: background 0.18s;
}
.deckstats-btn:hover {
  background: #007bff;
}
.deckstats-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.07);
  padding: 32px 18px 24px 18px;
  margin: 0 auto;
}
.deckstats-table-scroll {
  overflow-x: auto;
  width: 100%;
}
.deckstats-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  min-width: 700px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  font-size: 1.05rem;
}
.deckstats-table th, .deckstats-table td {
  border: none;
  padding: 12px 0;
  text-align: center;
  min-width: 70px;
  font-weight: 400;
}
.deckstats-table th {
  background: #f7f8fa;
  color: #222;
  font-weight: 600;
}
.deckstats-cell {
  transition: background 0.18s;
}
.deckstats-table td:hover {
  box-shadow: 0 0 0 2px #007bff33;
  z-index: 1;
  position: relative;
}
.diag {
  color: #bbb;
  font-size: 1.1rem;
  font-weight: 400;
}
.deckstats-loading {
  color: #888;
  margin: 40px 0;
}
/* 极简右侧抽屉 */
.deckstats-drawer-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.10);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}
.deckstats-drawer {
  width: 420px;
  max-width: 98vw;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 24px rgba(0,0,0,0.10);
  border-radius: 18px 0 0 18px;
  display: flex;
  flex-direction: column;
  animation: slideInDrawer 0.22s cubic-bezier(.4,1.4,.6,1) 1;
}
@keyframes slideInDrawer {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 28px 12px 28px;
  font-size: 1.18rem;
  font-weight: 600;
  color: #222;
  border-bottom: 1px solid #f0f0f0;
}
.drawer-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #bbb;
  cursor: pointer;
  transition: color 0.18s;
}
.drawer-close:hover {
  color: #007bff;
}
.drawer-content {
  flex: 1;
  padding: 32px 28px;
  overflow-y: auto;
}
.drawer-placeholder {
  color: #bbb;
  font-size: 1.08rem;
  text-align: center;
  margin-top: 80px;
}
.drawer-deck-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}
.drawer-deck-row:last-of-type {
  /* border-bottom: none; */
}
.drawer-deck-name {
  flex: 1;
  font-size: 1.08rem;
  color: #222;
  font-weight: 500;
}
.drawer-vs-btn, .drawer-del-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.18s;
}
.drawer-vs-btn:hover {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
}
.drawer-del-btn:hover {
  background: #dc3545;
  color: #fff;
  border-color: #dc3545;
}
.drawer-save-btn {
  width: 100%;
  background: #222;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 12px 0;
  cursor: pointer;
  margin-top: 32px;
  transition: background 0.18s;
}
.drawer-save-btn:hover {
  background: #007bff;
}

/* Inline Edit Area */
.vs-inline-edit {
  padding: 16px;
  background-color: #f7f8fa;
  border: 1px solid #eee;
  border-radius: 8px;
  margin: 8px 0 16px 0;
  animation: fadeIn 0.3s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.vs-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}
.vs-opp-name {
  font-size: 1rem;
  color: #333;
}
.vs-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.vs-input {
  width: 60px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 1rem;
  text-align: center;
  outline: none;
}
.vs-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px #007bff33;
}
.vs-inline-save {
  display: block;
  margin: 16px auto 0 auto;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 24px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.18s;
}
.vs-inline-save:hover {
  background: #0056b3;
}

/* 旧的 vs-modal 样式可以删除或注释掉 */
.vs-modal-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.12);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vs-modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 380px;
  max-width: 90vw;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  animation: popIn 0.2s cubic-bezier(.4,1.4,.6,1) 1;
}
.vs-modal-header {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #222;
}
.vs-modal-content {
  max-height: 50vh;
  overflow-y: auto;
  padding-right: 12px;
  margin-right: -12px;
}
.vs-modal-save {
  width: 100%;
  background: #222;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 10px 0;
  cursor: pointer;
  margin-top: 24px;
  transition: background 0.18s;
}
.vs-modal-save:hover {
  background: #007bff;
}

/* 自定义滚动条 */
.vs-modal-content::-webkit-scrollbar {
  width: 8px;
}
.vs-modal-content::-webkit-scrollbar-track {
  background: #f7f8fa;
}
.vs-modal-content::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 4px;
}

@media (max-width: 700px) {
  .deckstats-header, .deckstats-card {
    max-width: 99vw;
    padding-left: 2vw;
    padding-right: 2vw;
  }
  .deckstats-drawer {
    width: 99vw;
    border-radius: 0;
  }
  .deckstats-table-scroll {
    width: 100vw;
    min-width: 0;
  }
  .deckstats-table {
    min-width: 600px;
  }
}
</style> 