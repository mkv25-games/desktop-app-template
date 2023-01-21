import { Hex, Layout, Point } from './hex.js'
const zero = new Hex(0, 0, 0)

export function calculateHexagonRing (center, radius) {
  const hexes = []
  let hex = center.add(zero.neighbor(4).scale(radius))
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      hexes.push(hex)
      hex = hex.neighbor(i)
    }
  }

  return hexes
}

export function mapHexesToSet (list) {
  return list.reduce((acc, hex) => {
    acc[hex.id()] = hex
    return acc
  }, {})
}

export function intersectHexes (setA, setB) {
  const bMap = mapHexesToSet(setB)
  return setA.filter(a => bMap[a.id()])
}

export function calculateHexagonSpiral (center, radius) {
  const rings = [center]
  for (let k = 1; k < radius; k++) {
    const ring = calculateHexagonRing(center, k)
    rings.push(ring)
  }
  const hexes = rings.flat(1)
  return hexes
}

export function createScreenLayout (tileSize, offset) {
  offset = offset || new Point(0, 0)
  const size = new Point(tileSize / 2, tileSize / 2)
  const screenLayout = new Layout(Layout.pointy, size, offset)
  return screenLayout
}

export function calculateBoundingBox (locations) {
  const boundary = {
    top: Math.min(...locations.map(loc => loc.y)),
    left: Math.min(...locations.map(loc => loc.x)),
    right: Math.max(...locations.map(loc => loc.x)),
    bottom: Math.max(...locations.map(loc => loc.y))
  }
  return boundary
}
