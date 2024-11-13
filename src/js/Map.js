export function CesiumMap() {
  var url = "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
  var gaode = new Cesium.UrlTemplateImageryProvider({url: url})
  var viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: false,
    imageryProvider: gaode,
    terrainProvider: Cesium.createWorldTerrain({
      requestWaterMask: true,
      requestVertexNormals: true
    }),
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
  let position = Cesium.Cartesian3.fromDegrees(104.25, 30.99, 15000.0);
  // 设置模型方向
  let hpRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(45), 0, 0);
  let fixedFrame=Cesium.Transforms.localFrameToFixedFrameGenerator('north','west');
  let  scene=viewer.scene;
  scene.primitives.add(Cesium.Model.fromGltf({
    // 资源路径
    url: "../../static/assets/CesiumAir/Cesium_Air.glb",
    // 模型矩阵
    modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrame, position),
    // 模型最小刻度
    minimumPixelSize: 128,
    // 模型标尺
    scale : 2.0,
    // 模型最大刻度
    maximumScale: 20000,
    // 仅用于调试。显示模型绘制时的边界球。
    debugShowBoundingVolume : false,
    // 仅用于调试，显示魔仙绘制时的线框
    debugWireframe : false
  }));


  //设置视角

  viewer.camera.setView({
    destination : new Cesium.Cartesian3.fromDegrees(104.25, 30.99, 15000.0)
  });




//加载Kml文件
  var kmlOptions = {
    camera : viewer.scene.camera,
    canvas : viewer.scene.canvas,
    clampToGround : true
  };
  // Load geocache points of interest from a KML file
  // Data from : http://catalog.opendata.city/dataset/pediacities-nyc-neighborhoods/resource/91778048-3c58-449c-a3f9-365ed203e914
  var geocachePromise = Cesium.KmlDataSource.load('../../static/assets/planeLine.kmz', kmlOptions);

  // Add geocache billboard entities to scene and style them
  geocachePromise.then(function(dataSource) {
    // Add the new data as entities to the viewer
    viewer.dataSources.add(dataSource);
    // Get the array of entities
    var geocacheEntities = dataSource.entities.values;

    for (var i = 0; i < geocacheEntities.length; i++) {
      var entity = geocacheEntities[i];
      if (Cesium.defined(entity.billboard)) {
        // Adjust the vertical origin so pins sit on terrain
        entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
        // Disable the labels to reduce clutter
        entity.label = undefined;
        // Add distance display condition
        entity.billboard.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(10.0, 20000.0);
        // Compute latitude and longitude in degrees
        var cartographicPosition = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
        var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
        var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
        // Modify description
        var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>' +
          '<tr><th>' + "Longitude" + '</th><td>' + longitude.toFixed(5) + '</td></tr>' +
          '<tr><th>' + "Latitude" + '</th><td>' + latitude.toFixed(5) + '</td></tr>' +
          '</tbody></table>';
        entity.description = description;
      }
    }
  });

  var VectorTileImageryProvider = Cesium.VectorTileImageryProvider;

}
