const state = {
    orderNo: '',
    status:''
}
const mutations = {
    changeOutboundOrderNo (state, newOrderNo) {
        state.orderNo = newOrderNo
    },
    changeOutboundStatus (state, newStatus) {
        state.status = newStatus
    }
}
export default {
    state,
    mutations
}

