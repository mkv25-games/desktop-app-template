export default {
  async reloadLastSave (saveFile) {
    await this.$store.loadGameRecord(saveFile)
    this.$router.push({ path: '/world/map' })
  }
}
