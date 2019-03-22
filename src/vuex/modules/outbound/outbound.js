const state = {
    filters:{
        orderNo: '',
        buyerCode:'',
        orderTimeFm:'',
        orderTimeTo:'',
        outboundType:'',
        status:''
    },
    page:1
}
const mutations = {
    changeOutboundFilters (state, filters) {
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

