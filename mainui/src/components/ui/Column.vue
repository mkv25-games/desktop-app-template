<template>
  <div class="flex-column">
    <slot></slot>
  </div>
</template>

<style scoped>
.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  justify-items: stretch;
}
</style>
