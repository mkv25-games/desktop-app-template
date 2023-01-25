import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import MainStore from './store/main'

import setupFontAwesome from './components/FontAwesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import componentIndex from './componentIndex'

function registerAllComponentsGlobally (app) {
  Object.entries(componentIndex).forEach(([name, value]) => {
    app.component(name, value)
  })
}

let mainUIStarted = false
async function startMainUI () {
  if (mainUIStarted) {
    return
  }
  const mainStore = new MainStore()
  mainUIStarted = true
  setupFontAwesome(App)
  const app = createApp(App)
    .provide('store', mainStore)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)

  app.config.globalProperties.$store = mainStore

  registerAllComponentsGlobally(app)

  app.mount('#mainui-app')
}

function raceStartupEvent () {
  window.preloadComplete = startMainUI
  if (typeof window.mainuiRunning === 'function') {
    console.log('[mainui.js] Main UI Running')
    window.mainuiRunning()
  }
  setTimeout(startMainUI, 500)
}

raceStartupEvent()
