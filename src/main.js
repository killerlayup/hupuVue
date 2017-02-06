import Vue from 'vue';
import store from './vuex/store';
import VueRouter from 'vue-router';
import routes from './routers'; // 引入路由配置
import vueResource from 'vue-resource';
import infiniteScroll from 'vue-infinite-scroll'; // 引入滑动模块
import VueLazyload from 'vue-lazyload'; // 引入图片懒加载模块
import {
  loadFromlLocal
} from './common/js/store'; // 公共方法：本地缓存
import 'common/css/index.styl'; // 引入公共样式
import CovLocalDB from './util'
// 注册组件 插件使用
Vue.use(infiniteScroll);
Vue.use(VueRouter);
Vue.use(vueResource);

// error，loading是图片路径, 用require引入
Vue.use(VueLazyload, {
  error: require('./assets/404.png'),
  loading: require('./assets/loading.gif'),
  attempt: 1
});

const IMG_MAP = new CovLocalDB('vue-zhihu-img')
  //图片缓存
Vue.prototype.$covImg = (self, uri, callback) => {
  if (IMG_MAP.get(uri)) {
    return callback(IMG_MAP.get(uri))
  }

  let data = window.btoa(uri.split('').reverse().join(''))
  self.$http.get(window.location.origin + '/imagebox?type=rev-64&data=' + data)
    .then(response => {
      if (response.data.code === 200) {
        IMG_MAP.set(uri, response.data.data.url)
        callback(response.data.data.url)
      } else {
        console.log(response.data.message)
      }
    })
    .catch(err => {
      console.log(err)
    })
}
Vue.prototype.$Api = (url) => {
  return window.location.origin + '/readapi?uri=' + url
}

const router = new VueRouter({
  'linkActiveClass': 'active',
  routes // （缩写）相当于 routes: routes
});
/**
 * 创建和挂载根实例。
 * 记得要通过 router 配置参数注入路由，
 * 从而让整个应用都有路由功能
 * 把store 作为属性注入到Vue实例中
 */
const routerApp = new Vue({
  store,
  router
}).$mount('#app');

/**
 * loadFromlLocal()是读取本地缓存数据，具体common/js/store.js 查看
 *
 *
 */
if (!loadFromlLocal('gank', 'wecome', false)) {
  router.push('/wecome');
}
export default routerApp;
