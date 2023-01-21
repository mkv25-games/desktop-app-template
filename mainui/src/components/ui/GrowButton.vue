<template>
  <div :class="className">
    <slot>Click me!</slot>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    className () {
      const l = ['grow-button']
      l.push(this.disabled ? 'disabled' : 'enabled')
      return l.join(' ')
    }
  }
}
</script>

<style>
.grow-button {
  margin: 2px 0;
}
.grow-button a {
  display: inline-block;
  font-weight: 700;
  text-decoration: none;
  border-radius: 10px;
  transition: background 250ms, border 1s, padding 200ms ease-in-out;
  user-select: none;
  padding: 10px 40px;
  width: 60%;
}
.grow-button.enabled a {
  color: gold;
  background: rgba(140, 5, 5, 0.7);
  border-left: 4px solid gold;
  border-right: 4px solid gold;
}
.grow-button.enabled:hover a {
  color: lightskyblue;
  background: rgba(0, 0, 0, 0.7);
  border-left: 4px solid lightpink;
  border-right: 4px solid lightpink;
  padding: 10px 10px;
}
.grow-button:active a {
  color: white;
  border-color: white;
  background: rgba(0, 0, 0, 0.9);
  padding: 10px;
}

.grow-button.disabled a {
  cursor: default;
  color: #bbb;
  border-left: 4px solid plum;
  border-right: 4px solid plum;
  background: rgba(60, 60, 60, 0.7);
}

</style>
