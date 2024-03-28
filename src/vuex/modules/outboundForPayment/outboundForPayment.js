const state = {
    filters:{
        orderNo: '',
        buyerCode:'',
        orderTimeFm:'',
        orderTimeTo:'',
        outboundType:'',
        isRecievedCash:'',
		paymentCategory:'',
        status:''
    },
    fromPath:'',
    locationId:''
}
const mutations = {
    changeOutboundFilters (state, filters) {
        state.filters = filters
    },
    changeOutboundPaymentFromPath (state, fromPath) {
        state.fromPath = fromPath
    },
    changeOutboundPaymentLocationId (state, locationId) {
        state.locationId = locationId
    }
}
export default {
    state,
    mutations
}

