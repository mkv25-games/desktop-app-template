<template>
  <settings class="mods scroll">
    <div class="server-status">{{ modpackServerStatus }}</div>
    <div class="mods">
      <div class="modpack" v-for="modpack in modpacks" :key="modpack">
        <Collapsed :title="modpack.packdata.package || 'No package info'">
          <p>Content summary: {{ summarise(modpack).join(', ') }}</p>
          <p>Website: <a :href="modpack.packdata.website">{{ modpack.packdata.website }}</a></p>
          <Toggle on="Mod Enabled by User" off="Mod Disabled by User" unknown="Click here to enable/disable modpack" v-model="$store.state.userPreferences.modpackStatus[modpack.packdata.package]" v-on:toggled="modStatusChange()" />

          <p><checkmark v-model="modpack.packdata.enabled" /> {{ modpack.packdata.enabled ? 'Enabled' : 'Disabled' }} by Default by Modpack author</p>
          <div v-for="([datasetKey, items]) in datasets(modpack)" :key="datasetKey" class="dataset">
            <h3>{{ datasetKey }}</h3>
            <tabulation :items="items" />
          </div>
          <p v-if="modpack.messages.length">{{ modpack.messages }}</p>
        </Collapsed>
      </div>
    </div>
  </settings>
</template>

<script>
import Tabulation from '../../components/ui/Tabulation.vue'
import Checkmark from '../../components/ui/Checkmark.vue'

import ModpackClient from '../../models/modpackClient.js'

const modpackServerPort = 25015
const modpackClient = new ModpackClient({ baseUrl: `http://localhost:${modpackServerPort}/` })
modpackClient.init()

export default {
  components: { Tabulation, Checkmark },
  async mounted () {
    await this.$store.loadModpacks()
  },
  computed: {
    modpacks () {
      return this.$store.state.modpacks || []
    },
    modpackServerStatus() {
      return modpackClient._lastError ?? modpackClient.serverInfo
    }
  },
  methods: {
    summarise (modpack) {
      return this.datasets(modpack)
        .map(([key, value]) => {
          return `${key} (${value.length})`
        })
    },
    datasets (modpack) {
      return Object.entries(modpack.packdata)
        .filter(([key, value]) => Array.isArray(value))
    },
    modStatusChange () {
      this.$store.toggleModpackStatus()
    }
  }
}
</script>

<style scoped>
.modpack {
  margin: 0;
}
.modpack > h2 {
  background: #AAA;
  color: white;
  padding: 0.2em;
  margin-top: 0;
}
.server-status {
  padding: 0.5em;
  background: rgb(251, 179, 13);
  color: #333;
}
</style>
