/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getCustomerListPage = params => { return axios.get(`/xibin/customer/showAllCustomer`, { params: params }); };

export const removeCustomer = params => { return axios.get(`/xibin/customer/removeCustomer`, { params: params }); };

export const batchRemoveCustomer = params => { return axios.post(`/xibin/customer/batchRemove`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const saveCustomer = params => { return axios.get(`/xibin/customer/saveCustomer`, { params: params }); };

export const addCustomerCourseAuxiliaryBlance = params => { return axios.get(`/xibin/customer/addCustomerCourseAuxiliaryBlance`, { params: params }); };

export const getCustomerByCustomerCode = params => { return axios.get(`/xibin/customer/getCustomerByCustomerCode`, { params: params }); };


