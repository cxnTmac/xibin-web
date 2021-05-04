/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getSkuGroupListPage = params => { return axios.get(`/xibin/skuGroup/showAllSkuGroup`, { params: params }); };

export const removeSkuGroup = params => { return axios.get(`/xibin/skuGroup/removeSkuGroup`, { params: params }); };

export const batchRemoveSkuGroup = params => { return axios.post(`/xibin/skuGroup/batchRemove`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const saveSkuGroup = params => { return axios.get(`/xibin/skuGroup/saveSkuGroup`, { params: params }); };

export const getSkuGroupQueryItemByGroupCode = params => { return axios.get(`/xibin/skuGroup/getSkuGroupQueryItemByGroupCode`, { params: params }); };
