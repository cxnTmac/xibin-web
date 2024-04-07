const state = {
    filters:{
        fyear:'',
        fperiod:''
    }
}
const mutations = {
    changeCarryForwardFilters (state, filters) {
        state.filters = filters
    }
}
export default {
    state,
    mutations
}

