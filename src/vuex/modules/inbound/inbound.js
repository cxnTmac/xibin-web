const state = {
    filters: {
        orderNo: '',
        status:'',
        supplierCode:'',
        orderTimeFm:'',
        orderTimeTo:'',
        inboundType:''
    }
}
const mutations = {
    changeInboundFilters (state, filters) {
        state.filters = filters
    },
    changePage (state, page) {
        state.page = page
    }
}
export default {
    state,
    mutations
}

