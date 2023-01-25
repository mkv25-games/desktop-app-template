<template>
  <svg v-if="layout" :viewBox="viewBox">
    <g :transform="viewCenter">
      <world-map-location v-for="location in layout.locations" :key="[location.id, location.data.id].join(':')"
        :show-icon="showIcons"
        :show-label="showLabels"
        :show-image="showImages"
        :class="location.className || 'location'"
        v-on:mousedown="selectLocation(location)"
        v-on:mouseover="highlightLocation(location)"
        :location="location" />
    </g>
  </svg>
</template>

<script>
import { createWorldLocations, computeFogOfWar } from '@/utils/world.js'
import { createScreenLayout, calculateBoundingBox } from '@/utils/hexLayout.js'

const tileSize = 120
const screenLayout = createScreenLayout(tileSize)

export function sortLocationsByZIndex (a, b) {
  const az = Math.round(a.y * 1000)
  const bz = Math.round(b.y * 1000)
  if (az === bz) {
    return 0
  }
  return az > bz ? 1 : -1
}

function mapLocationToScreen (location, screenLayout, tileSize) {
  const { hex } = location
  const { x, y } = screenLayout.hexToPixel(hex)
  const id = ['l', hex.s, hex.r, hex.q].join('_')

  return Object.assign({}, { id, x, y, width: tileSize, height: tileSize }, location)
}

function graduallyShowLocationsInOrder ({ locations, totalAnimationTimeInMs = 2000 }) {
  const delayInMs = Math.round(totalAnimationTimeInMs / locations.length)
  locations.forEach((location, index) => {
    location.animationState = 'hidden'
    setTimeout(() => {
      location.animationState = 'showing'
      setTimeout(() => {
        location.animationState = 'visible'
      }, 500)
    }, delayInMs * index)
  })
}

function showAllLocations ({ locations }) {
  locations.forEach((location) => {
    location.animationState = 'visible'
  })
}

export default {
  data () {
    return {
      layout: null,
      shownForFirstTime: false
    }
  },
  props: {
    world: {
      type: Object,
      default () {}
    },
    center: {
      type: Object,
      default: null
    },
    showFirstTime: {
      type: Boolean,
      default: true
    },
    showIcons: {
      type: Boolean,
      default: false
    },
    showLabels: {
      type: Boolean,
      default: true
    },
    showImages: {
      type: Boolean,
      default: true
    },
    showFogOfWar: {
      type: Boolean,
      default: false
    },
    viewDistance: {
      type: Number,
      default: 3
    },
    borderDistance: {
      type: Number,
      default: 2
    },
    cameraDistance: {
      type: Number,
      default: 5
    }
  },
  computed: {
    locationTypes () {
      return this.$store.state.gamedata.Location || []
    },
    viewBox () {
      const { layout } = this
      return [layout.minx, layout.miny, layout.width, layout.height].join(' ')
    },
    viewCenter () {
      const { layout } = this
      const { displayCenter, spiralCenter } = layout
      console.log({ displayCenter, spiralCenter })
      const x = -(displayCenter.x - spiralCenter.x) + (layout.tileSize / 2)
      const y = -(displayCenter.y - spiralCenter.y) + (layout.tileSize / 2)
      return `translate(${x} ${y})`
    }
  },
  async mounted () {
    await Promise.all([
      this.$store.loadModpacks()
    ])
    this.updateLayout()
  },
  methods: {
    updateLayout () {
      const { world, center, showFirstTime, shownForFirstTime, locationTypes, showFogOfWar, cameraDistance, viewDistance, borderDistance } = this
      const defaultWorldLocations = createWorldLocations({ world, locationTypes })
      const centerHex = center ? center.hex : null
      const { allLocations, visibleLocations, borderLocations, cameraLocations } = computeFogOfWar({
        locations: defaultWorldLocations,
        locationTypes,
        centerHex,
        cameraDistance: showFogOfWar ? cameraDistance : world.size,
        viewDistance: showFogOfWar ? viewDistance : world.size,
        borderDistance
      })
      const layout = this.createDisplayLayout({ allLocations, visibleLocations, borderLocations, cameraLocations, center })
      this.layout = layout
      if (showFirstTime && !shownForFirstTime) {
        this.shownForFirstTime = true
        this.$emit('showingForFirstTime')
        graduallyShowLocationsInOrder({ locations: this.layout.locations })
        this.$emit('shownForFirstTime')
      } else {
        showAllLocations({ locations: this.layout.locations })
      }
    },
    createDisplayLayout ({ allLocations, visibleLocations, borderLocations, cameraLocations, center }) {
      const spiralCenter = visibleLocations[0]
      center = center || spiralCenter
      const displayCenter = mapLocationToScreen(center, screenLayout, tileSize)
      const allLocationsScreen = allLocations.map(location => mapLocationToScreen(location, screenLayout, tileSize))
      const visibleLocationsScreen = visibleLocations.map(location => mapLocationToScreen(location, screenLayout, tileSize))
      const borderLocationsScreen = borderLocations.map(location => mapLocationToScreen(location, screenLayout, tileSize))
      const cameraLocationsScreen = cameraLocations.map(location => mapLocationToScreen(location, screenLayout, tileSize))

      const { top, left, right, bottom } = calculateBoundingBox(cameraLocationsScreen)
      const minx = left
      const miny = top

      this.$emit('startingLocation', spiralCenter)

      return {
        locations: allLocationsScreen,
        borderLocations: borderLocationsScreen,
        visibleLocations: visibleLocationsScreen,
        cameraLocations: cameraLocationsScreen,
        minx,
        miny,
        width: Math.abs(right - left) + (tileSize),
        height: Math.abs(bottom - top) + (tileSize),
        tileSize,
        displayCenter,
        spiralCenter: mapLocationToScreen(spiralCenter, screenLayout, tileSize)
      }
    },
    selectLocation (location) {
      this.$emit('selectLocation', location)
    },
    highlightLocation (location) {
      this.$emit('highlightLocation', location)
    }
  },
  watch: {
    world () {
      this.updateLayout()
    },
    center () {
      this.updateLayout()
    }
  }
}
</script>

<style scoped>
svg {
  zoom: 1.0;
}
</style>
