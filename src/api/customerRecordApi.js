/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getCustomerRecordListPage = params => { return axios.get(`/xibin/customerRecord/showAllCustomerRecord`, { params: params }); };

export const removeCustomerRecord = params => { return axios.get(`/xibin/customerRecord/removeCustomerRecord`, { params: params }); };

export const saveCustomerRecord = params => { return axios.get(`/xibin/customerRecord/saveCustomerRecord`, { params: params }); };

export const getCustomerRecordListByCustomer = params => { return axios.get(`/xibin/customerRecord/showAllCustomerRecordByCustomer`, { params: params }); };

export const monthReport = params => { return axios.get(`/xibin/customerRecord/monthReport`, { params: params }); };

export const queryForVoucher = params => { return axios.get(`/xibin/customerRecord/queryForVoucher`, { params: params }); };
