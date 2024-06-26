import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import inboundDetail from './modules/inboundDetail/inboundDetail'
import inbound from './modules/inbound/inbound'
import outboundDetail from './modules/outboundDetail/outboundDetail'
import outbound from './modules/outbound/outbound'
import outboundForPayment from './modules/outboundForPayment/outboundForPayment'
import outboundSkuQuery from './modules/outboundSkuQuery/outboundSkuQuery'
import voucherDetail from './modules/voucherDetail/voucherDetail'
import voucher from './modules/voucher/voucher'
import carryForward from './modules/carryForward/carryForward'
import assembleDetail from './modules/assembleDetail/assembleDetail'
import roleFunctions from './modules/roleFunctions/roleFunctions'
import outboundDaily from './modules/outboundDaily/outboundDaily'
import customerRecord from './modules/customerRecord/customerRecord'
import customerRecordListPage from './modules/customerRecordListPage/customerRecordListPage'
Vue.use(Vuex)

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    modules: {
        'inboundDetail': inboundDetail,
        'inbound': inbound,
        'outboundDetail': outboundDetail,
        'outbound': outbound,
        'voucherDetail': voucherDetail,
        'voucher': voucher,
        'assembleDetail': assembleDetail,
        'roleFunctions':roleFunctions,
        'outboundSkuQuery':outboundSkuQuery,
        'outboundDaily':outboundDaily,
        'customerRecord':customerRecord,
        'customerRecordListPage':customerRecordListPage,
        'outboundForPayment':outboundForPayment,
        'carryForward':carryForward
    }
})