import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'

// import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
// import './assets/theme/theme-xibin/index.css'
import 'element-ui/lib/theme-chalk/index.css'
//import './theme/index.css'
import VueRouter from 'vue-router'

import store from '@/vuex'
import Vuex from 'vuex'
import {getAllRoleFunctions} from './api/sysApi'
import util from './util/util'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import {pages,remoteRoutes,routes} from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import LoginPopWin from 'loginPopWin'
Vue.use(LoginPopWin)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

// NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})


router.beforeEach((to, from, next) => {
    //如果是要访问登陆页面
    if (to.path === '/login') {
        localStorage.removeItem('user');
        localStorage.removeItem('overTime');
        next()
    }else{
        //不是访问登陆页面
        //获取用户信息
        let user = JSON.parse(localStorage.getItem('user'));
        let overTime = localStorage.getItem('overTime')
        // 过期标识,默认是过期
        let overTimeFlag = true
        // 判断是否过期
        if (user) {
            if (overTime >= new Date().getTime()) {
                // 表示未过期
                overTimeFlag = false
            }
        }
        //用户信息不存在
        if(!user && to.path !== '/login'){
            next({ path: '/login' })
        } else if (user && overTimeFlag) {
            // 有用户信息但是 已过期
            next({path: '/login'})
        } else if (to.path === '/') {
            // 目标路径是登陆界面或者用户已登陆
            next({ path: '/echarts' })
        }else{
            //用户信息存在,并且没有过期
            //判断vuex中是否存储权限信息，如果不存在则获取
            if(store.state.roleFunctions.addRouters.length == 0){
                getAllRoleFunctions().then((res) => {
                    let roles = res.data.data;
                    roles = remoteRoutes;//暂时用静态数据代替
                    //NProgress.done();
                    if(res.data.code == 200){
                        store.dispatch('GenerateRoutes',roles).then(()=>{
                            console.log(store.state.roleFunctions.addRouters);
                            //sessionStorage.setItem('roles',JSON.stringify(store.state.roleFunctions.addRouters))
                            router.addRoutes(store.state.roleFunctions.addRouters);
                            next({ ...to, replace: true })
                        });
                    }else{
                        alert(res.data.msg);
                    }
                }).catch((data) => {
                    if(data.response.status === 504){
                        alert("远程服务器没有启动，请联系管理员！");
                    }
                    if(data.response.status === 401){
                        alert("登陆已经失效/过期，请重新登陆");
                        next({path: '/login'})
                    }
                });
            }
            next()
        }
    }
})



// router.beforeEach((to, from, next) => {
//   //NProgress.start();
//   if (to.path === '/login') {
//     sessionStorage.removeItem('user');
//   }
//   let user = JSON.parse(sessionStorage.getItem('user'));
//   if (!user && to.path !== '/login') {
//     next({ path: '/login' })
//   } else {
//       if(store.state.roleFunctions.addRouters.length == 0){
//           getAllRoleFunctions().then((res) => {
//               let roles = res.data.data;
//               roles = remoteRoutes;
//               //NProgress.done();
//               if(res.data.code == 200){
//                   store.dispatch('GenerateRoutes',roles).then(()=>{
//                       console.log(store.state.roleFunctions.addRouters);
//                       sessionStorage.setItem('roles',JSON.stringify(store.state.roleFunctions.addRouters))
//                       router.addRoutes(store.state.roleFunctions.addRouters);
//                       next({ ...to, replace: true })
//                   });
//               }else{
//                   alert(res.data.msg);
//               }
//           }).catch((data) => {
//               alert(data);
//           });
//       }
//   }
//     next()
//   })

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

