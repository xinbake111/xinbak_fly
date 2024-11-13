import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import User from "../components/User";
import Student from "../components/Student";
import Mark from "../components/Mark";
import Login from "../components/Login";
import Fly from "../components/Fly";
import PlayFly from "../components/PlayFly";
import FlyTest from "../components/FlyTest";
import FlyCafuc from "../components/FlyTest";
Vue.use(Router)

export default new Router({
  routes: [
    {path: '/Login', name: 'Login', component: Login},
    {path: '/', redirect:'/Home'},//重定向到Home.vue
    {path: '/Home', name: 'Home', component: Home},//路由线路 链接到Home.vue
    {path: '/User', name: 'User', component: User},
    {path: '/Student', name: 'Student', component: Student},
    {path: '/Mark', name: 'Mark', component: Mark},
    {path: '/Fly', name: 'Fly', component: Fly},
    {path: '/PlayFly', name: 'PlayFly', component: PlayFly},
    {path: '/FlyTest', name: 'FlyTest', component: FlyTest},
    {path: '/FlyCafuc',component: FlyCafuc,
      children:[
        {path: '/Fly', name: 'Fly', component: Fly},
        {path: '/PlayFly', name: 'PlayFly', component: PlayFly},
        {path: '/FlyTest', name: 'FlyTest', component: FlyTest},
      ]
    }
  ]
})
