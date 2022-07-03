import { createStore } from 'vuex'
import rpcModel from '@/api/rpc'
import newSaveFile from '@/models/saveFile.js'
import newUserPreferences from '@/models/userPreferences.js'
import combineModpacks from '@/models/combineModpacks.js'

function defaultProgramModel () {
  return {
    userPreferences: newUserPreferences(),
    saveFile: newSaveFile(),
    saveFileList: [],
    modpacks: [],
    gamedata: {}
  }
}

function clone (data) {
  return JSON.parse(JSON.stringify(data))
}

function setup () {
  const rpc = rpcModel.instance
  const main = createStore({
    state: defaultProgramModel(),
    mutations: {
      hideDeveloperTools (state) {
        state.userPreferences.developerTools.visible = false
      },
      showDeveloperTools (state) {
        state.userPreferences.developerTools.visible = true
      },
      setUserPreferences (state, data) {
        state.userPreferences = clone(data)
      },
      patchUserPreferences (state, data) {
        state.userPreferences = Object.assign({}, state.userPreferences, clone(data))
      },
      assignSaveFile (state, saveFile) {
        state.saveFile = saveFile
      },
      saveFileList (state, saveFileList) {
        state.saveFileList = saveFileList
      },
      setVersion (state, version) {
        state.version = version
      },
      modpacks (state, modpacks) {
        state.modpacks = modpacks
      },
      toggleModpackStatus (state, modpackStatus) {
        state.userPreferences.modpackStatus[modpackStatus.package] = modpackStatus.enabled
      },
      gamedata (state, gamedata) {
        state.gamedata = gamedata
      }
    },
    actions: {
      async increment ({ state, commit, dispatch }) {
        commit('patchUserPreferences', { count: state.userPreferences.count + 1 })
        dispatch('saveUserPreferences')
      },
      async saveUserPreferences ({ state }) {
        const rpcProxy = await rpc.fetch()
        return rpcProxy.sendData('userPreferences', clone(state.userPreferences))
      },
      async loadUserPreferences ({ commit }) {
        const rpcProxy = await rpc.fetch()
        const preferences = await rpcProxy.requestData('userPreferences') || {}
        commit('setUserPreferences', preferences.data)
      },
      async resetUserPreferences ({ commit, state }) {
        commit('setUserPreferences', newUserPreferences())
        const rpcProxy = await rpc.fetch()
        await rpcProxy.sendData('userPreferences', clone(state.userPreferences))
      },
      async getVersion ({ commit }) {
        const rpcProxy = await rpc.fetch()
        const version = await rpcProxy.version()
        commit('setVersion', version)
      },
      async loadGameRecord ({ commit }, payload) {
        const rpcProxy = await rpc.fetch()
        const saveFile = await rpcProxy.requestData(payload.name)
        console.log('store/main.js SaveFile:', saveFile, 'Payload:', payload)
        commit('assignSaveFile', saveFile.data)
      },
      async saveGameRecord ({ commit, state }, saveFile) {
        commit('assignSaveFile', saveFile)
        const rpcProxy = await rpc.fetch()
        const data = clone(saveFile)
        return rpcProxy.sendData(state.saveFile.name, data)
      },
      async refreshSaveFileList ({ commit }) {
        const rpcProxy = await rpc.fetch()
        const files = await rpcProxy.findFiles('**/*')
        const saveFileList = files
          .filter(file => file.filepath.includes('/savedata/') || file.filepath.includes('\\savedata\\'))
          .filter(file => !file.filepath.includes('userPreferences.json'))
        commit('saveFileList', saveFileList)
      },
      async loadModpacks ({ state, commit }) {
        const rpcProxy = await rpc.fetch()
        const modpacks = await rpcProxy.findModpacks()
        commit('modpacks', modpacks)
        const modpackStatus = state.userPreferences.modpackStatus
        const allModpackData = combineModpacks(modpacks, modpackStatus)
        commit('gamedata', allModpackData)
      },
      async combineModpacks ({ state, commit }) {
        const modpacks = state.modpacks
        const modpackStatus = state.userPreferences.modpackStatus
        const allModpackData = combineModpacks(modpacks, modpackStatus)
        commit('gamedata', allModpackData)
      },
      async toggleModpackStatus ({ dispatch }) {
        await dispatch('saveUserPreferences')
        await dispatch('combineModpacks')
      },
      async hideDeveloperTools ({ commit }, state) {
        commit('hideDeveloperTools')
        const rpcProxy = await rpc.fetch()
        return rpcProxy.updateDeveloperTools(state.userPreferences.developerTools.visible)
      },
      async showDeveloperTools ({ commit, state }) {
        commit('showDeveloperTools')
        const rpcProxy = await rpc.fetch()
        return rpcProxy.updateDeveloperTools(state.userPreferences.developerTools.visible)
      }
    },
    modules: {}
  })

  main.getGamedataIndex = (type, property) => {
    const { gamedata } = main.state
    const dataset = gamedata[type] || []
    const index = dataset.reduce((acc, item) => {
      const key = item[property]
      acc[key] = item
      return acc
    }, {})
    return index
  }

  return main
}

export default setup()
