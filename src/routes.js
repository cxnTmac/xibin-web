import Login from "./views/Login.vue";
import NotFound from "./views/404.vue";
import Home from "./views/Home.vue";
import Main from "./views/Main.vue";
import fittingType from "./views/basicdata/fittingType.vue";
import model from "./views/basicdata/model.vue";
import sku from "./views/basicdata/sku.vue";
import skuGroup from "./views/basicdata/skuGroup.vue";
import anotherName from "./views/basicdata/anotherName.vue";
import area from "./views/basicdata/area.vue";
import zone from "./views/basicdata/zone.vue";
import loc from "./views/basicdata/loc.vue";
import customer from "./views/basicdata/customer.vue";
import inbound from "./views/inbound/inbound.vue";
import inboundDetail from "./views/inbound/inboundDetail.vue";
import inboundSkuQuery from "./views/inbound/inboundSkuQuery.vue";
import outbound from "./views/outbound/outbound.vue";
import outboundDetail from "./views/outbound/outboundDetail.vue";
import outboundSkuQuery from "./views/outbound/outboundSkuQuery.vue";
import inventory from "./views/inventory/inventory.vue";
import actTran from "./views/inventory/actTran.vue";
import move from "./views/inventory/move.vue";
import createVoucherByInbound from "./views/finace/createVoucherByInbound.vue";
import createVoucherByOutbound from "./views/finace/createVoucherByOutbound.vue";
import createCostVoucherByOutbound from "./views/finace/createCostVoucherByOutbound.vue";
import createCostVoucherByInbound from "./views/finace/createCostVoucherByInbound.vue";
import financeHome from "./views/finace/financeHome.vue";
import course from "./views/finace/course.vue";
import voucher from "./views/finace/voucher.vue";
import voucherDetail from "./views/finace/voucherDetail.vue";
import generalLedger from "./views/finace/generalLedger.vue";
import accountBalance from "./views/finace/accountBalance.vue";
import credentialSummary from "./views/finace/credentialSummary.vue";
import assembleOrder from "./views/assemble/assembleOrder.vue";
import assembleDetail from "./views/assemble/assembleDetail.vue";
import company from "./views/sys/company.vue";
import user from "./views/sys/user.vue";
import role from "./views/sys/role.vue";
import functions from "./views/sys/functions.vue";
import report from "./views/finace/report.vue";
import echarts from "./views/charts/echarts.vue";
import provinceSaleCharts from "./views/charts/provinceSaleCharts.vue";
import saleLineCharts from "./views/charts/saleLineCharts.vue";

