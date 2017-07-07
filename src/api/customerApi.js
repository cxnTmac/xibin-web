/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getCustomerListPage = params => { return axios.get(`/xibin/customer/showAllCustomer.shtml`, { params: params }); };

export const removeCustomer = params => { return axios.get(`/xibin/customer/removeCustomer.shtml`, { params: params }); };

export const batchRemoveCustomer = params => { return axios.post(`/xibin/customer/batchRemove.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const saveCustomer = params => { return axios.get(`/xibin/customer/saveCustomer.shtml`, { params: params }); };


