<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-logo">PTCG Tool</div>
      <ul class="sidebar-menu">
        <li><router-link to="/" active-class="active" exact-active-class="active">个人赛</router-link></li>
        <li><router-link to="/team" active-class="active">团队赛</router-link></li>
        <li><router-link to="/deck-stats" active-class="active">卡组统计</router-link></li>
        <li><router-link to="/swiss-calculator" active-class="active">瑞士轮计算器</router-link></li>
        <li><router-link to="/about" active-class="active">关于</router-link></li>
      </ul>
      <div class="sidebar-footer">Authored by Zoo.牛油果</div>
    </aside>
    <div class="main-area">
      <nav class="navbar">
        <div class="nav-left">
          <button class="menu-toggle" @click="toggleSidebar">&#9776;</button>
          <span>PTCG Tool</span>
        </div>
        <ul class="nav-tabs">
          <li v-for="item in visibleNavItems" :key="item.path">
            <router-link :to="item.path" class="nav-link" active-class="active" exact>{{ item.name }}</router-link>
          </li>
          <li v-if="hiddenNavItems.length > 0" class="dropdown">
            <a href="#" class="nav-link more-btn" @click.prevent="toggleDropdown">更多</a>
            <ul v-if="isDropdownOpen" class="dropdown-menu">
              <li v-for="item in hiddenNavItems" :key="item.path">
                <router-link :to="item.path" class="dropdown-item" active-class="active" @click="closeDropdown">{{ item.name }}</router-link>
              </li>
            </ul>
          </li>
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
  name: 'App',
  data() {
    return {
      isDropdownOpen: false,
      isSidebarVisible: false,
      navItems: [
        { path: '/', name: '个人赛' },
        { path: '/team', name: '团队赛' },
        { path: '/deck-stats', name: '卡组统计' },
        { path: '/swiss-calculator', name: '瑞士轮计算器' },
        { path: '/about', name: '关于' }
      ],
      windowWidth: window.innerWidth
    };
  },
  computed: {
    visibleNavItems() {
      if (this.windowWidth <= 600) {
        return this.navItems.slice(0, 1);
      }
      if (this.windowWidth <= 768) {
        return this.navItems.slice(0, 3);
      }
      return this.navItems;
    },
    hiddenNavItems() {
      if (this.windowWidth <= 600) {
        return this.navItems.slice(1);
      }
      if (this.windowWidth <= 768) {
        return this.navItems.slice(3);
      }
      return [];
    }
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeDropdown() {
      this.isDropdownOpen = false;
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closeDropdown();
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
};
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
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 1.4rem;
  font-weight: bold;
  color: #222;
  letter-spacing: 1px;
}
.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
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
.nav-tabs li.dropdown {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  list-style: none;
  padding: 8px 0;
  margin: 8px 0 0 0;
  min-width: 120px;
  z-index: 1200;
}
.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #555;
  text-decoration: none;
  white-space: nowrap;
}
.dropdown-item:hover, .dropdown-item.active {
  background: #f0f0f0;
  color: #2563eb;
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
@media (max-width: 768px) {
  .sidebar {
    display: none; /* or transform: translateX(-100%); */
  }
  .main-area {
    margin-left: 0;
    width: 100vw;
  }
  .menu-toggle {
    display: block;
  }
  .nav-tabs {
    gap: 12px;
  }
}
@media (max-width: 600px) {
  .navbar {
    padding: 0 16px;
  }
  .nav-left span {
    display: none;
  }
}
.nav-link.router-link-exact-active {
  color: #2563eb;
  font-weight: 700;
  background: #e3eaf2;
}
.dropdown-item.router-link-exact-active {
  background: #f0f0f0;
  color: #2563eb;
}
</style> 