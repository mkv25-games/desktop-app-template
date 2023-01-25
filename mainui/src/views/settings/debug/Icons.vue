<template>
  <settings class="icon-list">
    <div class="grid-icons">
      <h1>Available Icons</h1>
      <input v-model="iconFilter" placeholder="Type to filter icons..." class="icon-filter" />
      <Tabulation :items="iconTiles" />
    </div>
  </settings>
</template>

<script>
import icons from '@/models/icons'
import Tabulation from '../../../components/ui/Tabulation.vue'

export default {
  data () {
    return {
      iconFilter: ''
    }
  },
  computed: {
    iconTiles () {
      const { iconFilter } = this
      return icons().map((icon) => {
        return {
          id: icon,
          icon: icon
        }
      }).filter(item => item.icon.includes(iconFilter) || iconFilter.includes(item.icon)).slice(0, 25)
    }
  },
  components: { Tabulation }
}
</script>

<style scoped>
.grid-icons {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
}

.icon-filter {
  padding: 0.5em 1.0em;
  border: 2px solid #ccc;
}
</style>
