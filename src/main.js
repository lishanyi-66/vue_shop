import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ZkTable from 'vue-table-with-tree-grid'
import moment from "moment"
Vue.component('tree-table', ZkTable)
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/iconfont/iconfont.css'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor, /* { default global options } */)
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
//全局过滤器
Vue.filter('dataFormat',(v)=>{
  return moment(v).format('YYYY-MM-DD hh:mm:ss')
})
// Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
