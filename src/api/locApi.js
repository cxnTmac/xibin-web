/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getLocListPage = params => { return axios.get(`/xibin/loc/showAllLoc`, { params: params }); };

export const removeLoc = params => { return axios.get(`/xibin/loc/removeLoc`, { params: params }); };

export const batchRemoveLoc = params => { return axios.post(`/xibin/loc/batchRemove`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const saveLoc = params => { return axios.get(`/xibin/loc/saveLoc`, { params: params }); };


