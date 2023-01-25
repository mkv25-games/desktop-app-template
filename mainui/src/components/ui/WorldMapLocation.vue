<template>
  <g :class="className">
    <g :transform="`translate(${location.x ?? 0} ${location.y ?? 0})`">
      <pattern v-if="tileImage" :id="`${location.id}_bgi`" patternUnits="userSpaceOnUse"
        :x="hw" :y="hh" :width="width" :height="height">
        <image :href="tileImage" :x="0" :y="0" :width="width" :height="height" />
      </pattern>
      <polygon v-if="showImageCondition"
        :points="polyHexPoints" class="polyhex" :fill="`url(#${location.id}_bgi)`" :stroke="color" />
      <polygon v-else
        :points="polyHexPoints" class="polyhex" :fill="color" :stroke="color" />
      <polygon v-if="fogged"
        :points="polyHexPoints" class="polyhex fogged" />
      <foreignObject class="node" :x="-hw" :y="-hh" :width="width" :height="height">
        <body xmlns="http://www.w3.org/1999/xhtml" class="locationbox html">
          <div>
            <icon v-if="showIconCondition" :icon="findIcon(location)" />
            <div v-for="(line, index) in labelLines" :key="`la_${index}`">{{ line }}</div>
          </div>
        </body>
      </foreignObject>
    </g>
  </g>
</template>

<script>
import { Hex } from '@/utils/hex'
import { createScreenLayout } from '@/utils/hexLayout.js'

const centerHex = new Hex(0, 0, 0)

export default {
  props: {
    location: {
      type: Object,
      default () {
        return { label: 'No label' }
      }
    },
    showImage: {
      type: Boolean,
      default: true
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    findIcon (location) {
      const data = location.data || {}
      return data.icon || location.icon || 'seedling'
    }
  },
  computed: {
    className () {
      const { fogged, outOfBounds } = this
      const { animationState } = this.location
      const oobClass = outOfBounds ? 'out-of-bounds' : 'in-bounds'
      const foggedClass = fogged ? 'fogged' : 'unfogged'
      return ['wml', animationState || 'hidden', oobClass, foggedClass].join(' ')
    },
    width () {
      return this.location.width || 100
    },
    height () {
      return this.location.height || 100
    },
    hexRadius () {
      return this.width * 0.4
    },
    hw () {
      return this.width / 2
    },
    hh () {
      return this.height / 2
    },
    labelLines () {
      const { showLabel, tileImage, fogged, outOfBounds } = this
      const needALabel = !(fogged || outOfBounds) && (showLabel || !tileImage)
      if (!needALabel) {
        return []
      }
      const label = this.location.label || 'No label'
      const { hex } = this.location
      const showHexLabel = false
      if (hex && showHexLabel) {
        return [[hex.q, hex.r, hex.s].join(', ')]
      }
      return label.split(' ')
    },
    color () {
      return this.location.color || 'grey'
    },
    fogged () {
      return this.location.fogged || false
    },
    showIconCondition () {
      const { showIcon, fogged, outOfBounds } = this
      return showIcon || fogged || outOfBounds
    },
    showImageCondition () {
      const { fogged, tileImage, showImage } = this
      return showImage && !fogged && tileImage
    },
    polyHexPoints () {
      const hexLayout = createScreenLayout(this.width * 0.95)
      const points = hexLayout.polygonCorners(centerHex)
      return points.map(p => [p.x, p.y].join(' ')).join(',')
    },
    outOfBounds () {
      return this.location.data.id === 'out-of-bounds'
    },
    tileImage () {
      const { $store, location } = this
      return $store.findImageURL(location.data.image)
    },
    polyHexStyle () {
      const { tileImage } = this
      return {
        backgroundImage: `url(${tileImage})`,
        backgroundPosition: 'center center'
      }
    },
    zIndex () {
      const { location } = this
      return Math.round(location.y * 1000)
    }
  }
}
</script>

<style scoped>
foreignObject {
  pointer-events: none;
}
.wml {
  cursor: default;
  user-select: none;
}
.locationbox.html {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}
.locationbox.html > div.icon {
  font-size: 1.5em;
}
.wml > g > polygon {
  transition: stroke 100ms ease-out;
}
.wml.in-bounds:hover > g > polygon {
  stroke: white;
}
.wml.out-of-bounds {
  opacity: 0.4;
}
.wml.fogged > g > polygon {
  stroke: none;
}
.wml.fogged:hover > g > polygon {
  stroke: none;
}
.visible {
  transform: translateY(0);
  transition: transform 250ms ease-in, color 500ms ease-in;
  color: black;
}
.visible > g > polygon {
  fill-opacity: 1.0;
  stroke-opacity: 1.0;
  transition: fill-opacity 700ms, stroke-opacity 700ms ease-out;
}
.showing {
  transform: translateY(0);
  color: rgba(0,0,0,0);
}
.showing > g > polygon {
  fill-opacity: 0.0;
  stroke-opacity: 0.0;
  transition: fill-opacity 700ms, stroke-opacity 700ms ease-out;
}
.hidden {
  visibility: hidden;
}
.hidden > g > polygon {
  fill-opacity: 0.0;
  stroke-opacity: 0.0;
}
.polyhex {
  stroke-width: 3px;
}
.polyhex.fogged {
  fill-opacity: 0.4;
  stroke-opacity: 0.0;
}
</style>
