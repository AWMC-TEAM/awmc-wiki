import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ReadingTime from './components/ReadingTime.vue'
import ApiDemo from './components/ApiDemo.vue'
import HeroImage from './components/HeroImage.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReadingTime', ReadingTime)
    app.component('ApiDemo', ApiDemo)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(ReadingTime),
      'home-hero-image': () => h(HeroImage)
    })
  }
}
