<template>
  <div class="page-container">
    <div class="page-header">
      <h2>关于</h2>
      <div class="author-line">Authored by Zoo.牛油果</div>
    </div>
    
    <div class="content-card">
      <div class="placeholder-content">
        <div class="placeholder-icon">ℹ️</div>
        <h3>关于 PTCG Tool</h3>
        <p>这是一个专为宝可梦卡牌游戏设计的工具集合，旨在为玩家提供更好的游戏体验。</p>
        
        <div class="info-section">
          <h4>项目功能</h4>
          <ul>
            <li><strong>个人赛BP：</strong>个人赛Ban/Pick工具</li>
            <li><strong>卡组统计：</strong>卡组分析与统计</li>
            <li><strong>瑞士轮计算器：</strong>比赛配对与积分计算</li>
          </ul>
        </div>
        
        <div class="info-section">
          <h4>技术栈</h4>
          <ul>
            <li>前端：Vue 3 + Vite</li>
            <li>路由：Vue Router 4</li>
            <li>样式：CSS3</li>
            <li>后端：预留文件夹（待开发）</li>
          </ul>
        </div>
        
        <div class="info-section">
          <h4>开发状态</h4>
          <p>项目正在开发中，各功能模块将逐步完善。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.page-container {
  min-height: calc(100vh - 150px);
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h2 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
}

.placeholder-content {
  max-width: 700px;
  margin: 0 auto;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.placeholder-content h3 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.placeholder-content p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.info-section {
  text-align: left;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-section h4 {
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.info-section ul {
  color: #666;
  line-height: 1.8;
  margin: 0;
  padding-left: 20px;
}

.info-section li {
  margin-bottom: 8px;
}

.info-section strong {
  color: #007bff;
}

.author-line {
  text-align: center;
  color: #888;
  font-size: 1rem;
  font-style: italic;
  margin-bottom: 8px;
  margin-top: 2px;
}
</style> 