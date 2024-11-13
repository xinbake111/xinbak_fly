<template>
  <div><div id="cesiumContainer" class="fullSize">
  <div id="toolbar">
    <table class="demo-tool">
      <tbody>
      <tr>
        <td>
          使用键盘控制飞机
        </td>
      </tr>
      <tr>
        <td>角度: <span id="heading"></span>°</td>
      </tr>
      <tr>
        <td>← 向左/→ 向右</td>
      </tr>
      <tr>
        <td>上下角度: <span id="pitch"></span>°</td>
      </tr>
      <tr>
        <td>↑ 向上/↓ 向下</td>
      </tr>
      <tr>
        <td>圈角度: <span id="roll"></span>°</td>
      </tr>
      <tr>
        <td>← + ⇧ 左/→ + ⇧ 右</td>
      </tr>
      <tr>
        <td>速度: <span id="speed"></span>m/s</td>
      </tr>
      <tr>
        <td>↑ + ⇧ 加速/↓ + ⇧ 减速</td>
      </tr>
      <tr>
        <td>
          第一视角飞行
          <input id="fromBehind" type="checkbox">
        </td>
      </tr>
      <tr>
        <td>
          标准视角飞行
          <input id="fromStd" type="checkbox">
        </td>
      </tr>
      </tbody>

    </table>
  </div>
    <div id="latlng_show" style="background-color:rgba(0, 0, 0, 0.5);bottom:1px;width:100%;height:30px;position:absolute;z-index: 999;top: 0">
      <div style="float:left;">
        <font size="1" color="white">经度：<span id="longitude_show"></span></font>
      </div>

      <div style="float:left;">
        <font size="1" color="white">纬度：<span id="latitude_show"></span></font>
      </div>

      <div style="float:left;">
        <font size="1" color="white">视角高：<span id="altitude_show"></span>km</font>
      </div>

      <div style="float:left;">
        <font size="1" color="white">海拔高：<span id="elevation_show"></span></font>
      </div>


      <div style="float:left;">
        <font size="1" color="white">当前飞行经度：{{posNow.y}}<span id="flylon_show"></span></font>
      </div>
      <div style="float:left;">
        <font size="1" color="white">当前飞行纬度：{{posNow.x}}<span id="flylat_show"></span></font>
      </div>
      <div style="float:left;">
        <font size="1" color="white">当前飞行高度：{{posNow.z}}<span id="flyheigh_show"></span></font>
      </div>

    </div>


  </div>

  </div>
</template>

