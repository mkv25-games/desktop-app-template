<template>
  <g :transform="`translate(${tech.x ?? 0} ${tech.y ?? 0})`">
    <rect
      :width="tech.width" :height="tech.height"
      stroke="black"
      stroke-width="2"
      fill="gray" />
    <text
      fill="black" stroke="none"
      font-family="Avenir, Helvetica, Arial, sans-serif"
      :y="5"
      font-size="15"
      text-anchor="middle">
    </text>
    <foreignObject class="node" x="0" y="0" :width="tech.width" :height="tech.height">
      <body xmlns="http://www.w3.org/1999/xhtml" class="techbox html">
        <div>
          <Icon :icon="findIcon(tech)" />
          <div v-for="(line, index) in labelLines" :key="`la_${index}`">{{ line }}</div>
        </div>
      </body>
    </foreignObject>
  </g>
</template>

<script>
export default {
  props: {
    tech: {
      type: Object,
      default () {
        return { label: 'No label', x: 0, y: 0, width: 10, height: 10 }
      }
    }
  },
  methods: {
    findIcon (tech) {
      const { data } = tech
      return data ? data.icon || 'seedling' : 'seedling'
    }
  },
  computed: {
    hw () {
      return (this.tech.width || 0) / 2
    },
    hh () {
      return (this.tech.height || 0) / 2
    },
    labelLines () {
      return this.tech.label.split(' ')
    }
  }
}
</script>

<style scoped>

.techbox, .techbox * {
  cursor: pointer;
  transition: background 0.5s ease-in-out;
}
.tech > rect {
  fill: rgb(248, 169, 116)
}
.tech:hover > rect {
  fill: rgb(243, 200, 131)
}

.facility > rect {
  fill: rgb(146, 184, 255);
}
.facility:hover > rect {
  fill: rgb(174, 211, 254);
}
.techbox.html {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.techbox.html > div.icon {
  font-size: 1.5em;
}

</style>
