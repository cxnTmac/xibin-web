const state = {
    orderNo: '',
    status:'',
    fromPath:''
}
const mutations = {
    changeOutboundOrderNo (state, newOrderNo) {
        state.orderNo = newOrderNo
    },
    changeOutboundStatus (state, newStatus) {
        state.status = newStatus
    },
    changeOutboundDetailFromPath (state, fromPath) {
        state.fromPath = fromPath
    }
}
export default {
    state,
    mutations
}

