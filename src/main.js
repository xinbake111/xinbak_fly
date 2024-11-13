// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import widgets from 'cesium/Widgets/widgets.css';



const Cesium = require('cesium/Cesium')
window.Cesium=Cesium;
Vue.prototype.widgets = widgets
Vue.use(ElementUI);
Vue.prototype.$axios=axios;
Vue.config.productionTip = false
const img = new Image();
img.crossOrigin = "anonymous";

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJqdGkiOiI3NmQ2OWY4Yy03ZjE3LTRlMDctYTVjMy00NTgzN2Y0MjZjNTYiLCJpZCI6NDE5OTgsImlhdCI6MTYxMDkzOTQ1MH0.' +
  '7FUcm8vEzO5Njho-N40_aLupPZmP7ctisuBFP2yAFU8'
/* eslint-disable no-new */


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',

})
