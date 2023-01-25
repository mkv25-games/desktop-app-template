<template>
  <div class="full-page-section">
    <h1>Full Page Section</h1>

    <div class="column">
      <h2>Left Column</h2>
      <p>Options for new and returning players:</p>

      <div class="flex-column">
        <p v-if="$store.gameLoaded">Current game: {{ $store?.state?.saveFile?.name }}</p>
        <a v-if="lastSaveFile" v-on:click="reloadLastSave(lastSaveFile)" draggable="false" class="button">Continue <b>{{ lastSaveFile.name }}</b></a>
        <span v-else class="button disabled-link">[ No Recent Save File Found ]</span>
        <router-link to="/start-new-game" draggable="false" class="button">Start New Game</router-link>
        <router-link v-if="saveFileList.length > 0" to="/save-file-management" draggable="false" class="button">Manage Save Files</router-link>
        <span v-else class="disabled-link">[ Manage Save Files ]</span>
      </div>
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
      this.$store.refreshSaveFileList(),
      this.$store.loadModpacks()
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
      await this.$store.loadGameRecord(saveFile)
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
.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.flex-column > * {
  margin: 0.2em 0;
}
.disabled-link {
  opacity: 0.4;
  cursor:default;
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
