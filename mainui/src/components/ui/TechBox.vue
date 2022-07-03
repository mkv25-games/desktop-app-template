<template>
  <g :transform="`translate(${tech.x} ${tech.y})`">
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
          <Icon :icon="tech.data.icon" />
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
        return { label: 'No label' }
      }
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
.tech > rect {
  fill: rgb(248, 169, 116)
}

.facility > rect {
  fill: rgb(146, 184, 255);
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
