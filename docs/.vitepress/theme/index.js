import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './refined.css'
import Layout from './components/Layout.vue'
import ProjectCard from './components/ProjectCard.vue'
import AboutPage from './components/AboutPage.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { initLocale } from './i18n.js'
import { provideI18n } from './composables/useI18n.js'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    initLocale()
    provideI18n(app)
    app.component('ProjectCard', ProjectCard)
    app.component('AboutPage', AboutPage)
    app.component('LanguageSwitcher', LanguageSwitcher)
  }
}
