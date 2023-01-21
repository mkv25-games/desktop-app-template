<template>
    <div class="card" :style="{ outlineColor: baseColor }">
      <div class="border column">
        <label class="card-title">{{ card.name || card.error || card.id }}</label>
        <div class="feature-image" :style="featureImageStyle"></div>
        <div class="card-description">
          <label v-if="effects.defense">Defense: {{ effects.defense }}</label>
          <label v-if="effects.attack">Attack: {{ effects.attack }}</label>
          <label v-if="effects.guard">Guard: {{ effects.guard }}</label>
          <label v-if="effects.parry">Parry: {{ effects.parry }}</label>
          <label v-if="effects.next">Next Turn: {{ effects.next }}</label>
        </div>
        <div class="baseIcon" :style="{ background: baseColor }">
          <icon :icon="baseIcon || 'seedling'" />
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    cardId: {
      type: String,
      default: ''
    },
    baseColor: {
      type: String,
      default: '#000'
    },
    baseIcon: {
      type: String,
      default: 'seedling'
    }
  },
  computed: {
    card () {
      return this.findCard(this.cardId)
    },
    cards () {
      return this.$store.getGamedataIndex('Card')
    },
    effects () {
      return this.card.effects || {}
    },
    featureImage () {
      const { $store, card } = this
      return $store.findImageURL(card.image)
    },
    featureImageStyle () {
      const { baseColor, featureImage } = this
      return { backgroundColor: baseColor, backgroundImage: `url(${featureImage})` }
    }
  },
  methods: {
    findCard (id) {
      return this.cards[id] || { id, error: `No card found for ${id};` }
    }
  }
}
</script>

<style scoped>

.card {
  display: inline-flex;
  position: relative;
  justify-content: stretch;
  background: #555;
  margin: 1em;
  outline-width: 1.5mm;
  outline-style: solid;
  border-radius: 3mm;
  width: 59mm;
  height: 92mm;
  font-size: 0.8em;
  transition: transform ease-out 0.2s;
  transform: scale(0.90);
}

.card:hover {
  transform: scale(1.0);
  z-index: 500;
}

.border {
  display: flex;
  background: black;
  color: white;
  border-radius: 2mm;
  padding: 1mm;
}

.column {
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}

.card-title {
  display: flex;
  position: absolute;
  top: 1mm;
  height: 2em;
  width: 100%;
  font-weight: bold;
  background: rgba(0,0,0,0.8);
  justify-content: center;
  align-items: center;
  border-radius: 2mm 2mm 0 0;
  z-index: 200;
}

.feature-image {
  width: 57mm;
  height: 52mm;
  border-radius: 2mm;
  overflow: hidden;
  font-size: 0;
  background-size: cover;
  border-bottom: 1mm solid rgb(83, 76, 55);
  z-index: 100;
}

.card-description::before {
  display: block;
  content: '';
  width: 57mm;
  height: 2mm;
  margin-top: -1mm;
  background: black;
  border-radius: 0 0 2mm 2mm;
}

.card-description {
  display: flex;
  position: absolute;
  bottom: 1mm;
  height: 37mm;
  width: 55mm;
  font-weight: bold;
  background: rgba(166, 157, 131, 0.8);
  color: black;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 0 0 2mm 2mm;
  border-left: 1mm solid rgb(170, 165, 139);
  border-right: 1mm solid rgb(83, 76, 55);
  z-index: 50;
}

.card-description > label {
  margin-top: 0.5em;
}

.baseIcon {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.2em 0 0 0.2em;
  font-size: 2em;
  border-radius: 1.0em 0 0 0;
  z-index: 400;
}
</style>
