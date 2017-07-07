const state = {
    orderNo: '',
    status:''
}
const mutations = {
    changeInboundOrderNo (state, newOrderNo) {
        state.orderNo = newOrderNo
    },
    changeInboundStatus (state, newStatus) {
        state.status = newStatus
    }
}
export default {
    state,
    mutations
}

