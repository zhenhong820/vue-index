//导入 Vue 
import Vue from 'vue'
//导入路由
import VueRouter from 'vue-router'
//use 一下
Vue.use(VueRouter)


//导入组件
//他会默认找到文件夹 index.js 没有再找index.vue
import login from '../views/login'
import home from '../views/home'

//准备路由规则 映射组件
const routes = [{
    path: '/login',
    component: login
},{
    path:'/home',
    component:home
}]

//创建router 实例 传给 routes 配置
const router = new VueRouter({
    routes
})

//默认暴露 (默认导出)
//把router 这个对象暴露出去
export default router;