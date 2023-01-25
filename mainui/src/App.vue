<template>
  <div class="app-frame">
    <primary-nav class="primary-nav" />
    <router-view class="router-view" />
  </div>
</template>

<script>
import PrimaryNav from '@/components/PrimaryNav.vue'

export default {
  components: {
    PrimaryNav
  },
  async mounted () {
    const { $store } = this
    await $store.getVersion()
    await $store.loadUserPreferences()
    await $store.refreshSaveFileList()
    await $store.loadModpacks()
  }
}
</script>
<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
#mainui-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  overflow: hidden;
}

.app-frame {
  display: flex;
  align-items: stretch;
  flex-flow: column nowrap;
  height: 100%;
}
.router-view {
  flex: auto;
  overflow: hidden;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
}

button, .button {
  padding: 0.5em 0.8em;
  background: #555;
  border: 0;
  border-radius: 0.2em;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 1.0em;
  color: white;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition: background 0.1s ease-in-out;
}
button:hover, .button:hover {
  background: #999;
}
button:active, .button:active {
  background: #777;
}

*:focus {
  outline: 2px solid orange;
  outline-offset: -2px;
}
</style>
