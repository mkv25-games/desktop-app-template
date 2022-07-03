<template>
  <div :class="checkmarkClass">
    <span class="checkmark-box">
      <Icon :icon="icon" />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    icon () {
      return this.modelValue ? 'check' : 'times'
    },
    checkmarkClass () {
      return this.modelValue ? 'checkmark checked' : 'checkmark unchecked'
    }
  }
}
</script>

<style scoped>
div.checkmark {
  display: inline-flex;
  justify-items: center;
  align-items: center;
}
.checkmark-box {
  margin: 0.2em;
  font-size: 1.2em;
  background: #f3f3f3;
  border-radius: 0.2em;
}
.checkmark.checked > .checkmark-box {
  color: black;
}
.checkmark.unchecked > .checkmark-box {
  color: #999;
}
</style>
