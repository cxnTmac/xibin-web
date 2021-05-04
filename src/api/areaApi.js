/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getAreaListPage = params => { return axios.get(`/xibin/area/showAllArea`, { params: params }); };

export const removeArea = params => { return axios.get(`/xibin/area/removeArea`, { params: params }); };

export const batchRemoveArea = params => { return axios.post(`/xibin/area/batchRemove`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const saveArea = params => { return axios.get(`/xibin/area/saveArea`, { params: params }); };


