import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ReadingTime from './components/ReadingTime.vue'
import ApiDemo from './components/ApiDemo.vue'
import HeroImage from './components/HeroImage.vue'
import SwaggerDocs from './components/SwaggerDocs.vue'
import FlashdutyStatus from './components/FlashdutyStatus.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReadingTime', ReadingTime)
    app.component('ApiDemo', ApiDemo)
    app.component('SwaggerDocs', SwaggerDocs)
    app.component('FlashdutyStatus', FlashdutyStatus)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 全站故障/维护横幅：无进行中事件时组件自动隐藏，用户可手动关闭。
      'layout-top': () => h(FlashdutyStatus, { type: 'banner', position: 'top' }),
      'doc-before': () => h(ReadingTime),
      'home-hero-image': () => h(HeroImage)
    })
  }
}
