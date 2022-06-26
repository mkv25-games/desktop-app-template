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
      <p>Information about the last save:</p>
      <p>
        <PropertyPanel :item="saveFileList.length ? saveFileList.map(n => n.name) : ['No recent saves found']" />
      </p>
    </div>
  </div>
</template>

<script>
import listSaveFiles from '@/formatting/listSaveFiles'

export default {
  async mounted () {
    await this.$store.dispatch('refreshSaveFileList')
  },
  computed: {
    saveFileList () {
      return this.$store.state.saveFileList
    },
    lastSaveFile () {
      return listSaveFiles(this.saveFileList)[0] || false
    }
  },
  methods: {
    async reloadLastSave (saveFile) {
      await this.$store.dispatch('loadGameRecord', saveFile)
      this.$router.push({ path: '/multi-page-section/section-1' })
    }
  }
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
