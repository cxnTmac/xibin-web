/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getModelListPage = params => { return axios.get(`/xibin/model/showAllModel`, { params: params }); };

export const getAllModel = params => { return axios.get(`/xibin/model/MshowAllModel`, { params: params }); };

export const removeModel = params => { return axios.get(`/xibin/model/removeModel`, { params: params }); };

export const batchRemoveModel = params => { return axios.post(`/xibin/model/batchRemove`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };
export const saveModel = params => { return axios.get(`/xibin/model/saveModel`, { params: params }); };

