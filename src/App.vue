<template>
  <div class="layout">
    <aside class="sidebar" :class="{ 'is-open': isSidebarVisible }">
      <div class="sidebar-logo">
        <img :src="logo" alt="PTCG Tool Logo" class="logo-img">
        <span>PTCG Tool</span>
      </div>
      <ul class="sidebar-menu">
        <template v-for="item in navItems" :key="item.name">
            <li v-if="item.children" class="sidebar-heading">{{ item.name }}</li>
            <li v-for="child in item.children" :key="child.path">
                <router-link :to="child.path" active-class="active" @click="closeSidebar">{{ child.name }}</router-link>
            </li>
            <li v-if="!item.children">
                <router-link :to="item.path" active-class="active" @click="closeSidebar">{{ item.name }}</router-link>
            </li>
        </template>
      </ul>
      <div class="sidebar-footer">Authored by Zoo.牛油果</div>
    </aside>
    <div class="main-area">
      <div class="backdrop" :class="{ 'is-open': isSidebarVisible }" @click="closeSidebar"></div>
      <nav class="navbar">
        <div class="nav-left">
          <button class="menu-toggle" @click="toggleSidebar">&#9776;</button>
          <img v-show="windowWidth > 600" :src="logo" alt="PTCG Tool Logo" class="logo-img">
          <span v-show="windowWidth > 900">PTCG Tool</span>
        </div>
        <ul class="nav-tabs" ref="navTabs">
          <template v-for="item in navItems" :key="item.name">
            <li v-if="item.children" class="nav-item-container"
                :class="{ 'active-parent': isParentActive(item) }"
                @mouseenter="desktopShowDropdown(item.name)" @mouseleave="desktopCloseDropdown"
                @click="mobileToggleDropdown(item.name)">
              <span class="nav-link">
                <template v-if="isMobile && isParentActive(item)">
                  {{ getActiveChildName(item) }}
                </template>
                <template v-else>
                  {{ item.name }}
                </template>
                <span class="arrow-down"></span>
              </span>
              <ul v-if="openDropdown === item.name" class="dropdown-menu">
                <li v-for="child in item.children" :key="child.path">
                  <router-link :to="child.path" class="dropdown-item"
                    :class="{ active: $route.path === child.path }"
                    @click.stop="closeDropdown">{{ child.name }}</router-link>
                </li>
              </ul>
            </li>
            <li v-else @click="closeDropdown">
              <router-link :to="item.path" class="nav-link" active-class="active" exact>{{ item.name }}</router-link>
            </li>
          </template>
        </ul>
      </nav>
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import logo from './assets/images/logo.png';

