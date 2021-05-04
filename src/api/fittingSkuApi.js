/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getFittingSkuListPage = params => { return axios.get(`/xibin/fittingSku/showAllFittingSku`, { params: params }); };

export const getFittingSkuAssemble = params => { return axios.get(`/xibin/fittingSku/querySkuAssembleByFSkuCode`, { params: params }); };

// export const saveFittingSkuAssemble = params => { return axios.get(`/xibin/fittingSku/saveSkuAssemble`, { params: params }); };

export const saveFittingSkuAssemble = params => { return axios.post(`/xibin/fittingSku/saveSkuAssemble`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const removeFittingSku = params => { return axios.get(`/xibin/fittingSku/removeFittingSku`, { params: params }); };

export const batchRemoveFittingSku = params => { return axios.post(`/xibin/fittingSku/batchRemove`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const saveFittingSku = params => { return axios.get(`/xibin/fittingSku/saveFittingSku`, { params: params }); };

export const getFittingSkuPic = params => { return axios.get(`/xibin/fittingSku/getFittingSkuPic`, { params: params }); };

export const removeFittingSkuPic = params => { return axios.get(`/xibin/fittingSku/removeFittingSkuPic`, { params: params }); };

