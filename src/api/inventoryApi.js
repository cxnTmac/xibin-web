/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getInventoryListPage = params => { return axios.get(`/xibin/inventory/showAllInventory`, { params: params }); };

export const getAvailbleInventoryListPage = params => { return axios.get(`/xibin/inventory/showAllAvailbleInventory`, { params: params }); };

export const queryAvaiableInventorySum = params => { return axios.get(`/xibin/inventory/queryAvaiableInventorySum`, { params: params }); };

export const move = params => { return axios.get(`/xibin/inventory/move`, { params: params }); };

export const transfer = params => { return axios.get(`/xibin/inventory/transfer`, { params: params }); };

export const add = params => { return axios.get(`/xibin/inventory/add`, { params: params }); };
export const queryAvaiableInventorySumBySkuCode = params => { return axios.get(`/xibin/inventory/queryAvaiableInventorySumBySkuCode`, { params: params }); };
// export const removeFittingSkuPic = params => { return axios.get(`/xibin/fittingSku/removeFittingSkuPic `, { params: params }); };

