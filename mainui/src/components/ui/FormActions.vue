<template>
  <div class="form-actions">
    <slot></slot>
  </div>
</template>

<style scoped>
div.actions {
  display: flex;
  justify-content: center;
  margin: 0.5em 0;
}

div.actions > * {
  flex: 0 1;
  margin: 0.5em;
}
</style>