<script>
    export default {
      name: "PlayFly",
      data(){
        return{
          viewModel:{
          color: "Red",
          colors: ["White", "Red", "Green", "Blue", "Yellow", "Gray"],
          alpha: 1.0,
          colorBlendMode: "Highlight",
          colorBlendModes: ["Highlight", "Replace", "Mix"],
          colorBlendAmount: 0.5,
          colorBlendAmountEnabled: true,
          silhouetteColor: "Red",
          silhouetteColors: ["Red", "Green", "Blue", "Yellow", "Gray"],
          silhouetteAlpha: 1.0,
          silhouetteSize: 2.0,
          },
          pos:[],
          posNow:{x:'',y:'',z:'',elec:''},
        }
      },

      methods:{
          init(){
            var url = "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
            var gaode = new Cesium.UrlTemplateImageryProvider({url: url})
            var viewer = new Cesium.Viewer('cesiumContainer', {
              baseLayerPicker: false,
              imageryProvider: gaode,
              terrainProvider: Cesium.createWorldTerrain({
                requestWaterMask: true,
                requestVertexNormals: true
              }),
              infoBox: false,
              selectionIndicator: false,
              shadows: true,
              shouldAnimate: true,
            });
//加载图形标注
            let label = viewer.imageryLayers.addImageryProvider(
              new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version" +
                  "=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg" +
                  "&tk=2d5bdc4af185a85d4770f7e5b6e82aff",
                layer: "tdtAnnoLayer",
                style: "default",
                maximumLevel: 18, //天地图的最大缩放级别
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
                show: false,
              })
            )
//关闭水印
            viewer.cesiumWidget.creditContainer.style.display = "none"



            var canvas = viewer.canvas;
            canvas.setAttribute("tabindex", "0"); // needed to put focus on the canvas
            canvas.addEventListener("click", function () {
              canvas.focus();
            });
            canvas.focus();

            var scene = viewer.scene;

            var pathPosition = new Cesium.SampledPositionProperty();
            var entityPath = viewer.entities.add({
              position: pathPosition,
              name: "path",
              path: {
                show: true,
                leadTime: 0,
                trailTime: 60,
                width: 10,
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                  glowPower: 0.3,
                  taperPower: 0.3,
                  color: Cesium.Color.PALEGOLDENROD,
                }),
              },
            });

            var camera = viewer.camera;
            var controller = scene.screenSpaceCameraController;
            var r = 0;
            var center = new Cesium.Cartesian3();

            var hpRoll = new Cesium.HeadingPitchRoll();//飞机本身俯仰角
            var hpRange = new Cesium.HeadingPitchRange();//视角下飞机俯仰角
            var speed = 10;
            var deltaRadians = Cesium.Math.toRadians(3.0);
            var position = Cesium.Cartesian3.fromDegrees(
              101.963815, 30.050663, 1500
            );
            var speedVector = new Cesium.Cartesian3();
            var fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator(
              "north",
              "west"
            )


            var planePrimitive =scene.primitives.add(
              Cesium.Model.fromGltf({
                url: "../../static/assets/CesiumAir/1.glb",
                modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
                  position,
                  hpRoll,
                  Cesium.Ellipsoid.WGS84,
                  fixedFrameTransform
                ),
                minimumPixelSize: 32,
                // color: getColor(this.viewModel.color, this.viewModel.alpha),
                // colorBlendMode: getColorBlendMode(this.viewModel.colorBlendMode),
                // colorBlendAmount: parseFloat(this.viewModel.colorBlendAmount),
                // silhouetteColor: getColor(
                //   this.viewModel.silhouetteColor,
                //   this.viewModel.silhouetteAlpha
                // ),
                // silhouetteSize: parseFloat(this.viewModel.silhouetteSize),
              })
            );

            viewer.trackedEntity = planePrimitive;

            planePrimitive.readyPromise.then(function (model) {
              // Play and loop all animations at half-speed
              model.activeAnimations.addAll({
                multiplier: 0.5,
                loop: Cesium.ModelAnimationLoop.REPEAT,
              });

              // Zoom to model
              r = 2.0 * Math.max(model.boundingSphere.radius, camera.frustum.near);
              controller.minimumZoomDistance = r * 0.5;
              Cesium.Matrix4.multiplyByPoint(
                model.modelMatrix,
                model.boundingSphere.center,
                center
              );
              var heading = Cesium.Math.toRadians(230.0);
              var pitch = Cesium.Math.toRadians(-20.0);
              hpRange.heading = heading;
              hpRange.pitch = pitch;
              hpRange.range = r * 50.0;
              camera.lookAt(center, hpRange);
            });

            document.addEventListener("keydown", function (e) {
              switch (e.keyCode) {
                case 40:
                  if (e.shiftKey) {
                    // speed down
                    speed = Math.max(--speed, 1);
                  } else {
                    // pitch down
                    hpRoll.pitch -= deltaRadians;
                    if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
                      hpRoll.pitch += Cesium.Math.TWO_PI;
                    }
                  }
                  break;
                case 38:
                  if (e.shiftKey) {
                    // speed up
                    speed = Math.min(++speed, 100);
                  } else {
                    // pitch up
                    hpRoll.pitch += deltaRadians;
                    if (hpRoll.pitch > Cesium.Math.TWO_PI) {
                      hpRoll.pitch -= Cesium.Math.TWO_PI;
                    }
                  }
                  break;
                case 39:
                  if (e.shiftKey) {
                    // roll right
                    hpRoll.roll += deltaRadians;
                    if (hpRoll.roll > Cesium.Math.TWO_PI) {
                      hpRoll.roll -= Cesium.Math.TWO_PI;
                    }
                  } else {
                    // turn right
                    hpRoll.heading += deltaRadians;
                    if (hpRoll.heading > Cesium.Math.TWO_PI) {
                      hpRoll.heading -= Cesium.Math.TWO_PI;
                    }
                  }
                  break;
                case 37:
                  if (e.shiftKey) {
                    // roll left until
                    hpRoll.roll -= deltaRadians;
                    if (hpRoll.roll < 0.0) {
                      hpRoll.roll += Cesium.Math.TWO_PI;
                    }
                  } else {
                    // turn left
                    hpRoll.heading -= deltaRadians;
                    if (hpRoll.heading < 0.0) {
                      hpRoll.heading += Cesium.Math.TWO_PI;
                    }
                  }
                  break;
                default:
              }
            });

            var headingSpan = document.getElementById("heading");
            var pitchSpan = document.getElementById("pitch");
            var rollSpan = document.getElementById("roll");
            var speedSpan = document.getElementById("speed");
            var fromBehind = document.getElementById("fromBehind");
            var fromStd = document.getElementById("fromStd");
            var _this=this


            viewer.scene.preUpdate.addEventListener(function (scene, time) {
              speedVector = Cesium.Cartesian3.multiplyByScalar(
                Cesium.Cartesian3.UNIT_X,
                speed / 10,
                speedVector
              );
              position = Cesium.Matrix4.multiplyByPoint(
                planePrimitive.modelMatrix,
                speedVector,
                position
              );
              var flyNow={x:'',y:'',z:''}

              //飞行记录
              _this.pos.push(position)


              flyNow=position



              if(flyNow){
                //将笛卡尔三维坐标转为地图坐标（弧度）
                var cartographic=viewer.scene.globe.ellipsoid.cartesianToCartographic(flyNow);
                //将地图坐标（弧度）转为十进制的度数
                //纬度
                _this.posNow.x=Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
                //经度
                _this.posNow.y=Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
                //高度
                _this.posNow.z=Cesium.Math.toDegrees(cartographic.height).toFixed(2);
                _this.posNow.elec=viewer.scene.globe.getHeight(cartographic);

              }





              pathPosition.addSample(Cesium.JulianDate.now(), position);
              Cesium.Transforms.headingPitchRollToFixedFrame(
                position,
                hpRoll,
                Cesium.Ellipsoid.WGS84,
                fixedFrameTransform,
                planePrimitive.modelMatrix
              );


              if (fromBehind.checked) {
                // 第一人称视角
                Cesium.Matrix4.multiplyByPoint(
                  planePrimitive.modelMatrix,
                  planePrimitive.boundingSphere.center,
                  center
                );
                hpRange.heading = hpRoll.heading;
                hpRange.pitch = hpRoll.pitch;
                camera.lookAt(center, hpRange);
              }

              //标准视角
              if (fromStd.checked){
                Cesium.Matrix4.multiplyByPoint(
                  planePrimitive.modelMatrix,
                  planePrimitive.boundingSphere.center,
                  center
                );
                hpRange.heading = Cesium.Math.toRadians(50.0);
                hpRange.pitch = Cesium.Math.toRadians(-45.0);
                hpRange.range=5000
                camera.lookAt(center, hpRange);
              }
            });


            viewer.scene.preRender.addEventListener(function (scene, time) {
              headingSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.heading).toFixed(
                1
              );
              pitchSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.pitch).toFixed(1);
              rollSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.roll).toFixed(1);
              speedSpan.innerHTML = speed.toFixed(1);
            });



            //添加颜色
            function getColorBlendMode(colorBlendMode) {
              return Cesium.ColorBlendMode[colorBlendMode.toUpperCase()];
            }

            function getColor(colorName, alpha) {
              var color = Cesium.Color[colorName.toUpperCase()];
              return Cesium.Color.fromAlpha(color, parseFloat(alpha));
            }
            // Convert the viewModel members into knockout observables.
            Cesium.knockout.track(this.viewModel);

