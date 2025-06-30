# PTCG Tool - 宝可梦卡牌工具

一个专为宝可梦卡牌游戏设计的工具集合，旨在为玩家提供更好的游戏体验。

## 功能模块

- **个人赛BP** - 个人赛Ban/Pick工具
- **卡组统计** - 卡组分析与统计
- **瑞士轮计算器** - 比赛配对与积分计算
- **关于** - 项目信息

## 技术栈

### 前端
- Vue 3
- Vue Router 4
- Vite
- CSS3

### 后端
- 预留文件夹，待开发

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 项目结构

```
PtcgTool/
├── src/
│   ├── views/           # 页面组件
│   │   ├── PersonalBP.vue
│   │   ├── DeckStats.vue
│   │   ├── SwissCalculator.vue
│   │   └── About.vue
│   ├── router/          # 路由配置
│   │   └── index.js
│   ├── App.vue          # 主应用组件
│   ├── main.js          # 应用入口
│   └── style.css        # 全局样式
├── backend/             # 后端服务（预留）
├── index.html           # HTML入口
├── package.json         # 项目配置
├── vite.config.js       # Vite配置
└── README.md           # 项目说明
```

## 开发状态

- ✅ 项目框架搭建
- ✅ 导航栏实现
- ✅ 路由配置
- ✅ 页面布局
- ⏳ 功能模块开发（进行中）

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License 