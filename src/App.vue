<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-logo">PTCG Tool</div>
      <ul class="sidebar-menu">
        <li><router-link to="/" active-class="active">个人赛</router-link></li>
        <li><router-link to="/team" active-class="active">团队赛</router-link></li>
        <li><router-link to="/deck-stats" active-class="active">卡组统计</router-link></li>
        <li><router-link to="/swiss-calculator" active-class="active">瑞士轮计算器</router-link></li>
        <li><router-link to="/about" active-class="active">关于</router-link></li>
      </ul>
      <div class="sidebar-footer">Authored by Zoo.牛油果</div>
    </aside>
    <div class="main-area">
      <nav class="navbar">
        <div class="nav-left">PTCG Tool</div>
        <ul class="nav-tabs">
          <li><router-link to="/" class="nav-link" active-class="active">个人赛</router-link></li>
          <li><router-link to="/team" class="nav-link" active-class="active">团队赛</router-link></li>
          <li><router-link to="/deck-stats" class="nav-link" active-class="active">卡组统计</router-link></li>
          <li><router-link to="/swiss-calculator" class="nav-link" active-class="active">瑞士轮计算器</router-link></li>
          <li><router-link to="/about" class="nav-link" active-class="active">关于</router-link></li>
        </ul>
      </nav>
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}
.sidebar {
  position: fixed;
  top: 32px;
  left: 32px;
  width: 210px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0 18px 0;
  z-index: 1100;
  transition: box-shadow 0.2s;
}
.sidebar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 40px;
  letter-spacing: 1px;
}
.sidebar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-menu li {
  width: 100%;
  margin-bottom: 6px;
}
.sidebar-menu :deep(a) {
  display: block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 0;
  color: #888 !important;
  font-size: 1.08rem;
  font-weight: 500;
  text-align: center;
  border-radius: 12px;
  transition: background 0.18s, color 0.18s;
  text-decoration: none !important;
  background: transparent;
}
.sidebar-menu :deep(a.active) {
  color: #2563eb !important;
  background: #e3eaf2 !important;
  font-weight: 700 !important;
  border-radius: 12px !important;
  text-decoration: none !important;
}
.sidebar-menu :deep(a:hover) {
  background: #e3eaf2 !important;
  color: #2563eb !important;
  border-radius: 12px !important;
  text-decoration: none !important;
}
.sidebar-footer {
  font-size: 0.95rem;
  color: #bbb;
  margin-top: 40px;
}
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 274px; /* 210px + 2*32px留白 */
  transition: margin-left 0.2s;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 1000;
}
.nav-left {
  font-size: 1.4rem;
  font-weight: bold;
  color: #222;
  letter-spacing: 1px;
}
.nav-tabs {
  display: flex;
  gap: 36px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-tabs li {
  position: relative;
  border-radius: 12px;
  transition: background 0.18s;
}
.nav-link {
  color: #888;
  font-size: 1.08rem;
  font-weight: 500;
  padding: 8px 18px;
  transition: color 0.2s, background 0.18s;
  text-decoration: none;
  position: relative;
  display: inline-block;
  border-radius: 12px;
}
.nav-link.active {
  color: #2563eb;
  font-weight: 700;
  background: #e3eaf2;
}
.nav-link.active::after {
  display: none;
}
.nav-link:hover {
  color: #2563eb;
  background: #e3eaf2;
}
.main-content {
  padding: 40px 20px;
  width: 100%;
}
@media (max-width: 900px) {
  .sidebar {
    display: none;
  }
  .main-area {
    margin-left: 0;
    width: 100vw;
  }
  .navbar {
    padding: 0 10px;
  }
  .main-content {
    padding: 24px 4vw;
  }
  .nav-tabs {
    gap: 18px;
  }
}
@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    height: auto;
    padding: 10px 2vw;
  }
  .nav-left {
    font-size: 1.1rem;
    margin-bottom: 6px;
  }
  .nav-tabs {
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .main-content {
    padding: 12px 2vw;
  }
}
</style> 