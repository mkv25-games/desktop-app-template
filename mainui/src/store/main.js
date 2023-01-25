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

export default class MainStore {
  constructor () {
    this._state = defaultProgramModel()
  }

  get state () {
    return this._state
  }

  set state (newVal) {
    this._state = clone(newVal)
  }

  setUserPreferences (newVal) {
    const { state } = this
    state.userPreferences = clone(newVal)
  }

  patchUserPreferences (newVal) {
    const { state } = this
    state.userPreferences = clone(Object.assign({}, state.userPreferences, newVal))
  }

  assignSaveFile (newVal) {
    const { state } = this
    console.log('Change save file:', newVal)
    state.saveFile = newVal
  }

  saveFileList (newVal) {
    const { state } = this
    state.saveFileList = clone(newVal)
  }

  setVersion (newVal) {
    const { state } = this
    state.version = clone(newVal)
  }

  modpacks (newVal) {
    const { state } = this
    state.modpacks = clone(newVal)
  }

  get modpackStatus () {
    const { state } = this
    return state?.userPreferences?.modpackStatus
  }

  set modpackStatus (newVal) {
    const { state } = this
    if (state?.userPreferences?.modpackStatus) {
      state.userPreferences.modpackStatus[newVal.package] = newVal.enabled
    }
  }

  knownImagePaths (knownImagePaths) {
    const { state } = this
    state.knownImagePaths = knownImagePaths
  }

  gamedata (newVal) {
    const { state } = this
    state.gamedata = clone(newVal)
  }

  get gameLoaded () {
    const { state } = this
    return Boolean(state?.saveFile?.name)
  }

  async increment () {
    const { state } = this
    this.patchUserPreferences({ count: state.userPreferences.count + 1 })
    this.saveUserPreferences()
  }

  async saveUserPreferences () {
    const { state } = this
    return rpcClient.sendData('userPreferences', clone(state.userPreferences))
  }

  async loadUserPreferences () {
    const preferences = await rpcClient.requestData('userPreferences') || {}
    this.setUserPreferences(preferences.data)
  }

  async resetUserPreferences () {
    const { state } = this
    this.setUserPreferences(newUserPreferences())
    await rpcClient.sendData('userPreferences', clone(state.userPreferences))
  }

  async getVersion () {
    const version = rpcClient.version
    this.setVersion(version)
  }

  async loadGameRecord (payload) {
    const saveFile = await rpcClient.requestData(payload.name)
    this.assignSaveFile(saveFile.data)
  }

  async saveGameRecord (saveFile) {
    const { state } = this
    this.assignSaveFile(saveFile)
    const data = clone(saveFile)
    return rpcClient.sendData(state.saveFile.name, data)
  }

  async clearData (key) {
    return rpcClient.clearData(key)
  }

  async refreshSaveFileList () {
    const files = await rpcClient.findFiles('**/*')
    const saveFileList = files
      .filter(file => file.filepath.includes('/savedata/') || file.filepath.includes('\\savedata\\'))
      .filter(file => !file.filepath.includes('userPreferences.json'))
    this.saveFileList(saveFileList)
  }

  async loadModpacks () {
    const { state } = this
    await modpackClient.refresh()
    const modpacks = modpackClient.modpacks
    this.modpacks(modpacks)
    const modpackStatus = state?.userPreferences?.modpackStatus ?? {}
    const allModpackData = combineModpacks(modpacks, modpackStatus)
    const knownImagePaths = allModpackData.images.reduce((acc, item) => {
      acc[item] = true
      return acc
    }, {})
    // console.log('Known Image Paths:', { knownImagePaths })
    this.knownImagePaths(knownImagePaths)
    this.gamedata(allModpackData)
  }

  async combineModpacks () {
    const { state } = this
    const modpacks = state.modpacks
    const modpackStatus = state?.userPreferences?.modpackStatus
    const allModpackData = combineModpacks(modpacks, modpackStatus)
    this.gamedata(allModpackData)
  }

  async toggleModpackStatus () {
    await this.saveUserPreferences()
    await this.combineModpacks()
  }

  async hideDeveloperTools () {
    const { state } = this
    if (state?.userPreferences?.developerTools) {
      state.userPreferences.developerTools.visible = false
    }
    this.hideDeveloperTools()
    const { developerTools } = state.userPreferences
    return rpcClient.updateDeveloperTools(developerTools.visible)
  }

  async showDeveloperTools () {
    const { state } = this
    if (state?.userPreferences?.developerTools) {
      state.userPreferences.developerTools.visible = true
    }
    const { developerTools } = state.userPreferences
    return rpcClient.updateDeveloperTools(developerTools.visible)
  }

  findImageURL (imagePath) {
    const { state } = this
    const { knownImagePaths } = state
    const imageKnown = knownImagePaths[imagePath]
    return imageKnown ? `http://localhost:${modpackServerPort}/${imagePath}` : ''
  }

  getGamedataIndex (type, property = 'id') {
    const { state } = this
    const { gamedata } = state
    const dataset = gamedata[type] || []
    const index = dataset.reduce((acc, item) => {
      const key = item[property]
      acc[key] = item
      return acc
    }, {})
    return index
  }
}
