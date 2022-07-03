<template>
  <div :class="toggleClass" v-on:click="toggle">
    <span class="toggle-box">
      <Icon :icon="icon" />
    </span>
    <label>
      <span class="hidden-width">{{ on }}</span>
      <span class="hidden-width">{{ off }}</span>
      <span class="hidden-width">{{ unknown }}</span>
      <span>{{ label }}</span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: null
    },
    on: {
      type: String,
      default: 'Enabled'
    },
    off: {
      type: String,
      default: 'Disabled'
    },
    unknown: {
      type: String,
      default: 'Unknown'
    }
  },
  computed: {
    label () {
      if (this.isUnknown) {
        return this.unknown
      }
      return this.modelValue ? this.on : this.off
    },
    icon () {
      if (this.isUnknown) {
        return 'question'
      }
      return this.modelValue ? 'check' : 'times'
    },
    toggleClass () {
      if (this.isUnknown) {
        return 'toggle unknown'
      }
      return this.modelValue ? 'toggle on' : 'toggle off'
    },
    isUnknown () {
      console.log('Is unknown?', this.modelValue, typeof this.modelValue)
      return typeof this.modelValue !== 'boolean'
    }
  },
  methods: {
    toggle () {
      const newValue = !this.modelValue
      this.$emit('update:modelValue', newValue)
      this.$emit('toggled', newValue)
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
div.toggle:hover > .toggle-box {
  background: white;
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
