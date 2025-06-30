import { createRouter, createWebHistory } from 'vue-router'
import PersonalBP from '../views/PersonalBP.vue'
import DeckStats from '../views/DeckStats.vue'
import SwissCalculator from '../views/SwissCalculator.vue'
import About from '../views/About.vue'
import Team from '../views/Team.vue'

const routes = [
  {
    path: '/',
    name: 'PersonalBP',
    component: PersonalBP
  },
  {
    path: '/team',
    name: 'Team',
    component: Team
  },
  {
    path: '/deck-stats',
    name: 'DeckStats',
    component: DeckStats
  },
  {
    path: '/swiss-calculator',
    name: 'SwissCalculator',
    component: SwissCalculator
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 