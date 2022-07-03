function createDefault () {
  return {
    count: 0,
    developerTools: {
      visible: false
    },
    modpackStatus: {}
  }
}

function create (source) {
  return Object.assign(createDefault(), source || {})
}

export default create
