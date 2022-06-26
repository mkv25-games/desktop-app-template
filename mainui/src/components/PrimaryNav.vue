<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/full-page-section">Full Page Section</router-link>
    <router-link to="/multi-page-section/section-1">Multi Page Section</router-link>
    <router-link to="/settings/settings">Settings</router-link>
  </div>
</template>

<style scoped>
#nav {
  padding: 0;
  background: black;
}

#nav a {
  display: inline-block;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  padding: 10px 20px;
}

#nav a.router-link-exact-active {
  background: #333;
  color: #42b983;
}

#nav a:hover {
  background: #222;
  color: #62c993;
}
</style>
