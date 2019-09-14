import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false
// 导入基础样式
import "./assets/base.css"

// 导入饿了么UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


// 引入路由对象
import router from './router/'


new Vue({
  render: h => h(App),

  // 5. 挂载到vue实例
  router
}).$mount('#app')