export default {
  name: 'App',
  data() {
    return {
      logo,
      isSidebarVisible: false,
      openDropdown: null,
      navItems: [
        { name: '比赛', children: [
          { path: '/', name: '个人赛' },
          { path: '/team', name: '团队赛' }
        ]},
        { name: '卡组', children: [
          { path: '/deck-stats', name: '卡组统计' }
        ]},
        { name: '工具', children: [
          { path: '/swiss-calculator', name: '瑞士轮计算器' }
        ]},
        { name: '关于', path: '/about' }
      ],
      windowWidth: window.innerWidth
    };
  },
  computed: {
    isMobile() {
      return this.windowWidth <= 900;
    },
    currentMobileChild() {
      // If on mobile and current route matches a child, return that child
      if (!this.isMobile) return null;
      for (const item of this.navItems) {
        if (item.children) {
          const found = item.children.find(child => this.$route.path === child.path);
          if (found) return found;
        } else if (item.path === this.$route.path) {
          return item;
        }
      }
      return null;
    }
  },
  methods: {
    isParentActive(item) {
      if (!item.children) return false;
      return item.children.some(child => this.$route.path === child.path);
    },
    getActiveChildName(item) {
      if (!item.children) return item.name;
      const found = item.children.find(child => this.$route.path === child.path);
      return found ? found.name : item.name;
    },
    desktopShowDropdown(itemName) {
      if (window.innerWidth > 900) this.openDropdown = itemName;
    },
    desktopCloseDropdown() {
      if (window.innerWidth > 900) this.openDropdown = null;
    },
    mobileToggleDropdown(itemName) {
      if (window.innerWidth <= 900) {
        this.openDropdown = this.openDropdown === itemName ? null : itemName;
      }
    },
    closeDropdown() {
      this.openDropdown = null;
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    closeSidebar() {
      this.isSidebarVisible = false;
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.closeDropdown();
      this.closeSidebar();
    },
    handleScroll() {
      this.closeDropdown();
      this.closeSidebar();
    },
    handleClickOutside(event) {}
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('scroll', this.handleScroll, true);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('scroll', this.handleScroll, true);
  }
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}
.logo-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 12px;
    object-fit: cover;
}
.sidebar {
  position: fixed;
  top: 32px;
  left: 32px;
  width: 210px;
  height: calc(100vh - 64px);
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  padding: 32px 0 18px 0;
  z-index: 1100;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s;
  transform: translateX(0);
}
.sidebar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 40px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  padding: 0 24px;
}
.sidebar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  align-items: flex-start;
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-heading {
  color: #b0b0b0;
  font-weight: bold;
  font-size: 0.98rem;
  padding: 14px 24px 4px 24px;
  margin-top: 16px;
  margin-bottom: 2px;
  letter-spacing: 0.5px;
}
.sidebar-menu li {
  width: 100%;
  margin-bottom: 2px;
}
.sidebar-menu :deep(a) {
  display: block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 0 24px;
  color: #222 !important;
  font-size: 1.08rem;
  font-weight: 500;
  text-align: left;
  border-radius: 0 !important;
  transition: background 0.18s, color 0.18s;
  text-decoration: none !important;
  background: transparent;
}
.sidebar-menu :deep(a.active) {
  color: #2563eb !important;
  background: #e3eaf2 !important;
  font-weight: 700 !important;
  border-radius: 0 !important;
  text-decoration: none !important;
}
.sidebar-menu :deep(a:hover) {
  background: #e3eaf2 !important;
  color: #2563eb !important;
  border-radius: 0 !important;
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
  margin-left: 274px; /* 210px + 32px*2 a bit more space */
  transition: margin-left 0.2s;
  position: relative;
  z-index: 1;
}
.backdrop {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1150; /* Above sidebar */
}
.backdrop.is-open {
    display: block;
}
.navbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 0 1rem;
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
  display: block;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
}
.nav-tabs {
  display: flex;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-item-container {
  position: relative;
}
.nav-link {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 0;
  background: transparent;
  color: #222;
  font-size: 1.08rem;
  font-weight: 500;
  transition: background 0.18s, color 0.18s;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
}
.nav-item-container.active-parent > .nav-link,
.nav-link.active, .nav-link.router-link-exact-active {
  background: transparent;
  color: #2563eb;
  font-weight: 700;
}
.arrow-down {
  margin-left: 6px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid currentColor;
  display: inline-block;
  vertical-align: middle;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 160px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(37,99,235,0.10);
  border-radius: 0 0 12px 12px;
  z-index: 1200;
  padding: 8px 0;
  margin-top: 2px;
  overflow: hidden;
}
.dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 24px;
  border-radius: 0;
  color: #222;
  font-size: 1.08rem;
  font-weight: 500;
  background: transparent;
  text-decoration: none;
  transition: background 0.18s, color 0.18s;
  text-align: left;
}
.dropdown-item.active, .dropdown-item.router-link-exact-active {
  background: transparent;
  color: #2563eb;
  font-weight: 700;
}
.dropdown-item:hover {
  background: #f0f6ff;
  color: #2563eb;
}
.main-content {
  padding: 40px 20px;
  width: 100%;
}
.nav-mobile-single {
  flex: 1 1 100%;
  display: flex;
  justify-content: center;
}
@media (max-width: 900px) {
  .sidebar {
    top: 0;
    left: 0;
    width: 240px;
    height: 100vh;
    border-radius: 0;
    padding-top: 24px;
    z-index: 1200;
    box-shadow: 0 0 20px rgba(0,0,0,0.2);
    transform: translateX(-100%);
  }
  .sidebar.is-open {
    transform: translateX(0);
  }
  .backdrop.is-open {
      display: block;
  }
  .main-area {
    margin-left: 0;
    width: 100vw;
  }
  .navbar {
    justify-content: flex-start;
    padding: 0 1rem;
  }
  .menu-toggle {
      display: block;
  }
  .main-content {
    padding: 24px 4vw;
  }
  .nav-tabs {
    gap: 0;
    width: 100%;
    justify-content: space-between;
    padding: 0 8px;
  }
  .nav-link {
    flex: 1 1 0;
    text-align: center;
    font-size: 0.98rem;
    padding: 8px 0;
  }
  .nav-item-container {
    flex: 1 1 0;
    display: flex;
    justify-content: center;
  }
  .nav-tabs > li {
    flex: 1 1 0;
    display: flex;
    justify-content: center;
  }
  .nav-mobile-single .nav-link {
    width: 100vw;
    text-align: center;
    font-size: 1.08rem;
    font-weight: 700;
    color: #2563eb;
    background: transparent;
    border-radius: 0;
    padding: 10px 0;
  }
  .dropdown-item {
    font-size: 0.95rem;
    padding: 8px 12px;
  }
}
@media (max-width: 768px) {
  .nav-tabs {
    gap: 4px;
  }
  .nav-link {
      font-size: 0.95rem;
      padding: 6px 8px;
  }
}
@media (max-width: 600px) {
  .nav-left {
    gap: 12px;
  }
  .nav-left .logo-img {
      margin-right: 0;
  }
  .nav-tabs {
      gap: 2px;
  }
  .nav-link {
    font-size: 0.92rem;
    padding: 7px 0;
  }
  .dropdown-item {
    font-size: 0.92rem;
    padding: 7px 8px;
  }
}
.nav-link.router-link-exact-active {
  color: #2563eb;
  font-weight: 700;
  background: #e3eaf2;
}
.nav-left .logo-img {
    display: none; /* Hide logo in top nav on desktop */
}
</style> 