import axios from 'axios'

const defaultDate = new Date()

export default class RpcClient {
  constructor(server) {
    this.server = server
    this.client = axios.create({ baseURL: server.baseUrl })
  }

  async init() {
    this.refresh()
  }

  async refresh() {
    const { client } = this
    const response = await client.get('')
    this._index = response.data
  }

  get index() {
    return this._index
  }

  get serverInfo() {
    const { index, server } = this
    return index.serverInfo ?? `Unable to communicate with local RPC server; tried: ${server.baseUrl}`
  }

  get serverDate() {
    const { index } = this
    return new Date(index?.date) ?? defaultDate
  }

  get version() {
    const { index } = this
    return new Date(index?.version) ?? 'NVA'
  }

  get appPath() {
    const { index } = this
    return index?.appPath ?? '/rpc-app-path-unavailable/'
  }

  get userPath() {
    const { index } = this
    return index?.userPath ?? '/rpc-user-path-unavailable/'
  }

  async findFiles(searchPattern) {
    const { client } = this
    const response = await client.post('/find-files', { searchPattern })
    const files = response?.data?.files ?? []
    return files
  }

  async requestData(key) {
    const { client } = this
    const response = await client.post('/request-data', { key })
    return response.data
  }

  async sendData(key, data) {
    const { client } = this
    const response = await client.post('/send-data', { key, data })
    return response.data
  }

  async clearData(key) {
    const { client } = this
    const response = await client.post('/clear-data', { key })
    return response.data
  }

  async updateDeveloperTools(visible) {
    const { client } = this
    const response = await client.post('/update-developer-tools', { visible })
    return response.data
  }
}