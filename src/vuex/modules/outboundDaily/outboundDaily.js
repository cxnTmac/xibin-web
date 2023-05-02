const state = {
    filters:{
        orderNo: '',
        buyerCode:'',
        orderDate:'',
        outboundType:'',
        status:''
    },
    page:1
}
const mutations = {
    changeOutboundDailyFilters (state, filters) {
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

