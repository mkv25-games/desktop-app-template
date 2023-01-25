<template>
  <div v-if="selectedTech">
    <pre><code>{{ selectedTech }} </code></pre>
  </div>
  <p class="buttons">
    <button @click="clearSelection">Show Full Tree</button>
    <button @click="displayHorizontal">Display Horizontal</button>
    <button @click="displayVertical">Display Vertical</button>
    <button @click="changeNodeSpacing(50)">Compact Spacing</button>
    <button @click="changeNodeSpacing(100)">Wide Spacing</button>
    <button @click="zoomLevel = 'zoomIn'">Zoom In</button>
    <button @click="zoomLevel = ''">Reset Zoom</button>
    <button @click="zoomLevel = 'zoomOut'">Zoom Out</button>
  </p>
  <div v-if="errors && errors.length > 0">
    <p class="warning">Errors with ELKJS: <span>{{ errors }}</span></p>
  </div>
  <svg v-else-if="layout"
    :class="zoomLevel"
    :width="layout.width" :height="layout.height">
    <g>
      <tech-edge v-for="edge in layout.edges" :key="edge.id" :edge="edge" />
    </g>
    <g>
      <tech-box v-for="tech in layout.children" :key="tech.id"
        @click="selectTech(tech.data, tech)"
        :class="tech.className || 'tech'"
        :tech="tech" />
    </g>
  </svg>
  <svg v-else width="100" height="100">
    <text>ELKJS: No layout provided!</text>
  </svg>
</template>

<script>
import ELK from 'elkjs'
const elk = new ELK()

function makeGraph () {
  return {
    id: 'technology-root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'spacing.nodeNodeBetweenLayers': 50,
      'spacing.nodeNode': 25,
      'elk.direction': 'DOWN'
    },
    children: [
      { id: 'n1', width: 120, height: 60, label: 'Chemistry' },
      { id: 'n2', width: 120, height: 60, label: 'Biology' },
      { id: 'n3', width: 120, height: 60, label: 'Physics' }
    ],
    edges: [
      { id: 'e1', sources: ['n1'], targets: ['n2'] },
      { id: 'e2', sources: ['n1'], targets: ['n3'] }
    ]
  }
}

const graph = makeGraph()

function removeEmptyEdges (edge) {
  const hasTargets = edge.targets && edge.targets.length > 0
  const hasSources = edge.sources && edge.sources.length > 0
  return hasTargets && hasSources
}

export default {
  data () {
    return {
      graph,
      layout: {
        children: [],
        edges: []
      },
      errors: [],
      selectedTech: null,
      direction: 'DOWN',
      nodeSpacing: 50,
      zoomLevel: ''
    }
  },
  computed: {
    technologies () {
      const { $store } = this
      const techByName = $store.getGamedataIndex('Technology', 'name')
      return Object.values(techByName) || []
    },
    filteredTechnologies () {
      const { technologies, selectedTech } = this
      if (selectedTech) {
        return technologies.filter(tech => tech.name === selectedTech.name || selectedTech?.tech?.requires.includes(tech.name) || selectedTech?.tech?.supports?.includes(tech.name))
      }
      return technologies
    },
    facilities () {
      const { $store } = this
      const facilitiesByName = $store.getGamedataIndex('Facility', 'name')
      return Object.values(facilitiesByName) || []
    },
    filteredFacilities () {
      const { facilities, selectedTech } = this
      if (selectedTech) {
        return facilities.filter(fac => fac.name === selectedTech.name || fac?.tech.requires?.includes(selectedTech.name) || fac?.tech.supports?.includes(selectedTech.name))
      }
      return facilities
    }
  },
  async mounted () {
    const { $store, facilities, technologies } = this
    const techByName = $store.indexByProp(technologies, 'name')
    this.selectedTech = techByName.Speech ?? facilities[0] ?? technologies[0]
    await this.redraw()
  },
  methods: {
    async updateGraph () {
      const { $store, graph, filteredTechnologies, filteredFacilities, direction, nodeSpacing } = this
      graph.layoutOptions['elk.direction'] = direction
      graph.layoutOptions['spacing.nodeNode'] = Math.round(nodeSpacing * 0.5)
      graph.layoutOptions['spacing.nodeNodeBetweenLayers'] = nodeSpacing
      const techChildren = filteredTechnologies.map(tech => {
        return {
          id: `t_${tech.name}`,
          width: 120,
          height: 90,
          label: tech.name,
          className: 'tech',
          data: tech
        }
      })
      const facilityChildren = filteredFacilities.map(facility => {
        return {
          id: `f_${facility.name}`,
          width: 160,
          height: 120,
          label: facility.name,
          className: 'facility',
          data: facility
        }
      })
      graph.children = [...techChildren, ...facilityChildren]
      console.log('Children:', graph.children)

      const techMapByName = $store.indexByProp(filteredTechnologies, 'name')

      const facilityEdges = []
      filteredFacilities.forEach((facility, i) => {
        const requires = (facility.tech.requires || '').split(', ').filter(n => n).filter(item => techMapByName[item])
        const supports = (facility.tech.supports || '').split(', ').filter(n => n).filter(item => techMapByName[item])
        requires.forEach((item, n) => {
          facilityEdges.push({
            id: `fse_${i}_${n}`,
            sources: [`t_${item}`],
            targets: [`f_${facility.name}`],
            facility
          })
        })
        supports.forEach((item, n) => {
          facilityEdges.push({
            id: `fte_${i}_${n}`,
            sources: [`f_${facility.name}`],
            targets: [`t_${item}`],
            facility
          })
        })
      })
      graph.edges = [...facilityEdges].filter(removeEmptyEdges)
      // console.log('Technology Diagram Edges:', graph.edges)

      this.graph = graph
    },
    async computeLayout () {
      let result = {}
      try {
        result = await elk.layout(this.graph)
        // console.log('Technology Diagram, ELKJS Result:', result)
      } catch (ex) {
        console.error('Technology Diagram, ELKJS Error:', ex)
        this.errors.push('Technology Diagram, ELKJS Error:')
        this.errors.push(ex)
      }
      return result
    },
    async redraw () {
      await this.updateGraph()
      const layout = await this.computeLayout()
      console.log('Technology Diagram Mounted:', layout)
      this.layout = layout
    },
    selectTech (tech, techBox) {
      this.selectedTech = tech
      this.redraw()
    },
    clearSelection () {
      this.selectedTech = null
      this.redraw()
    },
    displayHorizontal () {
      this.direction = 'RIGHT'
      this.redraw()
    },
    displayVertical () {
      this.direction = 'DOWN'
      this.redraw()
    },
    changeNodeSpacing(val) {
      this.nodeSpacing = val
      this.redraw()
    }
  }
}
</script>

<style scoped>
svg {
  zoom: 1.0;
}

svg.zoomOut {
  zoom: 0.75;
}

svg.zoomIn {
  zoom: 1.2;
}
</style>
