function listSaveFiles (saveFileList) {
  const saveFiles = saveFileList.map(file => {
    file.name = file.filepath
      .replace('/savedata/', '')
      .replace('\\savedata\\', '')
      .replace('.json', '')
    return file
  }).sort((a, b) => {
    const mtimea = Date.parse(a.fileinfo.mtime)
    const mtimeb = Date.parse(b.fileinfo.mtime)
    return mtimeb - mtimea
  })

  return saveFiles
}

export default listSaveFiles
