<template>
  <div v-if="errors && errors.length > 0">
    <p class="warning">Errors with ELKJS: <span>{{ errors }}</span></p>
  </div>
  <svg v-else-if="layout"
    :width="layout.width" :height="layout.height">
    <g>
      <tech-edge v-for="edge in layout.edges" :key="edge.id" :edge="edge" />
    </g>
    <g>
      <tech-box v-for="tech in layout.children" :key="tech.id"
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

const graph = {
  id: 'technology-root',
  layoutOptions: {
    'elk.algorithm': 'layered',
    'spacing.nodeNodeBetweenLayers': 50,
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

function removeEmptyEdges (edge) {
  const hasTargets = edge.targets && edge.targets.length > 0
  const hasSources = edge.sources && edge.sources.length > 0
  return hasTargets && hasSources
}

export default {
  data () {
    return {
      layout: {
        children: [],
        edges: []
      },
      errors: []
    }
  },
  computed: {
    technologies () {
      return this.$store.state.gamedata.Technology || []
    },
    facilities () {
      return this.$store.state.gamedata.Facility || []
    }
  },
  async mounted () {
    await this.updateGraph()
    const layout = await this.computeLayout()
    console.log('Technology Diagram Mounted:', layout)
    this.layout = layout
  },
  methods: {
    async updateGraph () {
      const { technologies, facilities } = this
      const techChildren = technologies.map(tech => {
        return {
          id: `t_${tech.name}`,
          width: 120,
          height: 90,
          label: tech.name,
          className: 'tech',
          data: tech
        }
      })
      const facilityChildren = facilities.map(facility => {
        return {
          id: `f_${facility.name}`,
          width: 120,
          height: 90,
          label: facility.name,
          className: 'facility',
          data: facility
        }
      })
      graph.children = [...techChildren, ...facilityChildren]
      console.log('Children:', graph.children)

      const facilityEdges = []
      facilities.forEach((facility, i) => {
        const requires = (facility.tech.requires || '').split(', ').filter(n => n)
        const supports = (facility.tech.supports || '').split(', ').filter(n => n)
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
      console.log('Technology Diagram Edges:', graph.edges)
    },
    async computeLayout () {
      let result = {}
      try {
        result = await elk.layout(graph)
        console.log('Technology Diagram, ELKJS Result:', result)
      } catch (ex) {
        console.error('Technology Diagram, ELKJS Error:', ex)
        this.errors.push('Technology Diagram, ELKJS Error:')
        this.errors.push(ex)
      }
      return result
    }
  }
}
</script>

<style scoped>
svg {
  zoom: 0.8;
}
</style>
