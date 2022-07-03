import newModpack from '@/models/modpack.js'

function clone (data) {
  return JSON.parse(JSON.stringify(data))
}

export default function combineModpacks (modpacks, modpackStatus) {
  modpacks.forEach(modpack => {
    const overrideValue = modpackStatus[modpack.packdata.package]
    const overrideValueType = typeof overrideValue
    if (overrideValueType === 'boolean') {
      modpack.userPreferenceEnabled = overrideValue
    }
  })
  const enabledModpacks = modpacks.filter(modpack => {
    return typeof modpack.userPreferenceEnabled === 'boolean' ? modpack.userPreferenceEnabled : modpack.packdata.enabled
  })
  const combined = enabledModpacks.reduce((acc, item) => {
    const modpack = clone(item)
    Object.keys(modpack.packdata).forEach(key => {
      const packdata = modpack.packdata || {}
      const items = packdata[key] || []
      const target = acc[key] || []
      if (Array.isArray(items) && items.length > 0) {
        target.push(...items)
      } else {
        target.push(items)
      }
      acc[key] = target
    })
    return acc
  }, newModpack())
  return combined
}
