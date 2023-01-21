function createDefault () {
  const now = new Date()
  const lastUpdated = now.toISOString()
  const world = {
    id: 'no-world',
    name: 'No World',
    size: 3
  }
  return {
    lastUpdated,
    name: 'The Unknown World',
    world
  }
}

function create (source) {
  return Object.assign(createDefault(), source || {})
}

export default create
