
import { fas } from '@fortawesome/free-solid-svg-icons'

let remapped

function icons () {
  if (remapped) {
    return remapped
  }

  // console.time('Remap icons')

  const all = Object.keys(fas)
  remapped = all.map(key => {
    return key
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLocaleLowerCase()
      .replace('fa-', '')
      .replace('xray', 'x-ray')
      .replace('hsquare', 'h-square')
      .replace('icursor', 'i-cursor')
      .replace(/([a-z]+)(\d+)/, '$1-$2')
      .replace(/arrow-(down|up)(.)(.)$/, 'arrow-$1-$2-$3')
      .replace(/arrow-(down|up)-(.)(.)$/, 'arrow-$1-$2-$3')
      .replace('list-12', 'list-1-2')
      .replace(/dice-d-(\d+)/, 'dice-d$1')
      .replace('money-bill-1wave', 'money-bill-1-wave')
  }).filter(a => a !== 'font-awesome-logo-full')

  // console.timeEnd('Remap icons') // 6.22 ms

  return remapped
}

export default icons
