/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getZoneListPage = params => { return axios.get(`/xibin/zone/showAllZone`, { params: params }); };

export const removeZone = params => { return axios.get(`/xibin/zone/removeZone`, { params: params }); };

export const batchRemoveZone = params => { return axios.post(`/xibin/zone/batchRemove`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const saveZone = params => { return axios.get(`/xibin/zone/saveZone`, { params: params }); };


