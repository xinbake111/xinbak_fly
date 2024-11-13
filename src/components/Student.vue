<template>
  <div>
  <div id="cesiumContainer" style="height: 100%"></div>
  </div>
</template>

<script>
  export default {
    name:"Student",//可写可不写写上最好
    data(){
      return {
        tableData: Array(20).fill(item),
        msg:"辛巴克"
      }
    },
    methods: {
      init() {
        var viewer = new Cesium.Viewer("cesiumContainer", {
          infoBox: false, //禁用地形变化
          selectionIndicator: false, //Disable selection indicator
          shouldAnimate: true, // Enable animations
          terrainProvider: Cesium.createWorldTerrain(),
        });

//打开自然光
        viewer.scene.globe.enableLighting = true;

//启用深度测试，所以地形后面的东西会消失
        viewer.scene.globe.depthTestAgainstTerrain = true;

////生成一个随机数
        Cesium.Math.setRandomNumberSeed(3);

//设定模拟时间边界
        var start = Cesium.JulianDate.fromDate(new Date(2021, 6, 18, 16));
        var stop = Cesium.JulianDate.addSeconds(
          start,
          360,
          new Cesium.JulianDate()
        );

//确保查看器处于预期的时间
        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        //循环结束
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
//时间变化来控制速度
        viewer.clock.multiplier = 5;

//给时间线设置边界
        viewer.timeline.zoomTo(start, stop);
//追随视角
        viewer.trackedEntity = entity;

//多边形和点（高度随机）
        function computeCirclularFlight(lon, lat, radius) {
          var property = new Cesium.SampledPositionProperty();
          //i为角度(多边形的偏离角度)
          for (var i = 0; i <= 360; i += 45) {
            var radians = Cesium.Math.toRadians(i);
            var time = Cesium.JulianDate.addSeconds(
              start,
              i,
              new Cesium.JulianDate()
            );
            // 计算位置
            var position = Cesium.Cartesian3.fromDegrees(
              lon + radius * 1.5 * Math.cos(radians),
              lat + radius * Math.sin(radians),
              Cesium.Math.nextRandomNumber() * 500 + 1750
            );
            //添加了8个sample  360/45=8
            property.addSample(time, position);

            //那几个黄圈圈
            viewer.entities.add({
              position: position,
              point: {
                pixelSize: 8,
                color: Cesium.Color.TRANSPARENT,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 3,
              },
            });
          }
          return property;
        }

//计算实体位置属性
        var position = computeCirclularFlight(-112.110693, 36.0994841, 0.03)

//创建实体
        var entity = viewer.entities.add({
          // 将实体availability设置为与模拟时间相同的时间间隔。
          availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
              start: start,
              stop: stop,
            }),
          ]),

          //位置 这是一个4x4的矩阵，包含了方位方向等属性
          position: position,
          //视角随着路线移动
          orientation: new Cesium.VelocityOrientationProperty(position),
          //模型
          model: {
            uri: "../../static/assets/CesiumAir/Cesium_Air.glb",
            minimumPixelSize: 32,
          },
          //路径
          path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.1,
              color: Cesium.Color.YELLOW,
            }),
            width: 10,
          },
        });
        //改变差值器
        entity.position.setInterpolationOptions({
          interpolationDegree: 2,
          interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
        });
        //
        // 第一人称视角
        var camera = viewer.camera;
        camera.position = new Cesium.Cartesian3(0.25, 0.0, 0.0);
        camera.direction = new Cesium.Cartesian3(1.0, 0.0, 0.0);
        camera.up = new Cesium.Cartesian3(0.0, 0.0, 1.0);
        camera.right = new Cesium.Cartesian3(0.0, -1.0, 0.0);

        viewer.scene.postUpdate.addEventListener(function (scene, time) {
          var position = entity.position.getValue(time);
          if (!Cesium.defined(position)) {
            return;
          }

          var transform;
          if (!Cesium.defined(entity.orientation)) {
            transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
          } else {
            var orientation = entity.orientation.getValue(time);
            if (!Cesium.defined(orientation)) {
              return;
            }

            transform = Cesium.Matrix4.fromRotationTranslation(
              Cesium.Matrix3.fromQuaternion(orientation),
              position
            );
          }

          // Save camera state
          var offset = Cesium.Cartesian3.clone(camera.position);
          var direction = Cesium.Cartesian3.clone(camera.direction);
          var up = Cesium.Cartesian3.clone(camera.up);

          // Set camera to be in model's reference frame.
          camera.lookAtTransform(transform);

          // Reset the camera state to the saved state so it appears fixed in the model's frame.
          Cesium.Cartesian3.clone(offset, camera.position);
          Cesium.Cartesian3.clone(direction, camera.direction);
          Cesium.Cartesian3.clone(up, camera.up);
          Cesium.Cartesian3.cross(direction, up, camera.right);
        });




      },
      loop(){
        var viewer = new Cesium.Viewer("cesiumContainer", {
        vrButton: true,
        //地形提供着
        terrainProvider: Cesium.createWorldTerrain(),
      });
// Click the VR button in the bottom right of the screen to switch to VR mode.

      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.depthTestAgainstTerrain = true;

//沿着飞机的轨迹。参见插值Sandcastle示例。 生成随机数
      Cesium.Math.setRandomNumberSeed(3);
      //创建开始日期
      var start = Cesium.JulianDate.fromDate(new Date(2021, 6, 18, 16));
      //结束时间360秒
      var stop = Cesium.JulianDate.addSeconds(
        start,
        360,
        new Cesium.JulianDate()
      );

      viewer.clock.startTime = start.clone();
      viewer.clock.stopTime = stop.clone();
      viewer.clock.currentTime = start.clone();
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      viewer.clock.multiplier = 1.0;
      viewer.clock.shouldAnimate = true;

      function computeCirclularFlight(lon, lat, radius) {
        //动态控制模型按轨迹运动
        var property = new Cesium.SampledPositionProperty();
        //生成随机模拟数 生成开始的随机模拟数
        var startAngle = Cesium.Math.nextRandomNumber() * 360.0;
        //生成结束的随机数 开始加360度绕圈
        var endAngle = startAngle + 360.0;
        //下一个时间的运行轨迹
        var increment =
          (Cesium.Math.nextRandomNumber() * 2.0 - 1.0) * 10.0+45;
        console.log(increment)
        for (var i = startAngle; i < endAngle; i += increment) {
          //角度转换为弧度
          var radians = Cesium.Math.toRadians(i);
          var timeIncrement = i - startAngle;
          //当前时刻
          var time = Cesium.JulianDate.addSeconds(
            start,
            timeIncrement,
            new Cesium.JulianDate()
          );
          //从以度为单位的经度和纬度值返回笛卡尔坐标3位置。
          var position = Cesium.Cartesian3.fromDegrees(
            lon + radius * 1.5 * Math.cos(radians),
            lat + radius * Math.sin(radians),
            Cesium.Math.nextRandomNumber() * 500 + 1800
          );
          property.addSample(time, position);
        }
        return property;
      }


      var longitude = -112.110693;
      var latitude = 36.0994841;
      var radius = 0.03;
      //资源路径
      var modelURI =
        "../../static/assets/CesiumAir/Cesium_Air.glb";
      var entity = viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop,
          }),
        ]),
        position: computeCirclularFlight(longitude, latitude, radius),

        //基于航线自动调整方向
        // orientation: new Cesium.VelocityOrientationProperty(position),
        model: {
          uri: modelURI,
          minimumPixelSize: 128,
        },
      });

      entity.position.setInterpolationOptions({
        interpolationDegree: 2,
        interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
      });

