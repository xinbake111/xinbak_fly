<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="200px">
        <el-menu :default-openeds="['1']">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-caret-right"></i>飞行模拟
            </template>
            <el-menu-item index="1-1">
              <router-link to="/PlayFly">飞行模拟-控制</router-link>
            </el-menu-item>
            <el-menu-item index="1-2">
              <router-link to="/FlyTest">飞行测试-控制</router-link>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        </el-aside>

        <el-main>    <router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>

</template>
<script>

  export default {//es6语法暴露组件
    //app.vue为主入口组件
    name:"App",
    data(){
      return{
      }
    },
    methods:{

    },
    created() {
      this.test();
    }
  }

</script>
<style>
  .aa{
    background-color: #00ffb7;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
</style>