export const pages = {
  login: Login,
  NotFound: NotFound,
  Home: Home,
  Main: Main,
  echarts: echarts,
  fittingType: fittingType,
  model: model,
  sku: sku,
  anotherName: anotherName,
  skuGroup: skuGroup,
  area: area,
  zone: zone,
  loc: loc,
  customer: customer,
  inbound: inbound,
  inboundDetail: inboundDetail,
  inboundSkuQuery: inboundSkuQuery,
  outbound: outbound,
  outboundDetail: outboundDetail,
  outboundSkuQuery: outboundSkuQuery,
  inventory: inventory,
  actTran: actTran,
  createVoucherByInbound: createVoucherByInbound,
  createVoucherByOutbound: createVoucherByOutbound,
  createCostVoucherByOutbound: createCostVoucherByOutbound,
  createCostVoucherByInbound: createCostVoucherByInbound,
  financeHome: financeHome,
  course: course,
  voucher: voucher,
  voucherDetail: voucherDetail,
  generalLedger: generalLedger,
  accountBalance: accountBalance,
  credentialSummary: credentialSummary,
  assembleOrder: assembleOrder,
  assembleDetail: assembleDetail,
  company: company,
  move: move,
  user: user,
  role: role,
  report: report,
  functions: functions,
  provinceSaleCharts: provinceSaleCharts,
  saleLineCharts:saleLineCharts
};
export const convertRole2FunctionForBtnAndColumn = function (role2Functions) {
  // 获取到所有的页面权限
  let pageFunctions = role2Functions.filter(function (role2Function) {
    return role2Function.type === "M" && role2Function.path != "/";
  });
  // 获取到所有的非菜单权限（按钮/数据列）
  let btnAndColumnFunctions = role2Functions.filter(function (role2Function) {
    return role2Function.type != "M";
  });
  // 将对应的按钮/数据的权限放到页面权限的btnsAndColumns属性下
  for (let i = 0; i < pageFunctions.length; i++) {
    pageFunctions[i].btnsAndColumns = [];
    for (let j = 0; j < btnAndColumnFunctions.length; j++) {
      if (btnAndColumnFunctions[j].fId === pageFunctions[i].id) {
        pageFunctions[i].btnsAndColumns.push(btnAndColumnFunctions[j]);
      }
    }
  }
  return pageFunctions;
};
export const convertRole2FunctionForMenu = function (role2Functions) {
  let rootNode = {
    functionCode: "00",
    functionName: "根节点",
    component: "",
    path: "",
    fId: null,
    icon: "",
    type: "M",
    id: -1,
    children: [],
  };
  // 获取到所有的菜单权限
  role2Functions = role2Functions.filter(function (role2Function) {
    return role2Function.type === "M";
  });
  for (let i = 0; i < role2Functions.length; i++) {
    //赋值给name字段，保证路由的name字段有值
    role2Functions[i]["name"] = role2Functions[i].functionName;
    // role2Functions[i]['hidden'] = role2Functions[i].enable === 'Y'?false:true;
    //将component字符串替换成页面对象
    if (role2Functions[i].path === "/") {
      role2Functions[i].component = pages.Home;
    } else {
      role2Functions[i].component = pages[role2Functions[i].component];
    }
  }
  role2Functions.push(rootNode);
  toTree(role2Functions);
  return role2Functions[0].children;
};
Array.prototype.remove = function (index) {
  if (isNaN(index) || index >= this.length) {
    return false;
  }
  for (var i = 0, n = 0; i < this.length; i++) {
    if (this[i] != this[index]) {
      this[n++] = this[i];
    }
  }
  this.length -= 1;
};
function toTree(role2Functions) {
  if (role2Functions.length === 1) {
    return;
  } else {
    for (let i = 0; i < role2Functions.length; i++) {
      // 计算数组被裁剪的数量，每次找到一个子节点数组就会减小1
      for (let j = 0; j < role2Functions.length; j++) {
        if (j === i) {
          continue;
        }
        if (role2Functions[j].fId === role2Functions[i].id) {
          let children = role2Functions[i]["children"];
          if (children === undefined) {
            role2Functions[i]["children"] = [];
          }
          // 放入子节点
          role2Functions[i]["children"].push(role2Functions[j]);
          role2Functions.remove(j);
          // 记录数组变化
          if (j < i) {
            i--;
          }
          // 数组尺寸发生变化，下标改变
          j--;
        }
      }
    }
    toTree(role2Functions);
  }
}

