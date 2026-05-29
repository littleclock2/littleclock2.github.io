import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Layout from './components/Layout.vue'
import FeatureCard from './components/FeatureCard.vue'
import ProjectCard from './components/ProjectCard.vue'
import FileEditor from './components/FileEditor.vue'
import AboutPage from './components/AboutPage.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('FeatureCard', FeatureCard)
    app.component('ProjectCard', ProjectCard)
    app.component('FileEditor', FileEditor)
    app.component('AboutPage', AboutPage)
  }
}
