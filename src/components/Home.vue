<template>
          <div id="cesiumContainer"></div>
</template>

<script>
  const Cesium = require('cesium/Cesium')
  import {CesiumMap} from '../js/Map.js'
  export default {
    name: "Home",
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]

      };
    },
    methods:{
      init(){
        CesiumMap();
      },

    },

    mounted() {
      this.init();
    }
  };
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100vh;
  }
  #cesiumContainer {
    width: 100%;
    height: 100vh;
  }
</style>
