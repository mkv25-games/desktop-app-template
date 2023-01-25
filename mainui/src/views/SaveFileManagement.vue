<template>
  <div class="save-file-management">
    <h1>Local Save Files</h1>
    <p v-if="loading">Loading Save Data...</p>
    <div v-else-if="saveFiles.length">
      <p>Save files are ordered by save date</p>
      <ul>
        <li v-for="saveFile in saveFiles" :key="saveFile.filepath">
          <div class="name-label" v-on:click="loadGameRecord(saveFile)">{{ saveFile.name }}</div>
          <div class="date-label">{{ formatDate(saveFile.fileinfo.mtime) }}</div>
          <div class="delete-label button" v-on:click="deleteSaveFile(saveFile.name)"><Icon icon="trash" /></div>
        </li>
      </ul>
      <p>You can load up, or delete save files from this list.</p>
    </div>
    <div v-else>
      <p>No saveFiles found.</p>
      <p>Consider: <router-link to="/start-new-game">Start New Game</router-link></p>
    </div>
    <p>
      <router-link to="/full-page-section" class="button">&lt; Back</router-link>
    </p>
    <div v-if="errors.length > 0" class="errors">
      <h2>Errors</h2>
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import formatDate from '@/formatting/formatDate'
import listSaveFiles from '@/formatting/listSaveFiles'
// const exampleSaveFiles = [{ name: 'Loading saveFiles', fileinfo: { mtime: new Date() }, filepath: '/' }]

export default {
  data () {
    return {
      errors: [],
      loading: true
    }
  },
  computed: {
    electron () {
      return window.electron
    },
    saveFiles () {
      return listSaveFiles(this.$store.state.saveFileList)
    }
  },
  methods: {
    async loadGameRecord (savefile) {
      try {
        await this.$store.loadGameRecord(savefile)
        this.$router.push({ path: '/full-page-section' })
      } catch (ex) {
        this.errors.push(`Unable to load savefile ${savefile.filepath}.`)
      }
    },
    async deleteSaveFile (key) {
      await this.electron.clearData(key)
      return this.findSaveFiles()
    },
    async findSaveFiles () {
      this.loading = true
      await this.$store.refreshSaveFileList()
      this.loading = false
    },
    formatDate
  },
  async mounted () {
    this.findSaveFiles()
  }
}
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  display: inline-block;
  min-width: 700px;
  border: 4px solid black;
  background: #555;
}
li {
  display: flex;
  margin: 4px;
  list-style: none;
  color: white;
}
li > div {
  padding: 4px;
  display: inline-block;
  cursor: pointer;
}
li:hover > div.name-label:hover {
  background: #444;
}
li:hover > div.delete-label:hover {
  background: #533;
}
li > div.name-label {
  text-align: left;
  flex: 1 1;
  margin-right: 4px;
  text-transform: uppercase;
}
</style>
