import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import fittingType from './views/basicdata/fittingType.vue'
import model from './views/basicdata/model.vue'
import sku from './views/basicdata/sku.vue'
import area from './views/basicdata/area.vue'
import zone from './views/basicdata/zone.vue'
import loc from './views/basicdata/loc.vue'
import customer from './views/basicdata/customer.vue'
import inbound from './views/inbound/inbound.vue'
import inboundDetail from './views/inbound/inboundDetail.vue'
import outbound from './views/outbound/outbound.vue'
import outboundDetail from './views/outbound/outboundDetail.vue'
import inventory from './views/inventory/inventory.vue'
import actTran from './views/inventory/actTran.vue'
import createVoucherByInbound from './views/finace/createVoucherByInbound.vue'
import createVoucherByOutbound from './views/finace/createVoucherByOutbound.vue'
import financeHome from './views/finace/financeHome.vue'
import course from './views/finace/course.vue'
import voucher from './views/finace/voucher.vue'
import voucherDetail from './views/finace/voucherDetail.vue'
import generalLedger from './views/finace/generalLedger.vue'
import accountBalance from './views/finace/accountBalance.vue'
import credentialSummary from './views/finace/credentialSummary.vue'
import assembleOrder from './views/assemble/assembleOrder.vue'
import assembleDetail from './views/assemble/assembleDetail.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: 'Table' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '仓库基础数据',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/fittingType', component: fittingType, name: '配件类型'},
            { path: '/model', component: model, name: '车型' },
            { path: '/sku', component: sku, name: '产品' },
            { path: '/area', component: area, name: '区域' },
            { path: '/zone', component: zone, name: '库区' },
            { path: '/loc', component: loc, name: '库位' },
            { path: '/customer', component: customer, name: '客户' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '入库管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/inboundOrder', component: inbound, name: '入库单'},
            { path: '/inboundDetail', component: inboundDetail, name: '入库单详细',hidden:true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '出库管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/outboundOrder', component: outbound, name: '出库单'},
            { path: '/outboundDetail', component: outboundDetail, name: '出库单详细',hidden:true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '库存',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/inventory', component: inventory, name: '库存查询'},
            { path: '/actTran', component: actTran, name: '库存记录查询'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '组装',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/assembleOrder', component: assembleOrder, name: '组装订单'},
            { path: '/assembleDetail', component: assembleDetail, name: '组装单详细',hidden:true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '财务',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/financeHome', component: financeHome, name: '财务首页'},
            { path: '/createVoucherByInbound', component: createVoucherByInbound, name: '生成入库凭证'},
            { path: '/createVoucherByOutbound', component: createVoucherByOutbound, name: '生成出库凭证'},
            { path: '/course', component: course, name: '科目'},
            { path: '/voucher', component: voucher, name: '凭证'},
            { path: '/voucherDetail', component: voucherDetail, name: '凭证分录',hidden:true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '财务账簿',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/generalLedger', component: generalLedger, name: '总账'},
            { path: '/accountBalance', component: accountBalance, name: '科目余额表'},
            { path: '/credentialSummary', component: credentialSummary, name: '凭证汇总表'}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;