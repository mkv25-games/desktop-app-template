export function generateSeedFrom (string) {
  const chars = string.split('')

  const floatingSeed = chars.reduce((acc, item) => {
    return acc + item.charCodeAt(0) * chars.length
  }, 0)

  return Number.parseInt(floatingSeed.toPrecision(10).replace('.', ''))
}
