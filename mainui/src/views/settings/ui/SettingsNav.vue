<template>
  <sidebar-nav>
    <router-link to="/settings/settings">
      <icon icon="object-group" />
      <span>Interface</span>
    </router-link>
    <router-link to="/settings/mods">
      <icon icon="puzzle-piece" />
      <span>Mods</span>
    </router-link>
    <router-link to="/settings/gamedata">
      <icon icon="database" />
      <span>Game Data</span>
    </router-link>
    <router-link to="/settings/debug/debug-tools">
      <icon icon="cogs" />
      <span>Debug Tools</span>
    </router-link>
    <router-link to="/settings/debug/icons">
      <icon icon="icons" />
      <span>Icons</span>
    </router-link>
    <router-link to="/settings/debug/component-tests">
      <icon icon="boxes" />
      <span>Component Tests</span>
    </router-link>
  </sidebar-nav>
</template>
