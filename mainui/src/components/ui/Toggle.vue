<template>
  <div :class="toggleClass" v-on:click="toggle">
    <span class="toggle-box">
      <Icon :icon="icon" />
    </span>
    <label>
      <span class="hidden-width">{{ on }}</span>
      <span class="hidden-width">{{ off }}</span>
      <span>{{ label }}</span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    on: {
      type: String,
      default: 'Enabled'
    },
    off: {
      type: String,
      default: 'Disabled'
    }
  },
  computed: {
    label () {
      return this.modelValue ? this.on : this.off
    },
    icon () {
      return this.modelValue ? 'check-square' : 'square'
    },
    toggleClass () {
      return this.modelValue ? 'toggle on' : 'toggle off'
    }
  },
  methods: {
    toggle () {
      this.$emit('update:modelValue', !this.modelValue)
    }
  }
}
</script>

<style scoped>
div.toggle {
  display: inline-flex;
  justify-items: center;
  align-items: center;
}
.toggle-box {
  margin: 0.2em;
  font-size: 1.2em;
  background: #ddd;
  border-radius: 0.2em;
}
.toggle.on > .toggle-box {
  color: #42b983;
}
.toggle.on:hover > .toggle-box {
  color: #62c993;
}
.toggle.off > .toggle-box {
  color: black;
}
.toggle.off:hover > .toggle-box {
  color: #42b983;
}
label {
  display: flex;
  flex-direction: column;
  min-width: 50px;
  text-align: left;
  margin: 0.2em;
}
.hidden-width {
  display: inline-block;
  visibility: hidden;
  height: 1px;
  overflow: hidden;
}
</style>
