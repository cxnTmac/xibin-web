/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getAnotherNameListPage = params => { return axios.get(`/xibin/anotherName/showAllAnotherName.shtml`, { params: params }); };

export const removeAnotherName = params => { return axios.get(`/xibin/anotherName/removeAnotherName.shtml`, { params: params }); };



export const saveAnotherName = params => { return axios.get(`/xibin/anotherName/saveAnotherName.shtml`, { params: params }); };