// Bind the viewModel to the DOM elements of the UI that call for it.
            var toolbar = document.getElementById("toolbar");
            Cesium.knockout.applyBindings(this.viewModel,toolbar);

            Cesium.knockout
              .getObservable(this.viewModel, "color")
              .subscribe(function (newValue) {
                planePrimitive.color = getColor(newValue, this.viewModel.alpha);
              });

            Cesium.knockout
              .getObservable(this.viewModel, "alpha")
              .subscribe(function (newValue) {
                planePrimitive.color = getColor(this.viewModel.color, newValue);
              });

            Cesium.knockout
              .getObservable(this.viewModel, "colorBlendMode")
              .subscribe(function (newValue) {
                var colorBlendMode = getColorBlendMode(newValue);
                planePrimitive.colorBlendMode = colorBlendMode;
                this.viewModel.colorBlendAmountEnabled =
                  colorBlendMode === Cesium.ColorBlendMode.MIX;
              });

            Cesium.knockout
              .getObservable(this.viewModel, "colorBlendAmount")
              .subscribe(function (newValue) {
                planePrimitive.colorBlendAmount = parseFloat(newValue);
              });

            Cesium.knockout
              .getObservable(this.viewModel, "silhouetteColor")
              .subscribe(function (newValue) {
                planePrimitive.silhouetteColor = getColor(
                  newValue,
                  this.viewModel.silhouetteAlpha
                );
              });

            Cesium.knockout
              .getObservable(this.viewModel, "silhouetteAlpha")
              .subscribe(function (newValue) {
                planePrimitive.silhouetteColor = getColor(
                  this.viewModel.silhouetteColor,
                  newValue
                );
              });

            Cesium.knockout
              .getObservable(this.viewModel, "silhouetteSize")
              .subscribe(function (newValue) {
                planePrimitive.silhouetteSize = parseFloat(newValue);
              });

            // // g跟随鼠标获取经纬度和海拔
            var longitude_show=document.getElementById('longitude_show');
            var latitude_show=document.getElementById('latitude_show');
            var altitude_show=document.getElementById('altitude_show');
            var elevation_show=document.getElementById('elevation_show');

            var canvas=viewer.scene.canvas;
