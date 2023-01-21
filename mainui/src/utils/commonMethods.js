export default {
  async reloadLastSave (saveFile) {
    await this.$store.dispatch('loadGameRecord', saveFile)
    this.$router.push({ path: '/world/map' })
  }
}
