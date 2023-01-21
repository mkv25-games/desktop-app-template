import path from 'path'
import url from 'url'
import { app, BrowserWindow } from 'electron'
import fs from 'fs'
import createRPCServer from './src/rpcServer'
import modpackLoader from './src/modpackLoader'
import { position } from 'promise-path'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const packageJson = JSON.parse(fs.readFileSync('package.json'))
const { title, version } = packageJson

const applicationRoot = position(__dirname, './')

const iconUrl = url.format({
  pathname: path.join(__dirname, 'icons/icon.icns'),
  protocol: 'file:',
  slashes: true
})

function getUserPath () {
  return app.getPath('userData')
}

async function findModpacks (serverPort) {
  const userDataPath = position(getUserPath())
  const defaultModpacks = applicationRoot('modpacks')
  const userModpacks = userDataPath('modpacks')
  const directoryPaths = [defaultModpacks, userModpacks]
  return modpackLoader(directoryPaths, serverPort)
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'src/preload.js'),
      sandbox: false
    },
    icon: iconUrl,
    allowRunningInsecureContent: true
  })

  const mode = selectApplicationMode(process)
  console.log('App Mode:', mode.name)
  mode.fn(mainWindow)

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle(title)
    if (process.env.FORCE_OPEN_DEV_TOOLS) {
      mainWindow.webContents.openDevTools()
    }
  })

  return mainWindow
}

function selectApplicationMode ({ env }) {
  const config = env.APP_MODE || false
  const modes = {
    default: {
      name: `Build: ${version}`,
      fn: loadFromLocalFileSystem
    },
    'local-dist': {
      name: `Local Distribution Build (${version})`,
      fn: loadFromLocalFileSystem
    },
    'local-dev': {
      name: `Local Development Build (${version})`,
      fn: loadFromLocalServer
    }
  }
  return modes[config] || modes.default
}

function loadFromLocalServer (mainWindow) {
  const winUrl = 'http://localhost:8080/'
  mainWindow.loadURL(winUrl)
}

function loadFromLocalFileSystem (mainWindow) {
  const winFilepath = path.join(__dirname, 'mainui/dist/index.html')
  mainWindow.loadFile(winFilepath)
}

const mainApp = {}
app.whenReady().then(async () => {
  mainApp.mainWindow = createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainApp.mainWindow = createWindow()
    }
  })

  const userPath = getUserPath()
  const appPath = applicationRoot('./')
  createRPCServer({ app, mainApp, version, serverPort: 25010, appPath, userPath })
  findModpacks(25015)
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
