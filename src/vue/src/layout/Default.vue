<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">まるばつゲーム VR</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import "../../node_modules/bulma/bulma.sass";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  font-size: x-large;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
