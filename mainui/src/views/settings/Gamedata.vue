<template>
  <settings class="scroll">
    <div class="gamedata">
      <h2>Game Data</h2>
      <p v-if="Object.keys(gamedata).length > 0">Sections: {{ summarise(gamedata).join(', ') }}</p>
      <div v-else>
        <p>No data found! Are all mods disabled?</p>
      </div>
      <div v-for="([datasetKey, items]) in datasets(gamedata)" :key="datasetKey" class="dataset">
        <h3>{{ datasetKey }}</h3>
        <tabulation :items="items" />
      </div>
    </div>
  </settings>
</template>

<script>
export default {
  async mounted () {
    await this.$store.loadModpacks()
  },
  computed: {
    gamedata () {
      return this.$store.state.gamedata || []
    }
  },
  methods: {
    summarise (modpack) {
      return this.datasets(modpack)
        .map(([key, value]) => {
          return `${key} (${value.length})`
        })
    },
    datasets (gamedata) {
      return Object.entries(gamedata)
        .filter(([key, value]) => Array.isArray(value))
    }
  }
}
</script>

<style scoped>
.gamedata {
  padding-bottom: 0.5em;
  margin: 0;
}
.gamedata > h2 {
  background: #AAA;
  color: white;
  padding: 0.2em;
  margin-top: 0;
}
</style>
