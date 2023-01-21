<template>
  <div class="dialog-lightbox">
    <div class="dialog">
      <slot>Popup Dialog</slot>
    </div>
  </div>
</template>

<style scoped>
div.dialog-lightbox {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
}
div.dialog {
  top: 0;
  left: 100px;
  background: white;
  padding: 4em;
  border-radius: 2em;
  border: 0.2em solid #ccc;
}
</style>
