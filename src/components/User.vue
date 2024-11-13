<template>
  <div>
  <h1>用户模块</h1>
    <table border="1" >
    <tr>
      <td>编号</td>
      <td>ID</td>
      <td>姓名</td>
      <td>年龄</td>
      <td>联系方式</td>
    </tr>
      <tr v-for="(user,i) in user">
        <td>{{i+1}}</td>
        <td>{{user.id}}</td>
        <td>{{user.name}}</td>
        <td>{{user.age}}</td>
        <td>{{user.phone}}</td>
      </tr>
    </table>
    <Foot></Foot>

  </div>
</template>

<script>
  import Foot from "./Foot";
    export default {
        name: "User",
      data(){
          return{
        user:[
          {id:"1",name:"xinbake",age:"20",phone:"110"},
          {id:"2",name:"xinbake2",age:"202",phone:"1102"}
        ]
          }
      },
      components: {Foot},


    }
</script>

<style scoped>

</style>
