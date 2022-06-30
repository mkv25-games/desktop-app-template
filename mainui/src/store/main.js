import { createStore } from 'vuex'
import rpcModel from '@/api/rpc'
import newSaveFile from '@/models/saveFile.js'
import newUserPreferences from '@/models/userPreferences.js'
import newModpack from '@/models/modpack.js'

function defaultUserPreferences () {
  return {
    userPreferences: newUserPreferences(),
    saveFile: newSaveFile(),
    saveFileList: [],
    modpacks: [],
    gamedata: {}
  }
}

function combineModpacks (modpacks) {
  const combined = modpacks.reduce((acc, item) => {
    const modpack = clone(item)
    Object.keys(modpack.packdata).forEach(key => {
      const packdata = modpack.packdata || {}
      const items = packdata[key] || []
      const target = acc[key] || []
      if (Array.isArray(target) && items.length > 0) {
        target.push(...items)
      }
      acc[key] = target
    })
    return acc
  }, newModpack())
  return combined
}

function clone (data) {
  return JSON.parse(JSON.stringify(data))
}

function setup () {
  const rpc = rpcModel.instance
  const main = createStore({
    state: defaultUserPreferences(),
    mutations: {
      increment (state) {
        state.userPreferences.count++
      },
      hideDeveloperTools (state) {
        state.userPreferences.developerTools.visible = false
      },
      showDeveloperTools (state) {
        state.userPreferences.developerTools.visible = true
      },
      setUserPreferences (state, newUserPreferences) {
        Object.assign(state.userPreferences, newUserPreferences)
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
      gamedata (state, gamedata) {
        state.gamedata = gamedata
      }
    },
    actions: {
      async increment ({ commit, dispatch }) {
        commit('increment')
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
        commit('setUserPreferences', defaultUserPreferences())
        const rpcProxy = await rpc.fetch()
        await rpcProxy.sendData('userPreferences', state)
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
      async loadModpacks ({ commit }) {
        const rpcProxy = await rpc.fetch()
        const modpacks = await rpcProxy.findModpacks()
        commit('modpacks', modpacks)
        const allModpackData = combineModpacks(modpacks)
        commit('gamedata', allModpackData)
      },
      async hideDeveloperTools ({ commit, state }) {
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
