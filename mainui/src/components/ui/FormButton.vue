<template>
  <div class="form-button">
    <router-link v-if="to" :to="to">
      <icon v-if="icon" :icon="icon" />
      <label v-if="label">{{ label }}</label>
      <slot v-else></slot>
    </router-link>
    <span v-else>
      <icon v-if="icon" :icon="icon" />
      <label v-if="label">{{ label }}</label>
      <slot v-else></slot>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.form-button {
  display: inline-flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 0.4em;
  color: black;
  background: white;
  margin: 0.2em;
  padding: 0.4em 1.2em;
  font-size: 0.9em;
  font-family: inherit;
  cursor: default;
}
.form-button > * {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-button a {
  text-decoration: none;
  color: black;
}
.form-button:hover {
  background: rgb(248, 187, 102);
  outline: 1px solid orange;
}
.form-button:active {
  background: rgb(218, 131, 32);
}
.form-button:focus, .form-button.selected {
  background: rgb(248, 187, 102);
}
.form-button.not-ok {
  background: rgb(244, 124, 124);
  outline: 1px solid red;
}
.icon {
  font-size: 1.2em;
  margin: -0.2em -0.5em;
}
</style>
