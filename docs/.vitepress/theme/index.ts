import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ReadingTime from './components/ReadingTime.vue'
import ApiDemo from './components/ApiDemo.vue'
import HeroImage from './components/HeroImage.vue'
import SwaggerDocs from './components/SwaggerDocs.vue'
import FlashdutyStatus from './components/FlashdutyStatus.vue'
import PageActions from './components/PageActions.vue'
import AskAI from './components/AskAI.vue'

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
      // 文档页顶部：问 AI / 复制本页 Markdown / 在 ChatGPT、Claude 中打开
      'doc-before': () => [h(PageActions), h(ReadingTime)],
      // 全站右下角的「问 AI」对话框
      'layout-bottom': () => h(AskAI),
      'home-hero-image': () => h(HeroImage)
    })
  }
}
