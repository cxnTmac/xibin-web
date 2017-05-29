/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getFittingSkuListPage = params => { return axios.get(`/xibin/fittingSku/showAllFittingSku.shtml`, { params: params }); };

export const removeFittingSku = params => { return axios.get(`/xibin/fittingSku/removeFittingSku.shtml`, { params: params }); };

export const batchRemoveFittingSku = params => { return axios.post(`/xibin/fittingSku/batchRemove.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const saveFittingSku = params => { return axios.get(`/xibin/fittingSku/saveFittingSku.shtml`, { params: params }); };

