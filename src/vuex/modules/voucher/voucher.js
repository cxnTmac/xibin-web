const state = {
    filters:{
        dateFm:'',
        dateTo:''
    },
    page:1
}
const mutations = {
    changeVoucherFilters (state, filters) {
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

