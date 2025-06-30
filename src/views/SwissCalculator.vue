<template>
  <div class="page-container">
    <div class="page-header">
      <h2>瑞士轮计算器</h2>
      <p>宝可梦卡牌瑞士轮比赛计算工具</p>
    </div>

    <div class="content-card">
      <form class="swiss-form" @submit.prevent>
        <div class="form-group">
          <label for="players-input">总人数</label>
          <div class="input-wrapper">
            <input id="players-input" type="number" v-model.number="players" min="2" max="256" required @input="autoCalculate" />
          </div>
        </div>
        <div class="form-group">
          <label for="rounds-input">轮数</label>
          <div class="input-wrapper">
            <input id="rounds-input" type="number" v-model.number="rounds" min="1" max="12" required @input="autoCalculate" />
            <span class="suggestion" v-if="suggestedRounds">（建议：{{ suggestedRounds }}）</span>
          </div>
        </div>
        <div class="form-group">
          <label for="top-input">出线人数</label>
          <div class="input-wrapper">
            <input id="top-input" type="number" v-model.number="top" min="1" :max="players" required @input="autoCalculate" />
          </div>
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
              <td>{{ row.probability }}</td>
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
      return found ? found.rounds : '';
    }
  },
  watch: {
    players: 'autoCalculate',
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
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.content-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 32px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.swiss-form {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px 12px;
  align-items: center;
  margin-bottom: 36px;
}
.form-group {
  display: contents;
}

.form-group label {
  grid-column: 1 / 2;
  text-align: right;
  color: #333;
  font-weight: 500;
  font-size: 1.05rem;
}

.form-group .input-wrapper {
  grid-column: 2 / 3;
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-group input {
  width: 120px;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 1.05rem;
  background: #fafbfc;
  transition: border 0.2s;
}
.form-group input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
}
.suggestion {
  color: #888;
  font-size: 0.95rem;
  white-space: nowrap;
}
.result-table-wrap {
  margin-top: 24px;
}
.result-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}
.result-table th, .result-table td {
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 0;
  text-align: center;
  font-size: 1.05rem;
}
.result-table th {
  background: #f8f9fa;
  color: #333;
  font-weight: 600;
}
.result-table tr:last-child td {
  border-bottom: none;
}
@media (max-width: 600px) {
  .page-container {
    padding: 24px 16px;
  }
  .content-card {
    padding: 24px 16px;
  }
  .swiss-form {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .form-group label {
    text-align: left;
    margin-bottom: 4px;
    grid-column: 1 / 2;
  }
  .form-group .input-wrapper {
    grid-column: 1 / 2;
  }
  .result-table th, .result-table td {
    padding: 8px 0;
    font-size: 0.98rem;
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