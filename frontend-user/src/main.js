import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import './styles/global.scss'
import { setupErrorHandler } from './utils/errorHandler'
import { logger } from './utils/logger'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 设置全局错误处理
setupErrorHandler(app)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')

logger.info('应用启动成功')
