<template>
  <div class="home cover-image">
    <div class="excerpt">
      <h1>Desktop App Template</h1>
      <p>The landing page of the application.</p>
      <p>Welcome to this place in space and time.</p>
      <p>&nbsp;</p>
      <div v-if="$store.state.saveFileList.length > 0">
        <router-link to="/full-page-section" draggable="false">Continue Adventure <icon icon="angle-double-right" /></router-link>
      </div>
      <div v-else>
        <router-link to="/full-page-section" draggable="false">Start Adventure</router-link>
      </div>
      <p>&nbsp;</p>
    </div>
  </div>
</template>

<script>
export default {
  async mounted () {
    await this.$store.refreshSaveFileList()
  }
}
</script>

<style scoped>
.home {
  display: flex;
  background-color: #222;
  justify-content: center;
  align-items: center;
}

h1 {
  color: black;
}

.excerpt {
  display: inline-block;
  width: 40%;
  padding: 20px 20px;
  border-radius: 1em;
  border-left: 4px solid #eee;
  border-right: 4px solid #eee;
  background: rgba(224, 224, 224, 0.7);
  color: black;
  font-weight: 500;
}

.excerpt a {
  color: greenyellow;
  font-weight: 700;
  text-decoration: none;
  border-left: 4px solid greenyellow;
  border-right: 4px solid greenyellow;
  padding: 10px;
  border-radius: 10px;
  background: rgba(34, 34, 34, 0.7);
  transition: background 250ms, border 1s, padding 200ms ease-in-out;
  user-select: none;
}
.excerpt a:hover {
  color: lightskyblue;
  border-left: 4px solid lightpink;
  border-right: 4px solid lightpink;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 40px;
}
.excerpt a:active {
  color: white;
  border-color: white;
  background: rgba(0, 0, 0, 0.9);
  padding: 10px;
}

.cover-image {
  background: url('../../public/assets/icon.png') no-repeat center center;
  background-size: contain;
}
</style>
