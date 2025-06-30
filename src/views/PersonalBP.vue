<template>
  <div class="page-container">
    <DeckSelector
      :visible="isSelectorVisible"
      :decks="allDecks"
      :selection-limit="selectorLimit"
      @confirm="handleDeckSelectionConfirm"
      @cancel="isSelectorVisible = false"
    />

    <div class="content-wrapper">
      <!-- My Decks Panel -->
      <div class="selected-decks-panel">
        <div class="panel-title">我的出战卡组</div>
        <div class="deck-chips-container">
          <div v-for="(_, index) in myDecks" :key="`my-deck-slot-${index}`" class="deck-slot">
            <button v-if="myDecks[index]" class="deck-chip my-deck-chip" @click="openSelectorForEdit('my', index)">
              <span>{{ myDecks[index].zhName }}</span>
              <button @click.stop="removeMyDeck(index)" class="remove-chip-btn">×</button>
            </button>
            <button v-else class="add-deck-placeholder" @click="handleEmptySlotClick('my', index)">
              <span>- {{ getPlaceholderText('my', index + 1) }} -</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Opponent Decks Panel -->
      <div class="selected-decks-panel">
        <div class="panel-title">对手出战卡组</div>
        <div class="deck-chips-container">
          <div v-for="(_, index) in opponentDecks" :key="`opponent-deck-slot-${index}`" class="deck-slot">
            <button v-if="opponentDecks[index]" class="deck-chip opponent-deck-chip" @click="openSelectorForEdit('opponent', index)">
              <span>{{ opponentDecks[index].zhName }}</span>
              <button @click.stop="removeOpponentDeck(index)" class="remove-chip-btn">×</button>
            </button>
            <button v-else class="add-deck-placeholder opponent" @click="handleEmptySlotClick('opponent', index)">
              <span>- {{ getPlaceholderText('opponent', index + 1) }} -</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Start BP Button -->
      <button
        class="start-bp-btn"
        :disabled="!allDecksSelected"
        @click="confirmBP"
      >
        开始 Ban/Pick
      </button>

      <!-- Analysis Result Panel -->
      <div v-if="showAnalysis && analysisResult" class="analysis-panel">
        
        <!-- Win Rate Matrix -->
        <div class="analysis-section">
          <h2 class="analysis-title">对局胜率总览</h2>
          <div class="matrix-container">
            <table class="win-rate-table">
              <thead>
                <tr>
                  <th>我方 \ 对手</th>
                  <th v-for="deck in analysisResult.opponentDecks" :key="deck.id">{{ deck.zhName }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in analysisResult.winRateMatrix" :key="rowIndex">
                  <td>{{ row.myDeckName }}</td>
                  <td v-for="(cell, cellIndex) in row.opponentWinRates" :key="cellIndex" :style="getWinRateCellStyle(cell.winRate)">
                    {{ (cell.winRate * 100).toFixed(0) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Level 1 Analysis -->
        <div class="analysis-section">
          <h2 class="analysis-title">分析结果 (第一层)</h2>
          <div class="recommendation-card">
            <div class="rec-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 1.142c.48-.225.96-.406 1.44-.545a1 1 0 011.12 0c.48.14.96.32 1.44.545A10.01 10.01 0 0120 10.5v3.353c0 .54-.153 1.054-.44 1.49l-2.02 3.03c-.22.33-.516.6-.855.786a10.04 10.04 0 01-6 1.341 10.04 10.04 0 01-6-1.341c-.34-.186-.634-.456-.855-.786l-2.02-3.03A2.5 2.5 0 014 13.853V10.5C4 5.388 7.388 1.94 10 1.142zm2.89 12.06a1 1 0 00-1.78 0V15a1 1 0 102 0v-1.8a1 1 0 00-.22-.64zM12 6a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z"></path></svg>
              <span>优先Ban位推荐</span>
            </div>
            <p class="rec-deck-name">{{ analysisResult.level1.recommendedBan.zhName }}</p>
            <p class="rec-reason">
              该卡组对我方平均胜率最高，达到
              <strong>{{ (analysisResult.level1.recommendedBan.averageWinRate * 100).toFixed(1) }}%</strong>，
              构成最大威胁。
            </p>
          </div>
          <div class="assessment-section">
            <h3>对手卡组威胁评估</h3>
            <div v-for="deck in analysisResult.level1.opponentThreats" :key="deck.id" class="assessment-item">
              <span>{{ deck.zhName }}</span>
              <div class="win-rate-bar opponent-bar">
                <div class="bar-fill" :style="{ width: deck.averageWinRate * 100 + '%' }"></div>
                <span>{{ (deck.averageWinRate * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
          <div class="assessment-section">
            <h3>我方卡组表现预测 (Ban后)</h3>
            <div v-for="deck in analysisResult.level1.myDeckPerformances" :key="deck.id" class="assessment-item">
              <span>{{ deck.zhName }}</span>
              <div class="win-rate-bar my-bar">
                <div class="bar-fill" :style="{ width: deck.averageWinRate * 100 + '%' }"></div>
                <span>{{ (deck.averageWinRate * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Level 2 Analysis -->
        <div class="analysis-section">
           <h2 class="analysis-title">分析结果 (第五层)</h2>
           <div class="recommendation-card level2-card">
              <p class="rec-reason" style="text-align: left; margin-bottom: 1rem;">
                <strong>模拟场景:</strong> 假设对手Ban掉我方威胁最大的 <strong>【{{ analysisResult.level2.opponentAssumedBan.zhName }}】</strong>，我方应变策略如下：
              </p>
              <div class="rec-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.071l9 9a.75.75 0 001.071-1.071l-9-9zM12 3a9 9 0 100 18 9 9 0 000-18zm-4.5 9.75a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0V13.5H8.25a.75.75 0 01-.75-.75z" clip-rule="evenodd"></path></svg>
                <span>应变Ban位推荐</span>
              </div>
              <p class="rec-deck-name">{{ analysisResult.level2.recommendedBan.zhName }}</p>
           </div>
            <div class="assessment-section">
                <h3>对手卡组威胁评估 (我方被Ban后)</h3>
                <div v-for="deck in analysisResult.level2.opponentThreats" :key="deck.id" class="assessment-item">
                    <span>{{ deck.zhName }}</span>
                    <div class="win-rate-bar opponent-bar">
                        <div class="bar-fill" :style="{ width: deck.averageWinRate * 100 + '%' }"></div>
                        <span>{{ (deck.averageWinRate * 100).toFixed(1) }}%</span>
                    </div>
                </div>
            </div>
            <div class="assessment-section">
                <h3>我方卡组表现预测 (双方均Ban后)</h3>
                <div v-for="deck in analysisResult.level2.myDeckPerformances" :key="deck.id" class="assessment-item">
                    <span>{{ deck.zhName }}</span>
                    <div class="win-rate-bar my-bar">
                        <div class="bar-fill" :style="{ width: deck.averageWinRate * 100 + '%' }"></div>
                        <span>{{ (deck.averageWinRate * 100).toFixed(1) }}%</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DeckSelector from './DeckSelector.vue';

const allDecks = ref([]);
const matchups = ref({});
const myDecks = ref([null, null, null]);
const opponentDecks = ref([null, null, null]);

const isSelectorVisible = ref(false);
const selectorLimit = ref(1);
const editingIndex = ref(null);
const editingTeam = ref('my');

const showAnalysis = ref(false);
const analysisResult = ref(null);

const areMyDecksEmpty = computed(() => myDecks.value.every(d => d === null));
const areOpponentDecksEmpty = computed(() => opponentDecks.value.every(d => d === null));
const allDecksSelected = computed(() => 
  myDecks.value.every(d => d) && opponentDecks.value.every(d => d)
);

onMounted(async () => {
  try {
    const baseUrl = import.meta.env.BASE_URL;
    const [decksResponse, matchupsResponse] = await Promise.all([
      fetch(`${baseUrl}data/decks.json`),
      fetch(`${baseUrl}data/matchups.json`)
    ]);
    if (!decksResponse.ok || !matchupsResponse.ok) {
      throw new Error('Network response was not ok');
    }
    allDecks.value = await decksResponse.json();
    matchups.value = await matchupsResponse.json();
    console.log('诊断信息1: 卡组数据已在 onMounted 中加载完毕。数量:', allDecks.value.length);
  } catch (error) {
    console.error('Failed to load data:', error);
  }
});

function getPlaceholderText(type, index) {
  const team = type === 'my' ? '我方' : '对手';
  const letter = String.fromCharCode(65 + index - 1); // A, B, C
  return `请选择${team}卡组 ${letter}`;
}

function handleEmptySlotClick(team, index) {
  const isTeamEmpty = team === 'my' ? areMyDecksEmpty.value : areOpponentDecksEmpty.value;
  if (isTeamEmpty) {
    openSelectorForBulkAdd(team);
  } else {
    openSelectorForEdit(team, index);
  }
}

function openSelectorForEdit(team, index) {
  console.log('诊断信息2: 准备打开选择器。当前allDecks数量:', allDecks.value.length);
  selectorLimit.value = 1;
  editingIndex.value = index;
  editingTeam.value = team;
  isSelectorVisible.value = true;
}

function openSelectorForBulkAdd(team) {
  console.log('诊断信息2: 准备打开选择器。当前allDecks数量:', allDecks.value.length);
  selectorLimit.value = 3;
  editingIndex.value = null;
  editingTeam.value = team;
  isSelectorVisible.value = true;
}

function handleDeckSelectionConfirm(selection) {
  const teamDecks = editingTeam.value === 'my' ? myDecks : opponentDecks;

  if (selectorLimit.value === 1) { // Single edit
    if (editingIndex.value !== null) {
      teamDecks.value[editingIndex.value] = selection;
    }
  } else { // Bulk add
    teamDecks.value = selection;
  }
  isSelectorVisible.value = false;
  editingIndex.value = null;
  // Reset analysis when deck selection changes
  showAnalysis.value = false;
}

function removeMyDeck(index) {
  myDecks.value[index] = null;
  showAnalysis.value = false;
}

function removeOpponentDeck(index) {
  opponentDecks.value[index] = null;
  showAnalysis.value = false;
}

function getWinRate(deck1Id, deck2Id) {
  const deck1Matchups = matchups.value[deck1Id];
  if (deck1Matchups && deck1Matchups[deck2Id] !== undefined) {
    return deck1Matchups[deck2Id];
  }
  return 0.5;
}

function runAnalysis() {
  // 0. Win Rate Matrix (3x3)
  const winRateMatrix = myDecks.value.map(myDeck => ({
    myDeckName: myDeck.zhName,
    opponentWinRates: opponentDecks.value.map(oppDeck => ({
      winRate: getWinRate(myDeck.id, oppDeck.id)
    }))
  }));

  // === Level 1 Analysis (My optimal move in a vacuum) ===
  const level1 = (() => {
    const opponentThreats = opponentDecks.value.map(oppDeck => {
      const winRates = myDecks.value.map(myDeck => getWinRate(oppDeck.id, myDeck.id));
      const averageWinRate = winRates.reduce((a, b) => a + b, 0) / winRates.length;
      return { ...oppDeck, averageWinRate };
    });
    const recommendedBan = [...opponentThreats].sort((a, b) => b.averageWinRate - a.averageWinRate)[0];
    const myDeckPerformances = myDecks.value.map(myDeck => {
      const remainingOpponentDecks = opponentDecks.value.filter(d => d.id !== recommendedBan.id);
      const winRates = remainingOpponentDecks.map(oppDeck => getWinRate(myDeck.id, oppDeck.id));
      const averageWinRate = winRates.reduce((a, b) => a + b, 0) / winRates.length;
      return { ...myDeck, averageWinRate };
    });
    return { opponentThreats, recommendedBan, myDeckPerformances };
  })();


  // === Level 2 Analysis (My counter-move after opponent's optimal ban) ===
  const level2 = (() => {
    // 1. Find which of MY decks the opponent is most likely to ban
    const myThreatsToOpponent = myDecks.value.map(myDeck => {
        const winRates = opponentDecks.value.map(oppDeck => getWinRate(myDeck.id, oppDeck.id));
        const averageWinRate = winRates.reduce((a,b) => a + b, 0) / winRates.length;
        return { ...myDeck, averageWinRate };
    });
    const opponentAssumedBan = [...myThreatsToOpponent].sort((a,b) => b.averageWinRate - a.averageWinRate)[0];
    const myRemainingDecks = myDecks.value.filter(d => d.id !== opponentAssumedBan.id);

    // 2. Re-calculate my best ban against their full lineup, but with my weakened lineup
    const opponentThreats_L2 = opponentDecks.value.map(oppDeck => {
        const winRates = myRemainingDecks.map(myDeck => getWinRate(oppDeck.id, myDeck.id));
        const averageWinRate = winRates.reduce((a, b) => a + b, 0) / winRates.length;
        return { ...oppDeck, averageWinRate };
    });
    const recommendedBan_L2 = [...opponentThreats_L2].sort((a,b) => b.averageWinRate - a.averageWinRate)[0];
    
    // 3. Re-calculate my remaining decks' performance against their remaining decks
    const opponentRemainingDecks_L2 = opponentDecks.value.filter(d => d.id !== recommendedBan_L2.id);
    const myDeckPerformances_L2 = myRemainingDecks.map(myDeck => {
        const winRates = opponentRemainingDecks_L2.map(oppDeck => getWinRate(myDeck.id, oppDeck.id));
        const averageWinRate = winRates.reduce((a, b) => a + b, 0) / winRates.length;
        return { ...myDeck, averageWinRate };
    });

    return {
      opponentAssumedBan,
      opponentThreats: opponentThreats_L2,
      recommendedBan: recommendedBan_L2,
      myDeckPerformances: myDeckPerformances_L2,
    };
  })();


  analysisResult.value = {
    winRateMatrix,
    level1,
    level2,
    myDecks: myDecks.value,
    opponentDecks: opponentDecks.value,
  };
}

function confirmBP() {
  if (allDecksSelected.value) {
    runAnalysis();
    showAnalysis.value = true;
    console.log("Analysis Complete:", analysisResult.value);
  }
}

function getWinRateCellStyle(winRate) {
  const opacity = Math.abs(winRate - 0.5) * 2; // 0.5 -> 0 opacity, 0 or 1 -> 1 opacity
  if (winRate > 0.5) {
    return { backgroundColor: `rgba(139, 195, 74, ${opacity * 0.7})`, color: '#1B5E20' };
  } else if (winRate < 0.5) {
    return { backgroundColor: `rgba(239, 83, 80, ${opacity * 0.6})`, color: '#B71C1C' };
  }
  return { backgroundColor: 'rgba(255, 255, 255, 0.5)', color: '#424242' };
}
</script>

<style scoped>
.page-container {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 4rem); /* Adjust for header if any */
}

.content-wrapper {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.selected-decks-panel {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.deck-chips-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.deck-chips-container.read-only .deck-chip {
  pointer-events: none;
}

.deck-slot {
  width: 100%;
}

.deck-chip, .add-deck-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  font-size: 1.1rem;
  cursor: pointer;
}

.deck-chip {
  justify-content: space-between;
}

.my-deck-chip {
  background-color: #f9fafb;
  color: #1f2937;
}

.opponent-deck-chip {
  background-color: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
}

.remove-chip-btn {
  background: none;
  border: none;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
  opacity: 0.5;
  color: inherit;
  font-weight: 300;
}
.remove-chip-btn:hover {
  opacity: 1;
  color: #ef4444;
}

.add-deck-placeholder {
  background-color: #ffffff;
  color: #9ca3af;
  cursor: pointer;
}
.add-deck-placeholder:hover {
  border-color: #d1d5db;
  color: #6b7280;
}

.add-deck-placeholder.opponent:hover {
  border-color: #fca5a5;
  color: #b91c1c;
}

.start-bp-btn {
  padding: 14px 32px;
  border-radius: 12px;
  border: none;
  background-color: #4f46e5;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}
.start-bp-btn:hover {
  background-color: #4338ca;
}
.start-bp-btn:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
  box-shadow: none;
}

/* Step 2 Specific Styles */
.opponent-step {
  animation: fade-in 0.5s ease-out;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0rem;
  text-align: center;
}

.bp-match-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.team-section {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
}
.team-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  text-align: center;
}

.vs-divider {
  font-size: 1rem;
  font-weight: 700;
  color: #9ca3af;
  padding: 0 1rem;
}

/* We don't need the specific add-deck-chip styles anymore */

/* Analysis Panel Styles */
.analysis-panel {
  margin-top: 1rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  animation: fade-in-up 0.5s ease-out;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.analysis-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 1.5rem;
}

.recommendation-card {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  margin-bottom: 2rem;
}

.rec-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}
.rec-title svg {
  width: 1.25rem;
  height: 1.25rem;
}

.rec-deck-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0.75rem 0;
}

.rec-reason {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
}
.rec-reason strong {
  font-weight: 600;
}

.assessment-section {
  margin-bottom: 1.5rem;
}
.assessment-section:last-child {
  margin-bottom: 0;
}

.assessment-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.assessment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 1rem;
}

.win-rate-bar {
  width: 50%;
  background-color: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.win-rate-bar span {
  position: relative;
  z-index: 1;
  padding: 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
}

.bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 6px 0 0 6px;
  transition: width 0.5s ease-out;
}
.opponent-bar .bar-fill {
  background-color: #fca5a5;
}
.my-bar .bar-fill {
  background-color: #a5b4fc;
}

/* New Matrix Styles */
.matrix-container {
  overflow-x: auto;
}
.win-rate-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 0.95rem;
}
.win-rate-table th, .win-rate-table td {
  padding: 12px 8px;
  border: 1px solid #e5e7eb;
}
.win-rate-table th {
  background-color: #f9fafb;
  font-weight: 600;
  white-space: nowrap;
}
.win-rate-table td:first-child {
  font-weight: 600;
  background-color: #f9fafb;
}

/* New Level 5 Card Style */
.level5-card {
  background-color: #eef2ff;
  border-color: #c7d2fe;
  color: #3730a3;
}
.level2-card {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
  padding: 1rem;
}
.level2-card .rec-deck-name {
    margin-top: 0.5rem;
}
</style> 