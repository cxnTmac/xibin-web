import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import inboundDetail from './modules/inboundDetail/inboundDetail'
import outboundDetail from './modules/outboundDetail/outboundDetail'
import voucherDetail from './modules/voucherDetail/voucherDetail'
import assembleDetail from './modules/assembleDetail/assembleDetail'

Vue.use(Vuex)

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    modules: {
        'inboundDetail': inboundDetail,
        'outboundDetail': outboundDetail,
        'voucherDetail': voucherDetail,
        'assembleDetail': assembleDetail
    }
})