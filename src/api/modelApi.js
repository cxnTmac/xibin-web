/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getModelListPage = params => { return axios.get(`/xibin/model/showAllModel.shtml`, { params: params }); };

export const removeModel = params => { return axios.get(`/xibin/model/removeModel.shtml`, { params: params }); };

export const saveModel = params => { return axios.get(`/xibin/model/saveModel.shtml`, { params: params }); };

