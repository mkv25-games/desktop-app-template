import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import { position, find, read, write, make, clean } from 'promise-path'
import fs from 'fs/promises'
import path from 'path'

const endpoints = []

let rpcServer
function createServer ({ app, mainApp, version, serverPort, appPath, userPath }) {
  if (rpcServer) {
    return
  }

  rpcServer = express()
  rpcServer.use(cors())
  rpcServer.use(bodyParser.json())

  rpcServer.get('/', (req, res) => {
    res.json({
      serverInfo: 'This is the RPC server for Card Rush; data between the game (webui) and operating system are passed through here.',
      date: new Date(),
      version,
      appPath,
      userPath,
      endpoints
    })
  })

  rpcServer.post('/find-files', async (req, res) => {
    const searchPattern = (req.body && req.body.searchPattern) || '*'
    const userDataPath = position(userPath, 'savedata')
    const fullQueryPath = userDataPath(searchPattern)
    const filepaths = await find(fullQueryPath)

    const work = filepaths.map(f => path.resolve(f)).map(async (filepath) => {
      const localizedFilepath = filepath.replace(userPath, '')
      const { atime, ctime, mtime } = await fs.stat(filepath)
      return {
        fileinfo: { atime, ctime, mtime },
        filepath: localizedFilepath
      }
    })

    const files = await Promise.all(work)

    res.send({
      files
    })
  })

  rpcServer.post('/request-data', async (req, res) => {
    const key = req.body && req.body.key
    const userDataPath = position(userPath, 'savedata')
    await make(userDataPath('./'))
    const timestamp = Date.now()
    try {
      const body = await read(userDataPath(`${key}.json`), 'utf8')
      const data = JSON.parse(body)
      res.send({
        key,
        data,
        timestamp
      })
    } catch (ex) {
      res.send({
        key,
        timestamp,
        error: ex.message
      })
    }
  })

  rpcServer.post('/send-data', async (req, res) => {
    const key = req.body && req.body.key
    const data = req.body && req.body.data
    const userDataPath = position(userPath, 'savedata')
    await make(userDataPath('./'))
    const body = JSON.stringify(data, null, 2)
    try {
      await write(userDataPath(`${key}.json`), body, 'utf8')
      res.send({
        message: `Received ${body.length} characters of data for ${key}.`
      })
    } catch (ex) {
      res.send({
        message: `Received ${body.length} characters of data for ${key}.`,
        error: ex.message
      })
    }
  })

  rpcServer.post('/clear-data', async (req, res) => {
    const key = req.body && req.body.key
    const userDataPath = position(userPath, 'savedata')
    try {
      await clean(userDataPath(`${key}.json`))
      res.send({
        message: `Cleared data for ${key}.`
      })
    } catch (ex) {
      res.send({
        message: `Unable to clear data for ${key}.`,
        error: ex.message
      })
    }
  })

  rpcServer.post('/update-developer-tools', async (req, res) => {
    const openDevTools = req.body && req.body.visible
    const mainWindow = mainApp.mainWindow
    const webContents = mainWindow.webContents

    res.send({
      message: 'toggle dev tools',
      body: req.body || '',
      data: req.data || {},
      openDevTools
    })

    if (webContents.isDevToolsOpened() !== openDevTools) {
      webContents.toggleDevTools()
    }
  })

  rpcServer.listen(serverPort, () => {
    console.log(`RPC Server Running on: http://localhost:${serverPort}`)
  })
}

export default createServer
