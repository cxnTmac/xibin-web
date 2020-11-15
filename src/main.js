import babelpolyfill from "babel-polyfill";
import Vue from "vue";
import App from "./App";
import "lib-flexible";
import ElementUI from "element-ui";

// import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
// import './assets/theme/theme-xibin/index.css'
import "element-ui/lib/theme-chalk/index.css";
//import './theme/index.css'
import VueRouter from "vue-router";

import store from "@/vuex";
import Vuex from "vuex";
import { getAllRoleFunctions } from "./api/sysApi";
import util from "./util/util";
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import {
  convertRole2FunctionForBtnAndColumn,
  convertRole2FunctionForMenu,
  routes,
} from "./routes";
// import Mock from './mock'
// Mock.bootstrap();
import "font-awesome/css/font-awesome.min.css";
import LoginPopWin from "loginPopWin";
// 复制到剪切板
import VueClipboard from "vue-clipboard2";
// excel导出
import JsonExcel from "vue-json-excel";

Vue.use(LoginPopWin);
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueClipboard);
Vue.component("downloadExcel", JsonExcel);
// NProgress.configure({ showSpinner: false });
// import BaiduMap from "vue-baidu-map-v3";
// Vue.use(BaiduMap, {
//   /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
//   ak: "B8rPYxxiwZXHqylhc7XK1u0phwQAo7gI",
// });

const router = new VueRouter({
  // 加载必须的页面（登陆和404）
  routes,
});
Vue.directive("title", {
  inserted: function (el, binding) {
    document.title = el.dataset.title;
  },
});
// Vue.directive('focus', function (el, option) {
//     var defClass = 'el-input', defTag = 'input';
//     var value = option.value || true;
//     if (typeof value === 'boolean')
//         value = { cls: defClass, tag: defTag, foc: value };
//     else
//         value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false };
//     for(let i =0;i<el.classList.length;i++){
//         if(el.classList[i].indexOf(value.cls)>=0&& value.foc){
//             el.getElementsByTagName(value.tag)[0].focus();
//             return;
//         }
//     }
// });

router.beforeEach((to, from, next) => {
  //如果是要访问登陆页面
  if (to.path === "/login") {
    localStorage.removeItem("user");
    localStorage.removeItem("overTime");
    next();
  } else {
    //不是访问登陆页面
    //获取用户信息
    let user = JSON.parse(localStorage.getItem("user"));
    let overTime = localStorage.getItem("overTime");
    // 过期标识,默认是过期
    let overTimeFlag = true;
    // 判断是否过期
    if (user) {
      if (overTime >= new Date().getTime()) {
        // 表示未过期
        overTimeFlag = false;
      }
    }
    //用户信息不存在
    if (!user && to.path !== "/login") {
      next({ path: "/login" });
    } else if (user && overTimeFlag) {
      // 有用户信息但是 已过期
      next({ path: "/login" });
    } else if (to.path === "/") {
      // 目标路径是登陆界面或者用户已登陆
      next({ path: "/echarts" });
    } else {
      //用户信息存在,并且没有过期
      //判断vuex中是否存储权限信息，如果不存在则获取
      // 该情况多见于刷新以及打开新页面
      if (store.state.roleFunctions.addRouters.length === 0) {
        getAllRoleFunctions()
          .then((res) => {
            let roles = convertRole2FunctionForMenu(res.data);
            //let btnsAndColumns
            let btnsAndColumns = convertRole2FunctionForBtnAndColumn(res.data);
            //console.log(roles)
            if (roles.length >= 0) {
              store
                .dispatch("GenerateRoutes", {
                  btnsAndColumns: btnsAndColumns,
                  routers: roles,
                })
                .then(() => {
                  router.addRoutes(store.state.roleFunctions.addRouters);
                  next({ path: to.redirectedFrom });
                });
            } else {
              alert("获取权限数据错误，请联系管理员！");
            }
          })
          .catch((data) => {
            if (data.response.status === 504) {
              alert("远程服务器没有启动，请联系管理员！");
            }
            if (data.response.status === 401) {
              alert("登陆已经失效/过期，请重新登陆");
              next({ path: "/login" });
            }
          });
      }
      next();
    }
  }
});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: (h) => h(App),
}).$mount("#app");