// 在模型的参考坐标系中设置初始相机位置和方向。
      var camera = viewer.camera;
      camera.position = new Cesium.Cartesian3(0.25, 0.0, 0.0);
      camera.direction = new Cesium.Cartesian3(1.0, 0.0, 0.0);
      camera.up = new Cesium.Cartesian3(0.0, 0.0, 1.0);
      camera.right = new Cesium.Cartesian3(0.0, -1.0, 0.0);


      //获取将在场景更新之后和场景渲染之前立即引发的事件。事件的订阅者接收场景实例作为第一个参数，当前时间作为第二个参数。
      viewer.scene.postUpdate.addEventListener(function (scene, time) {
        var position = entity.position.getValue(time);
        if (!Cesium.defined(position)) {
          return;
        }

        var transform;
        if (!Cesium.defined(entity.orientation)) {
          transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        } else {
          var orientation = entity.orientation.getValue(time);
          if (!Cesium.defined(orientation)) {
            return;
          }

          transform = Cesium.Matrix4.fromRotationTranslation(
            Cesium.Matrix3.fromQuaternion(orientation),
            position
          );
        }

        // Save camera state
        var offset = Cesium.Cartesian3.clone(camera.position);
        var direction = Cesium.Cartesian3.clone(camera.direction);
        var up = Cesium.Cartesian3.clone(camera.up);

        // Set camera to be in model's reference frame.
        camera.lookAtTransform(transform);

        // Reset the camera state to the saved state so it appears fixed in the model's frame.
        Cesium.Cartesian3.clone(offset, camera.position);
        Cesium.Cartesian3.clone(direction, camera.direction);
        Cesium.Cartesian3.clone(up, camera.up);
        Cesium.Cartesian3.cross(direction, up, camera.right);
      });


      },
    },
    mounted() {
      this.init();



    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

</style>
