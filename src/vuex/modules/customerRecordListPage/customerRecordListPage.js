const state = {
    filters:{
        customerCode: '',
        dateFm:'',
        dateTo:'',
        type:''
    },
    page:1
}
const mutations = {
    changeCustomerRecordListPageFilters (state, filters) {
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

