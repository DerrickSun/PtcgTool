# PTCG Tool - A Modern Pokémon TCG Utility

A sleek, modern, and intelligent web-based utility for Pokémon TCG players. This tool is designed to assist with tournament preparation, offering features from win-rate tracking to advanced Ban/Pick (BP) strategic analysis.

**[➡️ Live Demo Here](https://derricksun.github.io/PtcgTool/)**

---

## ✨ Key Features

This application is built as a Single Page Application (SPA) using Vue 3 and Vite, focusing on providing a fast and intuitive user experience.

### 🃏 Personal BP (Ban/Pick) Assistant
The core feature of the application. It provides a powerful, multi-layered strategic analysis for a 3-deck vs 3-deck ban/pick phase.

- **Intuitive Deck Selection**: Easily configure your three decks and your opponent's three decks in a clean, unified interface.
- **Win-Rate Matrix**: Instantly generates a 3x3 grid displaying the head-to-head win percentages for every possible matchup, color-coded for quick assessment.
- **Level 1 Analysis**: Provides a straightforward recommendation for your "first-move" ban, targeting the opponent's deck that poses the greatest overall threat to your lineup.
- **Level 5 Analysis**: Simulates a smarter opponent. It assumes the opponent will ban your strongest deck and then provides a complete "counter-move" strategy, recommending your best ban and pick under this less-than-ideal scenario.

### 📊 Deck Stats
A comprehensive tool for managing and viewing matchup statistics.

- **Dynamic Win-Rate Matrix**: View a full matrix of win rates between all available decks.
- **Set Filtering**: Filter the matrix to only include data relevant to a specific card set or format.
- **Inline Editing**: Quickly update win-rate data directly within the table for easy management.

### 🧮 Swiss Calculator
A handy utility for tournament players to calculate their odds.

- **Advancement Calculation**: Based on the number of players, rounds, and top cut size, it calculates the required points and potential scenarios for advancing to the next stage.

---

## 🛠️ Technologies Used

- **Frontend**: [Vue 3](https://vuejs.org/) (using Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS3 with a focus on modern, responsive design.
- **Deployment**: [GitHub Pages](https://pages.github.com/)

---

## 🚀 Getting Started

To run this project on your local machine, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16.x or newer recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager

### Installation & Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/DerrickSun/PtcgTool.git
    cd PtcgTool
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Deployment

This project is configured for easy deployment to GitHub Pages.

1.  **Push your code** to the `main` branch of your GitHub repository.

2.  **Run the deployment script:**
    ```bash
    npm run deploy
    ```
    This script will first build the project into the `dist` folder and then automatically push the contents of that folder to a `gh-pages` branch on your repository, which will trigger the GitHub Pages deployment.

---

## 📂 Project Data

The tool's data is intentionally kept in simple JSON files for easy viewing and modification. You can find them in the `public/data/` directory.

-   `decks.json`: A list of all available decks with their IDs and names.
-   `matchups.json`: The core win-rate data, structured as a nested object mapping `deckId` to opponent `deckId` and win rate.
-   `sets.json`: Defines the different card sets or formats for filtering on the Deck Stats page.

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