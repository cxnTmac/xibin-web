import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import inboundDetail from './modules/inboundDetail/inboundDetail'
import inbound from './modules/inbound/inbound'
import outboundDetail from './modules/outboundDetail/outboundDetail'
import outbound from './modules/outbound/outbound'
import outboundSkuQuery from './modules/outboundSkuQuery/outboundSkuQuery'
import voucherDetail from './modules/voucherDetail/voucherDetail'
import assembleDetail from './modules/assembleDetail/assembleDetail'
import roleFunctions from './modules/roleFunctions/roleFunctions'

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
        'assembleDetail': assembleDetail,
        'roleFunctions':roleFunctions,
        'outboundSkuQuery':outboundSkuQuery
    }
})