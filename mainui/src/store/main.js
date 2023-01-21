import { createStore } from 'vuex'
import newSaveFile from '@/models/saveFile.js'
import newUserPreferences from '@/models/userPreferences.js'
import combineModpacks from '@/models/combineModpacks.js'

import RpcClient from '../models/rpcClient.js'
import ModpackClient from '../models/modpackClient'

const rpcServerPort = 25010
const rpcClient = new RpcClient({ baseUrl: `http://localhost:${rpcServerPort}` })
rpcClient.init()

const modpackServerPort = 25015
const modpackClient = new ModpackClient({ baseUrl: `http://localhost:${modpackServerPort}/` })
modpackClient.init()

function defaultProgramModel () {
  return {
    userPreferences: newUserPreferences(),
    saveFile: newSaveFile(),
    saveFileList: [],
    modpacks: [],
    gamedata: {},
    knownImagePaths: {}
  }
}

function clone (data) {
  if (!data) {
    return data
  }
  return JSON.parse(JSON.stringify(data))
}

function setup () {
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
        if (state?.userPreferences?.modpackStatus) {
          state.userPreferences.modpackStatus[modpackStatus.package] = modpackStatus.enabled
        }
      },
      knownImagePaths (state, knownImagePaths) {
        state.knownImagePaths = knownImagePaths
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
        return rpcClient.sendData('userPreferences', clone(state.userPreferences))
      },
      async loadUserPreferences ({ commit }) {
        const preferences = await rpcClient.requestData('userPreferences') || {}
        commit('setUserPreferences', preferences.data)
      },
      async resetUserPreferences ({ commit, state }) {
        commit('setUserPreferences', newUserPreferences())
        await rpcClient.sendData('userPreferences', clone(state.userPreferences))
      },
      async getVersion ({ commit }) {
        const version = rpcClient.version
        commit('setVersion', version)
      },
      async loadGameRecord ({ commit }, payload) {
        const saveFile = await rpcClient.requestData(payload.name)
        console.log('store/main.js SaveFile:', saveFile, 'Payload:', payload)
        commit('assignSaveFile', saveFile.data)
      },
      async saveGameRecord ({ commit, state }, saveFile) {
        commit('assignSaveFile', saveFile)
        const data = clone(saveFile)
        return rpcClient.sendData(state.saveFile.name, data)
      },
      async clearData ({}, key) {
        return rpcClient.clearData(key)
      },
      async refreshSaveFileList ({ commit }) {
        const files = await rpcClient.findFiles('**/*')
        const saveFileList = files
          .filter(file => file.filepath.includes('/savedata/') || file.filepath.includes('\\savedata\\'))
          .filter(file => !file.filepath.includes('userPreferences.json'))
        commit('saveFileList', saveFileList)
      },
      async loadModpacks ({ state, commit }) {
        await modpackClient.refresh()
        const modpacks = modpackClient.modpacks
        commit('modpacks', modpacks)
        const modpackStatus = state?.userPreferences?.modpackStatus ?? {}
        const allModpackData = combineModpacks(modpacks, modpackStatus)
        const knownImagePaths = allModpackData.images.reduce((acc, item) => {
          acc[item] = true
          return acc
        }, {})
        console.log('Known Image Paths:', { knownImagePaths })
        commit('knownImagePaths', knownImagePaths)
        commit('gamedata', allModpackData)
      },
      async combineModpacks ({ state, commit }) {
        const modpacks = state.modpacks
        const modpackStatus = state?.userPreferences?.modpackStatus
        const allModpackData = combineModpacks(modpacks, modpackStatus)
        commit('gamedata', allModpackData)
      },
      async toggleModpackStatus ({ dispatch }) {
        await dispatch('saveUserPreferences')
        await dispatch('combineModpacks')
      },
      async hideDeveloperTools ({ commit, state }) {
        commit('hideDeveloperTools')
        const { developerTools } = state.userPreferences
        return rpcClient.updateDeveloperTools(developerTools.visible)
      },
      async showDeveloperTools ({ commit, state }) {
        commit('showDeveloperTools')
        const { developerTools } = state.userPreferences
        return rpcClient.updateDeveloperTools(developerTools.visible)
      }
    },
    modules: {}
  })

  main.findImageURL = (imagePath) => {
    const { knownImagePaths } = main.state
    const imageKnown = knownImagePaths[imagePath]
    return imageKnown ? `http://localhost:${modpackServerPort}/${imagePath}` : ''
  }

  main.getGamedataIndex = (type, property = 'id') => {
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
