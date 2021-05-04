const state = {
    filters: {
        buyerCode: "",
        fittingSkuCode: "",
        fittingSkuName: "",
        modelCode:"",
        headerStatus: "",
        outboundTypes:[],
        orderTimeFm:null,
        orderTimeTo:null
      }
}
const mutations = {
    changeOutboundSkuQueryFilters (state, filters) {
        state.filters = filters
    }
}
export default {
    state,
    mutations
}

