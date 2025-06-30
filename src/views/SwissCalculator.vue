<template>
  <div class="page-container">
    <div class="page-header">
      <h2>瑞士轮计算器</h2>
      <p>输入信息以计算晋级概率</p>
    </div>

    <div class="content-card">
      <form class="swiss-form" @submit.prevent>
        <div class="form-group">
          <label for="players-input">总人数</label>
          <input id="players-input" type="number" v-model.number="players" min="2" max="1024" required @input="autoCalculate" />
        </div>
        <div class="form-group">
          <label for="rounds-input">轮数</label>
          <input id="rounds-input" type="number" v-model.number="rounds" min="1" max="12" required @input="autoCalculate" :placeholder="suggestedRoundsText" />
        </div>
        <div class="form-group">
          <label for="top-input">出线人数</label>
          <input id="top-input" type="number" v-model.number="top" min="1" :max="players" required @input="autoCalculate" />
        </div>
      </form>

      <div v-if="resultTable.length" class="result-table-wrap">
        <h3>晋级概率表</h3>
        <table class="result-table">
          <thead>
            <tr>
              <th>胜负场次</th>
              <th>人数</th>
              <th>晋级概率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in resultTable" :key="row.record">
              <td>{{ row.record }}</td>
              <td>{{ row.count }}</td>
              <td :style="getProbabilityStyle(row.probability)">{{ row.probability }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// 轮数建议表
const roundSuggestTable = [
  { min: 2, max: 2, rounds: 1 },
  { min: 3, max: 4, rounds: 2 },
  { min: 5, max: 8, rounds: 3 },
  { min: 9, max: 16, rounds: 4 },
  { min: 17, max: 32, rounds: 5 },
  { min: 33, max: 64, rounds: 6 },
  { min: 65, max: 128, rounds: 7 },
  { min: 129, max: 256, rounds: 8 }
];

export default {
  name: 'SwissCalculator',
  data() {
    return {
      players: 16,
      rounds: 4,
      top: 8,
      resultTable: []
    }
  },
  computed: {
    suggestedRounds() {
      const found = roundSuggestTable.find(r => this.players >= r.min && this.players <= r.max);
      return found ? found.rounds : null;
    },
    suggestedRoundsText() {
        return this.suggestedRounds ? `建议: ${this.suggestedRounds} 轮` : '请输入轮数';
    }
  },
  watch: {
    players() {
        if (this.suggestedRounds) {
            this.rounds = this.suggestedRounds;
        }
        this.autoCalculate();
    },
    rounds: 'autoCalculate',
    top: 'autoCalculate'
  },
  mounted() {
    this.autoCalculate();
  },
  methods: {
    autoCalculate() {
      // 输入合法才计算
      if (!this.players || !this.rounds || !this.top) {
        this.resultTable = [];
        return;
      }
      this.calculate();
    },
    calculate() {
      const { players, rounds, top } = this;
      const results = [];
      for (let win = rounds; win >= 0; win--) {
        const lose = rounds - win;
        let probability = '0%';
        if (win === rounds) probability = '100%';
        else if (win === rounds - 1) probability = players <= 16 ? '100%' : '90%';
        else if (win === rounds - 2) probability = players <= 16 ? '50%' : '20%';
        // 计算人数：C(rounds, win) * 0.5^rounds * players
        const count = Math.round(this.comb(rounds, win) * Math.pow(0.5, rounds) * players);
        results.push({
          record: `${win}-${lose}-0`,
          count: count,
          probability
        });
      }
      this.resultTable = results;
    },
    // 组合数C(n, k)
    comb(n, k) {
      if (k < 0 || k > n) return 0;
      let res = 1;
      for (let i = 1; i <= k; i++) {
        res = res * (n - i + 1) / i;
      }
      return res;
    },
    getProbabilityStyle(prob) {
        if (prob === '100%') return { color: '#2e7d32', fontWeight: '600' };
        if (prob === '0%') return { color: '#d32f2f' };
        return {};
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: calc(100vh - 150px);
  padding: 32px 24px;
}

.page-header {
  max-width: 600px;
  margin: 0 auto 24px auto;
  text-align: left;
}
.page-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}
.page-header p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.content-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 32px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.swiss-form {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 36px;
}
.form-group {
  /* This rule is no longer needed with the new structure */
  display: contents;
}
.form-group label {
  font-weight: 500;
  color: #374151;
  text-align: right;
  font-size: 1rem;
}
.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: #f9fafb;
  transition: all 0.2s;
}
.form-group input:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  background: #fff;
}
.form-group input::placeholder {
    color: #9ca3af;
}

.result-table-wrap h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;
}
.result-table {
  width: 100%;
  border-collapse: collapse;
}
.result-table th, .result-table td {
  border-bottom: 1px solid #e5e7eb;
  padding: 14px 8px;
  text-align: center;
}
.result-table th {
  background: #f9fafb;
  font-weight: 500;
  color: #6b7280;
  font-size: 0.9rem;
  text-transform: uppercase;
}
.result-table tr:last-child td {
  border-bottom: none;
}

@media (max-width: 600px) {
  .swiss-form {
    grid-template-columns: 80px 1fr; /* Fixed label width */
    gap: 12px;
  }
  .form-group label {
    text-align: left;
    white-space: nowrap;
  }
}

/* 隐藏数字输入框的加减号 */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style> 