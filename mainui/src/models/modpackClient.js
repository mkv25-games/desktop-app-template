import axios from 'axios'

const defaultDate = new Date()

export default class ModpackClient {
  constructor(server) {
    this.server = server
    this.client = axios.create({ baseURL: server.baseUrl })
  }

  async init() {
    this.refresh()
  }

  async refresh() {
    const response = await this.client.get('/')
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

  get modpacks() {
    const { index } = this
    return index?.modpacks ?? []
  }
}