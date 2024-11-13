<template>
  <div>
  <div id="cesiumContainer" >
  </div>
  </div>
</template>

<script>
  import {ProviderMap} from '../js/ProviderMap.js'
  import {BasicMap} from "../js/BasicMap.js"
    export default {
        name: "FlyTest",
      data(){
        return{
          viewData:{
            longitude_show:"0",
            latitude_show:"0",
            altitude_show:"0",
          },
        }
      },
      methods:{
//           init() {
//             //随机定义一个位置，放置飞机
//             var lat = 30.050663;
//             var  lng = 101.963815;
//             var height = 2000.0;
//             var heading = 0;
//             var pitch = 0;
//             var roll = 0;
//             //定义飞行过程中的六自由度参数,飞行过程中，参数实时更新，经度，维度，高度，偏航角，俯仰角，滚转角
//             var tempLng, tempLat, temp, tempHeight, tempHeading, tempPitch, tempRoll
//             //左右和上下移动时对速度有影响，用correction去修正速度
//             var correction = 1;
//             //全局实体
//             var myEntity, myEntity2, myCesium, myViewer
//             var msg = [1000000];
//             //全局步长参数
//             var step = 0.0001
//             //全局变量标识
//             //停止飞行变量和飞机模型变量
//             var pauseFlag = 0,
//               planeFlag = 0;
//             if (typeof Cesium !== 'undefined') {
//               startup(Cesium);
//             } else if (typeof require === 'function') {
//               require(['Cesium'], startup);
//             }
//             //创建基础地图
//             function startup(Cesium) {
//               var url = "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
//               var gaode = new Cesium.UrlTemplateImageryProvider({url: url})
//               var viewer = new Cesium.Viewer('cesiumContainer', {
//                 baseLayerPicker: false,
//                 imageryProvider: gaode,
//                 terrainProvider: Cesium.createWorldTerrain({
//                   requestWaterMask: true,
//                   requestVertexNormals: true
//                 }),
//                 infoBox: false,
//                 selectionIndicator: false,
//                 shadows: true,
//                 shouldAnimate: true,
//               });
// //加载图形标注
//               let label = viewer.imageryLayers.addImageryProvider(
//                 new Cesium.WebMapTileServiceImageryProvider({
//                   url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version" +
//                     "=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg" +
//                     "&tk=2d5bdc4af185a85d4770f7e5b6e82aff",
//                   layer: "tdtAnnoLayer",
//                   style: "default",
//                   maximumLevel: 18, //天地图的最大缩放级别
//                   format: "image/jpeg",
//                   tileMatrixSetID: "GoogleMapsCompatible",
//                   show: false,
//                 })
//               )
// //关闭水印
//               viewer.cesiumWidget.creditContainer.style.display = "none"
//               myViewer=viewer;
//               myCesium=Cesium;
//
//               viewer.clock.onTick.addEventListener((clock)=>{
//                 mytestkey(viewer)
//               });
//               createModel("../../static/assets/CesiumAir/Cesium_Air.glb")
//               // 循环执行移动模型操作，移动频率为25次/秒
//               var ite
//               for (ite = 0; ite < 9000; ite++) {
//                 setTimeout("moveModel();", 1000 + 40 * ite);
//                 //  setTimeout("mysql();", 10000);//mysql设置的比较慢
//               }
//
//               function mytestkey(viewer) {
//                 //空格键， 暂停
//                 if (keys[vk_p]) {
//                   pauseFlag += 1;
//                   if (pauseFlag > 1) {
//                     pauseFlag = 0;
//                   }
//                   if (pauseFlag == 0) {
//                     step = 0.0001
//                   } else {
//                     step = 0
//                   }
//                 }
//
//
//                 //k键，切换模型
//                 if (keys[vk_k]) {
//                   planeFlag += 1;
//                   if (planeFlag > 1) {
//                     planeFlag = 0;
//
//                   }
//                   replaceModel(planeFlag);
//                   resetkeys();
//                 }
//                 //上方向键，爬升
//                 if (keys[vk_up] && tempPitch < 1.57 && tempHeight < 100000) {
//                   tempPitch += 0.005;
//                   if (tempPitch > 0)
//                     //tempHeight += step * Math.abs(Math.sin(tempPitch)) * 1110000;//1经纬度约等于110km
//                     tempHeight += step * Math.sin(tempPitch) * 1110000; //1经纬度约等于110km
//
//                 }
//                 //下方向键，俯冲
//                 if (keys[vk_down] && tempPitch > -1.57 && tempHeight > 500) {
//                   tempPitch -= 0.005;
//                   if (tempPitch < 0)
//                     //tempHeight -= step * Math.abs(Math.sin(tempPitch)) * 1110000;
//                     tempHeight += step * Math.sin(tempPitch) * 1110000;
//
//                 }
//
//                 //左方向键，左转
//                 if (keys[vk_left] && tempHeading > -1.57 && tempRoll > -1.57) {
//                   tempHeading -= 0.005;
//                   if (tempRoll > -0.785)
//                     tempRoll -= 0.005;
//                 }
//                 //右方向键，右转
//                 if (keys[vk_right] && tempHeading < 1.57 && tempRoll < 1.57) {
//                   tempHeading += 0.005;
//                   if (tempRoll < 0.785)
//                     tempRoll += 0.005;
//                   //    tempLat -= step ;
//
//                 }
//                 correction = Math.abs(Math.cos(tempHeading)) * Math.abs(Math.cos(tempPitch));
//                 //shift
//                 if (keys[vk_control]) {
//                   tempPitch = 0;
//                 }
//                 if (Math.abs(tempHeading) < 0.001)
//                   tempHeading = 0;
//                 if (Math.abs(tempRoll) < 0.001)
//                   tempRoll = 0;
//                 if (Math.abs(tempPitch) < 0.001)
//                   tempPitch = 0;
//                 if (tempHeading > 0)
//                   tempHeading -= 0.0025;
//                 if (tempHeading < 0)
//                   tempHeading += 0.0025;
//                 if (tempRoll > 0)
//                   tempRoll -= 0.0025;
//                 if (tempRoll < 0)
//                   tempRoll += 0.0025;
//                 if (tempPitch > 0)
//                   tempPitch -= 0.0025;
//                 if (tempPitch < 0)
//                   tempPitch += 0.0025;
//                 document.getElementById('msg').innerHTML = "tempLng:" + tempLng;
//                 document.getElementById('msg1').innerHTML = "tempLat:" + tempLat;
//                 document.getElementById('msg2').innerHTML = "tempPitch:" + tempPitch;
//                 document.getElementById('msg3').innerHTML = "tempHeight:" + parseInt(tempHeight);
//                 document.getElementById('msg4').innerHTML = "tempHeading:" + tempHeading;
//                 document.getElementById('msg5').innerHTML = "tempRoll:" + tempRoll;
//                 document.getElementById('msg6').innerHTML = "step:" + step;
//                 document.getElementById('msg7').innerHTML = "correction:" + correction;
//
//               }
//               //创建模型，
//               function createModel(url) {
//                 myViewer.entities.removeAll();
//                 var position = myCesium.Cartesian3.fromDegrees(lng, lat, height);
//                 var hpr = new myCesium.HeadingPitchRoll(heading, pitch, roll);
//                 var orientation = myCesium.Transforms.headingPitchRollQuaternion(position, hpr);
//
//                 var entity = myViewer.entities.add({
//                   name: url,
//                   position: position,
//                   orientation: orientation,
//                   model: {
//                     uri: url,
//                     minimumPixelSize: 128,
//                     maximumScale: 20000,
//                   },
//
//                 });
//                 //将创建的模型定义为视角追踪对象
//                 myEntity = entity
//                 myViewer.trackedEntity = myEntity;
//
//                 tempLng = lng
//                 tempLat = lat
//                 tempHeight = height
//                 tempHeading = heading
//                 tempPitch = pitch
//                 tempRoll = roll
//               }
//             }
//
//
//           },


// 天地图ke
      },
      mounted() {
          // this.init();
      }
    }

</script>

<style scoped>

</style>
