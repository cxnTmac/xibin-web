/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';


export const showVoucherGL = params => { return axios.get(`/xibin/accountBook/showVoucherGL.shtml`, { params: params }); };

export const showAccountBalance = params => { return axios.get(`/xibin/accountBook/showAccountBalance.shtml`, { params: params }); };

export const showVoucherDetailSum = params => { return axios.get(`/xibin/accountBook/showVoucherDetailSum.shtml`, { params: params }); };

export const showVoucherCount = params => { return axios.get(`/xibin/accountBook/showVoucherCount.shtml`, { params: params }); };



