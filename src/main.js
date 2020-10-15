import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/iconfont/iconfont.css'
import axios from 'axios'
// 配置请求路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config)
  return config

})
// Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
