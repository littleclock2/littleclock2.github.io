import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Layout from './components/Layout.vue'
import ProjectCard from './components/ProjectCard.vue'
import FileEditor from './components/FileEditor.vue'
import AboutPage from './components/AboutPage.vue'
import ClickEffects from './components/ClickEffects.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ProjectCard', ProjectCard)
    app.component('FileEditor', FileEditor)
    app.component('AboutPage', AboutPage)
    app.component('ClickEffects', ClickEffects)
  }
}
