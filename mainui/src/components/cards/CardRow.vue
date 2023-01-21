<template>
  <div class="card-row">
    <character-card v-for="(cardId, idx) in cards" :key="`c_${cardId}_${idx}`"
      :cardId="cardId"
      :baseIcon="baseIcon"
      :baseColor="baseColor" />
  </div>
</template>

<script>
export default {
  props: {
    cards: {
      type: Array,
      default: () => []
    },
    baseIcon: {
      type: String,
      default: 'seedling'
    },
    baseColor: {
      type: String,
      default: '#111'
    }
  }
}
</script>

<style scoped>

.card-row {
  overflow-x: auto;
}
.card-row > .card {
  display: inline-flex;
}
</style>
