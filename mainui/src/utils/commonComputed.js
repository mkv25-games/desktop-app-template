
import listSaveFiles from '@/formatting/listSaveFiles'

export default {
  saveFileList () {
    return this.$store.state.saveFileList
  },
  lastSaveFile () {
    return listSaveFiles(this.saveFileList)[0] || false
  },
  characters () {
    return this.$store.state.gamedata.Character || []
  },
  locations () {
    return this.$store.state.gamedata.Location || []
  }
}
