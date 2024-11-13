export function BasicMap( viewer) {
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

  return viewer

}
