<template>
  <div class="full-page-section">
    <h1>Full Page Section</h1>

    <div class="column">
      <h2>Left Column</h2>
      <p>Options for new and returning players:</p>

      <p>
        <a v-if="lastSaveFile" v-on:click="reloadLastSave(lastSaveFile)">Continue <b>{{ lastSaveFile.name }}</b></a>
        <span v-else class="disabled-link">[ No Recent Save File Found ]</span>
      </p>
      <p><router-link to="/start-new-game">Start New Game</router-link></p>
      <p>
        <router-link v-if="saveFileList.length > 0" to="/save-file-management">Manage Save Files</router-link>
        <span v-else class="disabled-link">[ Manage Save Files ]</span>
      </p>

    </div>
    <div class="column">
      <h2>Right Column</h2>
      <p>Information about available characters:</p>
      <VerticalTileGrid :tiles="characters" :columns="1" :rows="4" :tileWidth="300">
        <template v-slot="{ tile }">
          <div class="icon-label" :style="{ background: tile.color }">
            <span><font-awesome-icon :icon="['fas', tile.icon || 'star']" /></span>
            <label>{{ tile.name }}</label>
          </div>
        </template>
      </VerticalTileGrid>
      <p>Information about available technologies:</p>
      <VerticalTileGrid :tiles="technologies" :columns="1" :rows="4" :tileWidth="300">
        <template v-slot="{ tile }">
          <div class="icon-label">
            <span><font-awesome-icon :icon="['fas', tile.icon || 'star']" /></span>
            <label>{{ tile.name }}</label>
          </div>
        </template>
      </VerticalTileGrid>
    </div>
  </div>
</template>

<script>
import listSaveFiles from '@/formatting/listSaveFiles'
import VerticalTileGrid from '../components/ui/VerticalTileGrid.vue'

export default {
  async mounted () {
    await Promise.all([
      this.$store.dispatch('refreshSaveFileList'),
      this.$store.dispatch('loadModpacks')
    ])
  },
  computed: {
    saveFileList () {
      return this.$store.state.saveFileList
    },
    lastSaveFile () {
      return listSaveFiles(this.saveFileList)[0] || false
    },
    characters () {
      return this.$store.state.gamedata.Character || []
    },
    technologies () {
      return this.$store.state.gamedata.Technology || []
    }
  },
  methods: {
    async reloadLastSave (saveFile) {
      await this.$store.dispatch('loadGameRecord', saveFile)
      this.$router.push({ path: '/multi-page-section/section-1' })
    }
  },
  components: { VerticalTileGrid }
}
</script>

<style lang="css" scoped>
.column {
  vertical-align: top;
  display: inline-block;
  width: 48%;
}
.disabled-link {
  opacity: 0.4;
  cursor:default;
}
a {
  color: purple;
  text-decoration: none;
  cursor: pointer;
}
a:hover {
  color: purple;
  text-shadow: 2px 2px rgb(50, 20, 20, 0.2);
}

.icon-label {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: stretch;
  margin: auto;
  width: 100%;
}
.icon-label:hover {
  background: #111;
  color: white;
}
.icon-label:active {
  background: #444;
  color: white;
}
.icon-label > span {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 1;
  min-width: 2em;
  min-height: 2em;
  padding: 0.5em;
}
.icon-label > label {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1 50;
  padding: 0.5em;
}
</style>
