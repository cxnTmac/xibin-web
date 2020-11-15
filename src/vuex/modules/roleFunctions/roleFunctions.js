import {routes } from '../../../routes';
const state = {
    //按钮和数据列权限
    btnsAndColumns:[],
    // 菜单权限
    routers: routes,
    // 新增进来的菜单权限
    addRouters: []
}
const mutations = {
    SET_ROUTERS: (state, data) => {
        state.btnsAndColumns = data.btnsAndColumns;
        state.addRouters = data.routers;
        state.routers = routes.concat(data.routers);
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

