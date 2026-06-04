import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Layout from './components/Layout.vue'
import ProjectCard from './components/ProjectCard.vue'
import FileEditor from './components/FileEditor.vue'
import AboutPage from './components/AboutPage.vue'
import ClickEffects from './components/ClickEffects.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import { initLocale } from './i18n.js'
import { provideI18n } from './composables/useI18n.js'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    initLocale()
    provideI18n(app)
    app.component('ProjectCard', ProjectCard)
    app.component('FileEditor', FileEditor)
    app.component('AboutPage', AboutPage)
    app.component('ClickEffects', ClickEffects)
    app.component('LanguageSwitcher', LanguageSwitcher)
    app.component('MusicPlayer', MusicPlayer)
  }
}
