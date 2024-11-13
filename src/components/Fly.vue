<template>
  <div id="cesiumContainer"></div>
</template>

<script>
  import {ProviderMap} from '../js/ProviderMap.js'
    export default {
        name: "Fly",
      data(){
          return{

          }
      },
      methods: {
        init() {

          var providerMap = new ProviderMap();

        }
      },
      mounted() {
        this.init();
      },
    }

</script>

<style scoped>

</style>
