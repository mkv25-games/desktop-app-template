<template>
  <div class="template">
    <column-layout class="fixed-width-right overflow-hidden">
      <template v-slot:left>
        <pan-and-zoom class="darkmode">
          <div style="color: white; background: grey; padding: 2em; width: 200px; height: 100px; font-size: 20px;">World map goes here?</div>
        </pan-and-zoom>
      </template>
      <template v-slot:right>
        <h2>New Game Setup</h2>
        <p>What will this world be named?</p>
        <div class="form">
          <div class="form-row">
            <label>World Name:</label>
            <input v-model="filename" placeholder="Enter text" />
          </div>
          <div v-if="formErrors.length" class="form-errors">
            <h3>Form Errors</h3>
            <p class="form-error" v-for="message in formErrors" :key="message">{{ message }}</p>
          </div>
          <p class="actions">
            <router-link to="/" draggable="false" class="button">Cancel</router-link>
            <button v-on:click="submitForm">Create</button>
          </p>
        </div>
      </template>
    </column-layout>
  </div>
</template>

<script>
import newSaveFile from '@/models/saveFile'

export default {
  data () {
    return {
      filename: 'Ascension',
      formErrors: []
    }
  },
  computed: {
    electron () {
      return window.electron
    },
    saveFile () {
      return this.$store.state.saveFile
    }
  },
  methods: {
    validateForm () {
      this.formErrors = []
      if (!this.filename) {
        this.formErrors.push('No world name assigned')
      }

      return this.formErrors.length === 0
    },
    submitForm () {
      return this.validateForm() ? this.createNewGameFile(this) : false
    },
    async createNewGameFile (data) {
      console.log('Creating new game file:', data.filename)
      let saveFile
      try {
        saveFile = newSaveFile({ name: data.filename })
        await this.$store.saveGameRecord(saveFile)
        await this.$store.loadGameRecord(saveFile)
        this.$router.push({ path: '/full-page-section' })
      } catch (ex) {
        this.formErrors.push('Unable to create save file:', ex.message, saveFile)
        console.log('[StartNewGame.vue]', ex, 'Save File:', saveFile)
      }
      return true
    }
  }
}
</script>

<style scoped>
input {
  padding: 8px;
}
div.form {
  display: inline-block;
  width: 100%;
}
div.form-row {
  display: flex;
  align-items: center;
}
div.form-row > label {
  flex: 1 1;
  text-align: right;
  margin: 0.5em;
}
div.form-row > input {
  flex: 1 1;
}
p.actions {
  display: flex;
  justify-content: center;
}
p.actions > * {
  flex: 0 1;
  margin: 0.5em;
}
</style>
