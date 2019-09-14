import Vue from 'vue'
import VueRouter from 'vue-router'
// 1. 要use一下
Vue.use(VueRouter)

// 2. 导入组件 默认会导入文件夹里的index.vue
import home from '../views/home/'
import login from '../views/login/'
import article from '../views/home/article/'

// 3. 准备路由规则
const routes = [

  { path: '/login', component: login },

  { 
    path: '/home', 
    component: home,

    children:[
        // 如果子路由里不加/，代表它需要在父路由后面加这个路径 
        // { path:"article", component:article }
        // 如果加了/，就代表不需要写在父路由的后面，而是直接写路径
        { path:"/article", component:article }
    ]
  },
  // path内容为空字符串，就代表你网址后缀毛都没写
  // 参数2：不是写组件，而是写一个字符串，字符串里些它想跳转的路劲
  { path: '', redirect: '/login' },
]

// 4. 创建路由实例并使用规则
const router = new VueRouter({
  routes
})


/*
  to: 去哪
  from：从哪来
  next: 是一个函数，调用它就代表放行，不调用就是取消
*/
router.beforeEach((to, from, next) => {

  // window.console.log(to);
  // window.console.log(from);
  // next()

  // 只有home页判断是否有登录
  if (to.path == "/home") {

    // 如果登录了才放行
    let res = window.localStorage.getItem('userInfo')
    if (res) {

      next()
    } else {

      Vue.prototype.$message.error('请先登录！')
      // 否则不放行，打回登录页
      router.push('/login')
    }

  } else {
    // 别的页面直接放行
    next();
  }

})


// ES6的语法：默认导出（暴露）语法 export default 暴露的数据
export default router