export const routes = [
  {
    path: "/login",
    component: Login,
    name: "登陆",
    hidden: true,
  },
  {
    path: "/404",
    component: NotFound,
    name: "",
    hidden: true,
  },
  {
    path: "*",
    hidden: true,
    redirect: { path: "/404" },
  },
  {
    path: "/",
    redirect: { path: "/login" }
  }
];
export const remoteRoutes = [
  // {
  //     path: '/',
  //     component: Home,
  //     name: '导航一',
  //     iconCls: 'el-icon-message',//图标样式class
  //     children: [
  //         { path: '/main', component: Main, name: '主页', hidden: true },
  //         { path: '/form', component: Form, name: 'Form' },
  //         { path: '/user', component: user, name: '列表' },
  //     ]
  // },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '导航二',
  //     iconCls: 'fa fa-id-card-o',
  //     children: [
  //         { path: '/page4', component: Page4, name: '页面4' },
  //         { path: '/page5', component: Page5, name: '页面5' }
  //     ]
  // },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '导航三',
  //     iconCls: 'fa fa-address-card',
  //     leaf: true,//只有一个节点
  //     children: [
  //         { path: '/page6', component: Page6, name: '页面6' }
  //     ]
  // },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '数据中心',
  //     iconCls: 'el-icon-picture',
  //     children: [
  //         { path: '/echarts', component: echarts, name: '数据图表' },
  //         { path: '/cases', component: cases, name: 'cases' }
  //     ]
  // },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '仓库基础数据',
  //     iconCls: 'el-icon-goods',//图标样式class
  //     children: [
  //         { path: '/fittingType', component: fittingType, name: '配件类型'},
  //         { path: '/model', component: model, name: '车型' },
  //         { path: '/sku', component: sku, name: '产品' },
  //         { path: '/anotherName', component: anotherName, name: '产品别名' },
  //         { path: '/skuGroup', component: skuGroup, name: '通用组' },
  //         { path: '/area', component: area, name: '区域' },
  //         { path: '/zone', component: zone, name: '库区' },
  //         { path: '/loc', component: loc, name: '库位' },
  //         { path: '/customer', component: customer, name: '客户' }
  //     ]
  // },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '入库管理',
  //     iconCls: 'el-icon-download',//图标样式class
  //     children: [
  //         { path: '/inboundOrder', component: inbound, name: '入库单'},
  //         { path: '/inboundDetail', component: inboundDetail, name: '入库单详细',hidden:true},
  //         { path: '/inboundSkuQuery', component: inboundSkuQuery, name: '入库产品查询'}
  //     ]
  // },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '出库管理',
  //     iconCls: 'el-icon-upload2',//图标样式class
  //     children: [
  //         { path: '/outboundOrder', component: outbound, name: '出库单'},
  //         { path: '/outboundDetail', component: outboundDetail, name: '出库单详细',hidden:true},
  //         { path: '/outboundSkuQuery', component: outboundSkuQuery, name: '出库产品查询'}
  //     ]
  // },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '库存',
  //     iconCls: 'el-icon-menu',//图标样式class
  //     children: [
  //         { path: '/inventory', component: inventory, name: '库存查询'},
  //         { path: '/actTran', component: actTran, name: '库存记录查询'},
  //         { path: '/move', component: move, name: '库存移动'}
  //     ]
  // },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '组装',
  //     iconCls: 'el-icon-setting',//图标样式class
  //     children: [
  //         { path: '/assembleOrder', component: assembleOrder, name: '组装订单'},
  //         { path: '/assembleDetail', component: assembleDetail, name: '组装单详细',hidden:true}
  //     ]
  // },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '系统',
  //     iconCls: 'el-icon-mobile-phone',//图标样式class
  //     children: [
  //         { path: '/company', component: company, name: '公司'},
  //         { path: '/user', component: user, name: '用户'},
  //         { path: '/role', component: role, name: '角色'},
  //         { path: '/functions', component: functions, name: '功能'},
  //     ]
  // },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '财务',
  //     iconCls: 'el-icon-tickets',//图标样式class
  //     children: [
  //         { path: '/financeHome', component: financeHome, name: '财务首页'},
  //         { path: '/createVoucherByInbound', component: createVoucherByInbound, name: '生成入库凭证'},
  //         { path: '/createVoucherByOutbound', component: createVoucherByOutbound, name: '生成出库销售凭证'},
  //         { path: '/createCostVoucherByOutbound', component: createCostVoucherByOutbound, name: '生成出库成本凭证'},
  //         { path: '/createCostVoucherByInbound', component: createCostVoucherByInbound, name: '生成销售退货入库成本凭证'},
  //         { path: '/course', component: course, name: '科目'},
  //         { path: '/voucher', component: voucher, name: '凭证'},
  //         { path: '/voucherDetail', component: voucherDetail, name: '凭证分录',hidden:true}
  //     ]
  // },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '财务账簿',
  //     iconCls: 'el-icon-document',//图标样式class
  //     children: [
  //         { path: '/generalLedger', component: generalLedger, name: '总账'},
  //         { path: '/accountBalance', component: accountBalance, name: '科目余额表'},
  //         { path: '/credentialSummary', component: credentialSummary, name: '凭证汇总表'},
  //         { path: '/report', component: report, name: '报表'}
  //     ]
  // }
];
export default routes;
