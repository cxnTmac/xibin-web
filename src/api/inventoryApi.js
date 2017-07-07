/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getInventoryListPage = params => { return axios.get(`/xibin/inventory/showAllInventory.shtml`, { params: params }); };


// export const removeFittingSkuPic = params => { return axios.get(`/xibin/fittingSku/removeFittingSkuPic.shtml`, { params: params }); };

