<template>
  <div class="form-row">
    <slot></slot>
  </div>
</template>

<style>
div.form-row {
  display: flex;
  justify-content: stretch;
  margin: 0.5em 0;
}
div.form-row label {
  flex: 1 1;
  text-align: right;
  margin: 0.5em;
}
div.form-row input {
  flex: 1 1;
}
</style>
