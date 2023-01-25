import { find, read, position } from 'promise-path'
import mkvconf from 'mkvconf'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const modpacksForServer = []
const imagePathsForServer = {}

async function searchDirectory (directory) {
  const location = position(directory)
  const query = location('./**/modpack.json')
  const modpackPaths = await find(query)
  const modpacks = await Promise.all(modpackPaths.map(loadModpack))
  return modpacks
}

function copyItemsIntoTarget (source, target) {
  Object.keys(source).forEach(key => {
    const sourceItems = source[key]
    const targetItems = target[key] || []
    sourceItems.forEach(item => {
      targetItems.push(item)
    })
    target[key] = targetItems
  })
}

async function loadModpackFile ({ filename, packdata }) {
  let error
  try {
    const filebody = await read(filename, 'utf8')
    const filedata = mkvconf.parse(filebody)
    copyItemsIntoTarget(filedata, packdata)
  } catch (ex) {
    error = `Unable to read ${filename}: ${ex.message}`
  }
  return error
}

async function loadModpack (filepath) {
  let packdata = {}
  let packError; let fileErrors = []
  try {
    const body = await read(filepath, 'utf8')
    packdata = JSON.parse(body)

    const packpath = position(filepath.replace('modpack.json', ''))
    const confFiles = await find(packpath('./**/*.conf'))
    const imageFiles = await find(packpath('./**/*.png'))
    const loadingWork = confFiles.map(filename => loadModpackFile({ packpath, filename, packdata }))

    const relativeImagePaths = imageFiles.map(fullPath => {
      const packpathDir = packpath('./').split('\\').join('/')
      const relativePath = fullPath.replace(packpathDir, '')
      imagePathsForServer[`/${relativePath}`] = fullPath
      return {
        fullPath,
        relativePath
      }
    })
    packdata.images = relativeImagePaths.map(entry => entry.relativePath)

    fileErrors = await Promise.all(loadingWork)
  } catch (ex) {
    packError = ex.message
  }

  modpacksForServer.push({
    filepath,
    packdata,
    messages: [packError, ...fileErrors].filter(n => n)
  })

  return {
    filepath,
    packdata,
    messages: [packError, ...fileErrors].filter(n => n)
  }
}

let modpackServer
function createServer (serverPort) {
  if (modpackServer) {
    return
  }

  modpackServer = express()
  modpackServer.use(cors())
  modpackServer.use(bodyParser.json())

  modpackServer.get('/', (req, res) => {
    res.json({
      serverInfo: 'This is the modpack server; game assets are loaded from here to be made available for the main process.',
      date: new Date(),
      modpacks: modpacksForServer,
      imagePaths: Object.keys(imagePathsForServer)
    })
  })

  modpackServer.get('*', function (req, res) {
    const imageRecord = imagePathsForServer[req.originalUrl]
    if (imageRecord) {
      res.sendFile(imageRecord)
    } else {
      res.json({
        originalUrl: req.originalUrl,
        message: 'File not found',
        status: 404
      }).status(404)
    }
  })

  modpackServer.listen(serverPort, () => {
    console.log(`Modpack Server Running on: http://localhost:${serverPort}`)
  })
}

async function modpackLoader (directories, serverPort) {
  const modpacks = (await Promise.all(directories.map(searchDirectory))).reduce((acc, results) => {
    acc.push(...results)
    return acc
  }, [])

  createServer(serverPort)

  return modpacks
}

export default modpackLoader