//具体事件的实现
            var ellipsoid=viewer.scene.globe.ellipsoid;
            var handler = new Cesium.ScreenSpaceEventHandler(canvas);
            handler.setInputAction(function(movement){
              //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
              var cartesian=viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
              if(cartesian){
                //将笛卡尔三维坐标转为地图坐标（弧度）
                var cartographic=viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                //将地图坐标（弧度）转为十进制的度数
                var lat_String=Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
                var log_String=Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
                var alti_String=(viewer.camera.positionCartographic.height/1000).toFixed(2);
                var elec_String=viewer.scene.globe.getHeight(cartographic);

                longitude_show.innerHTML=log_String;
                latitude_show.innerHTML=lat_String;
                altitude_show.innerHTML=alti_String;//视角高度 km
                elevation_show.innerHTML=elec_String;//海拔
              }
            },Cesium.ScreenSpaceEventType.MOUSE_MOVE);



          },

      },
      mounted() {
        this.init();
      },
    }


</script>
<style scoped>
  /* This file is automatically rebuilt by the Cesium build process. */
  .fullSize{display:block;position:relative;top:0;left:0;border:none;width:100%;height:100%}
  .viewer {
    width: 100%;
    height: 100%;
  }
  #toolbar{z-index:999}
  #toolbar{margin:5px;padding:2px 5px;position:absolute}
  .demo-tool{background:rgba(42,42,42,.8);padding:4px;border:1px solid #444;border-radius:4px}
</style>
