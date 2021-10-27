<template>
  <div id="app">
    <div id ="connexion"> </div>
    <div id ="profil"></div>
    <div id ="forum"></div>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<style lang="css"> 
</style>
