<template>
  <div>
    <div class="body-content">
      <div id="cesiumContainer"></div>
      <div id="heatmap" v-show="false"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Mark",
    data(){
      return{
        viewer:{}
      }
    },
    mounted(){
      var len = 300;
      var points = [];
      var max = 100;
      var width = 600;
      var height = 400;

      var latMin = 28.364807;
      var latMax = 40.251095;
      var lonMin = 94.389228;
      var lonMax = 108.666357;

      var dataRaw = [];
      for (var i = 0; i < len; i++) {
        var point = {
          lat: latMin + Math.random() * (latMax - latMin),
          lon: lonMin + Math.random() * (lonMax - lonMin),
          value: Math.floor(Math.random() * 100)
        };
        dataRaw.push(point);
      }
//
      for (var i = 0; i < len; i++) {
        var dataItem = dataRaw[i];
        var point = {
          x: Math.floor((dataItem.lat - latMin) / (latMax - latMin) * width),
          y: Math.floor((dataItem.lon - lonMin) / (lonMax - lonMin) * height),
          value: Math.floor(dataItem.value)
        };
        max = Math.max(max, dataItem.value);
        points.push(point);
      }

      var heatmapInstance = h337.create({
        container: document.querySelector('#heatmap')
      });

      var data = {
        max: max,
        data: points
      };
//
      heatmapInstance.setData(data);


      var viewer = new Cesium.Viewer('cesiumContainer');

      viewer._cesiumWidget._creditContainer.style.display = "none";

      var canvas = document.getElementsByClassName('heatmap-canvas');
      console.log(canvas);
      viewer.entities.add({
        name: 'heatmap',
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(lonMin, latMin, lonMax, latMax),
          material: new Cesium.ImageMaterialProperty({
            image: canvas[0],
            transparent: true
          })

        }
      });

      viewer.zoomTo(viewer.entities);
    }
  }
</script>

<style>
  #heatmap{
    width: 500px;
    height: 500px;
  }
</style>
