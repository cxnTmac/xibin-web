import {pages,routes } from '../../../routes';
const state = {
    routers: routes,
    addRouters: []
}
const mutations = {
    SET_ROUTERS: (state, routers) => {
        state.addRouters = routers;
        state.routers = routes.concat(routers);
    }
}
const actions = {
    GenerateRoutes({ commit },data){
        return new Promise(resolve => {
            commit('SET_ROUTERS', data);
            resolve();
        });
    }
}
export default {
    state,
    mutations,
    actions
}

