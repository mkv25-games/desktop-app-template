
import path from 'path'
import { fileURLToPath } from 'url'
import asyncExec from './build-scripts/util/asyncExec.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const NL = '\n'

function reportPad (...messages) {
  const paddedMessage = [NL, '[forge.config.js]: ', ...messages, NL].join('')
  console.log(paddedMessage)
}

const forgeConfig = {
  packagerConfig: {
    icon: 'icons/icon.icns'
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'desktop_app_template'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'darwin'
      ]
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ],
  hooks: {
    generateAssets: async (forgeConfig) => {
      reportPad('We need to generate some assets:')
      const cwd = path.join(__dirname, 'mainui')
      const output = await asyncExec('npm run build', { cwd })
      reportPad('Completed build of mainui:', output.stdout || output.stderr)
    }
  }
}

export default forgeConfig
