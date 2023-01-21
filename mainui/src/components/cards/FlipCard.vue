<template>
  <div :class="flipCardState" v-on:click.right="flipped = !flipped">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <Icon icon="heart-broken" style="font-size: 10em;" />
      </div>
      <div class="flip-card-back">
        <h1>John Doe</h1>
        <p>Architect & Engineer</p>
        <p>We love that guy</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    flipped: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flipped: false
    }
  },
  computed: {
    flipCardState() {
      const { flipped } = this
      const flippedClass = flipped ? 'flipped' : 'unflipped'
      return ['flip-card', flippedClass].join(' ')
    }
  }
}
</script>

<style scoped>

.flip-card {
  background-color: transparent;
  width: 59mm;
  height: 92mm;
  border: 1px solid #f1f1f1;
  perspective: 100vh;
  transform: scale(0.90);
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 3mm;
}

.flip-card-front {
  background-color: #bbb;
  color: black;
}

.flip-card-front:hover {
  color: rgb(201, 28, 28);
}

.flip-card-back {
  background-color: dodgerblue;
  color: white;
  transform: rotateY(180deg);
}
</style>