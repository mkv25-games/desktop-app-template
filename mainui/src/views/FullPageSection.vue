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
      <p>
        <VerticalTileGrid :item="characters" />
      </p>
      <p>Information about available technologies:</p>
      <p>
        <VerticalTileGrid :item="technologies" />
      </p>
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
</style>
