const state = {
    voucherID: '',
    status:'',
    fromPath:'',
    voucherEntity:{
        voucher:null,
        list:[],
        ids:[]
    }
}
const mutations = {
    changeVoucherID (state, newVoucherID) {
        state.voucherID = newVoucherID
    },
    changeVoucherStatus (state, newStatus) {
        state.status = newStatus
    },
    changeVoucherEntity (state, voucherEntity) {
        state.voucherEntity = voucherEntity
    },
    changeVoucherFromPath (state, fromPath) {
        state.fromPath = fromPath
    }
}
export default {
    state,
    mutations
}

