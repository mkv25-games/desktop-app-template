<template>
  <settings class="debug scroll">
    <h1>Debug Tools</h1>
    <p>
      <button v-on:click="hideDeveloperTools" v-if="developerToolsVisible">
        <span>Hide Developer Tools</span>
        <Icon v-if="changingDevTools" icon="hourglass-half" />
      </button>
      <button v-on:click="showDeveloperTools" v-else>
        <span>Show Developer Tools</span>
        <Icon v-if="changingDevTools" icon="hourglass-half" />
      </button>
    </p>
    <p>
      <button v-on:click="$store.loadUserPreferences()">Reload User Preferences</button>
    </p>
    <h3>State</h3>
    <pre><code>{{ state }}</code></pre>
  </settings>
</template>

<script>
export default {
  data () {
    return {
      state: this.$store.state,
      changingDevTools: false
    }
  },
  computed: {
    developerToolsVisible () {
      const { state } = this
      return state?.userPreferences?.developerTools?.visible
    }
  },
  async mounted () {
    this.developerToolsVisible ? this.showDeveloperTools() : this.hideDeveloperTools()
  },
  methods: {
    async showDeveloperTools () {
      const { $store } = this
      this.changingDevTools = true
      await $store.showDeveloperTools()
      this.changingDevTools = false
      this.state = $store.state
    },
    async hideDeveloperTools () {
      const { $store } = this
      this.changingDevTools = true
      await $store.hideDeveloperTools()
      this.changingDevTools = false
      this.state = $store.state
    }
  },
  watch: {
    store (newVal) {
      console.log('Store changed:', newVal)
    }
  }
}
</script>
