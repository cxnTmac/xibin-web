/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getCaseListPage = params => { return axios.get(`/xibin/case/showAllCase.shtml`, { params: params }); };

export const removeCase = params => { return axios.get(`/xibin/case/removeCase.shtml`, { params: params }); };

export const saveCase = params => { return axios.get(`/xibin/case/saveCase.shtml`, { params: params }); };


