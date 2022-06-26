function createDefault () {
  const now = new Date()
  const lastUpdated = now.toISOString()
  return {
    lastUpdated,
    name: 'The Unknown World'
  }
}

function create (source) {
  return Object.assign(createDefault(), source || {})
}

export default create
