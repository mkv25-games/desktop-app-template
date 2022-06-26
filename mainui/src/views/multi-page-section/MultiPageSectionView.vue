<template>
  <div class="multi-page-section-view">
    <MultiPageSectionNav />
    <div class="frame">
      <slot>
        <column-layout class="fixed-width-right overflow-hidden">
          <template v-slot:left>
            <pan-and-zoom class="darkmode">
              <p>Pan and zoom content</p>
            </pan-and-zoom>
          </template>
          <template v-slot:right>
            <h2>{{ contact.name }}</h2>
            <icon icon="star" />
          </template>
        </column-layout>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      highlightedQuadrant: {
        regions: []
      }
    }
  },
  computed: {
    contact () {
      return this.$store.state.contact
    },
    lastUpdated () {
      const date = new Date(this.contact.lastUpdated)
      return date.toISOString().slice(0, 19).replace('T', ' ')
    }
  },
  methods: {
    showQuadrantInfo (quadrant) {
      this.highlightedQuadrant = quadrant
    }
  }
}
</script>

<style scoped>
.multi-page-section-view {
  display: flex;
  align-items: stretch;
}
.frame {
  flex: auto;
  overflow: hidden;
}

</style>
