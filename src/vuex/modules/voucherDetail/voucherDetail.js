const state = {
    voucherId: '',
    status:''
}
const mutations = {
    changeVoucherId (state, newVoucherId) {
        state.voucherId = newVoucherId
    },
    changeVoucherStatus (state, newStatus) {
        state.status = newStatus
    }
}
export default {
    state,
    mutations
}

