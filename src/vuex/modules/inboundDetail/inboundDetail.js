const state = {
    orderNo: '',
    status:'',
    fromPath:''
}
const mutations = {
    changeInboundOrderNo (state, newOrderNo) {
        state.orderNo = newOrderNo
    },
    changeInboundStatus (state, newStatus) {
        state.status = newStatus
    },
    changeInboundDetailFromPath (state, fromPath) {
        state.fromPath = fromPath
    }
}
export default {
    state,
    mutations
}

