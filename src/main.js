import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//导入
import router from './router/index.js'

//导入全局默认基础样式
import './assets/css/base.css'

//导入饿了 uI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

new Vue({
   //挂载路由
   router,
  render: h => h(App),
}).$mount('#app')
