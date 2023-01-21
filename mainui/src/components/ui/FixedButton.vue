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
      const l = ['fixed-button']
      l.push(this.disabled ? 'disabled' : 'enabled')
      return l.join(' ')
    }
  }
}
</script>

<style>
.fixed-button {
  margin: 2px 0;
}
.fixed-button a {
  display: inline-block;
  font-weight: 700;
  text-decoration: none;
  border-radius: 10px;
  transition: background 250ms, border 1s, padding 200ms ease-in-out;
  user-select: none;
  padding: 10px 40px;
}
.fixed-button.enabled a {
  color: gold;
  border-left: 4px solid gold;
  border-right: 4px solid gold;
  background: rgba(140, 5, 5, 0.7);
}
.fixed-button.enabled:hover a {
  color: lightskyblue;
  border-left: 4px solid lightpink;
  border-right: 4px solid lightpink;
  background: rgba(0, 0, 0, 0.7);
}
.fixed-button:active a {
  color: white;
  border-color: white;
  background: rgba(0, 0, 0, 0.9);
}

.fixed-button.disabled a {
  cursor: default;
  color: #bbb;
  border-left: 4px solid plum;
  border-right: 4px solid plum;
  background: rgba(60, 60, 60, 0.7);
}

</style>
