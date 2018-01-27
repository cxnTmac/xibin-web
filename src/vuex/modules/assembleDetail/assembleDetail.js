const state = {
    orderNo: '',
    status:''
}
const mutations = {
    changeAssembleOrderNo (state, newOrderNo) {
        state.orderNo = newOrderNo
    },
    changeAssembleStatus (state, newStatus) {
        state.status = newStatus
    }
}
export default {
    state,
    mutations
}

