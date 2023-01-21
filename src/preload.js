const report = (...messages) => { console.log('[preload.js]', ...messages) }

window.ELECTRON_ENABLE_SECURITY_WARNINGS = false

window.mainuiRunning = function () {
  report('Received notification from [mainui.js] that Main UI Running')
}

window.addEventListener('DOMContentLoaded', () => {
  if (typeof window.preloadComplete === 'function') {
    report('Preload Complete')
    window.preloadComplete()
  }
})
