const state = {
    filters:{
        customerCode: '',
        customerName: '',
        dateFm:'',
        dateTo:'',
        type:''
    },
    fromPath:'',
    page:1
}
const mutations = {
    changeCustomerRecordFilters (state, filters) {
        state.filters = filters
    },
    changePage (state, page) {
        state.page = page
    },
    changeCustomerRecordFromPath (state, fromPath) {
        state.fromPath = fromPath
    }
}
export default {
    state,
    mutations
}

