<template>
  <div class="universe">
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
        <router-link v-if="contactList.length > 0" to="/contact-management">Manage Save Files</router-link>
        <span v-else class="disabled-link">[ Manage Save Files ]</span>
      </p>

    </div>
    <div class="column">
      <h2>Right Column</h2>
      <p>Information about the last save:</p>
      <p>
        <PropertyPanel :item="contactList.length ? contactList : ['No recent saves found']" />
      </p>
    </div>
  </div>
</template>

<script>
import listContacts from '@/formatting/listContacts'

export default {
  async mounted () {
    await this.$store.dispatch('refreshContactList')
  },
  computed: {
    contactList () {
      return this.$store.state.contactList
    },
    lastSaveFile () {
      return listContacts(this.contactList)[0] || false
    }
  },
  methods: {
    async reloadLastSave (contact) {
      await this.$store.dispatch('loadContact', contact)
      this.$router.push({ path: '/galaxy/galaxy-view' })
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
