/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';


export const getVoucherListPage = params => { return axios.get(`/xibin/voucher/showAllVoucher.shtml`, { params: params }); };

export const removeVoucher = params => { return axios.get(`/xibin/voucher/removeVoucher.shtml`, { params: params }); };

export const getVoucherById = params => { return axios.get(`/xibin/voucher/getVoucherById.shtml`, { params: params }); };

export const getVoucherDetailsByVoucherId = params => { return axios.get(`/xibin/voucher/getVoucherDetailsByVoucherId.shtml`, { params: params }); };

export const saveVoucher = params => { return axios.get(`/xibin/voucher/saveVoucher.shtml`, { params: params }); };

export const saveVoucherAndDetail = params => { return axios.get(`/xibin/voucher/saveVoucherAndDetail.shtml`, { params: params }); };

export const checkVoucher = params => { return axios.get(`/xibin/voucher/checkVoucher.shtml`, { params: params }); };

export const cancelCheckVoucher = params => { return axios.get(`/xibin/voucher/cancelCheckVoucher.shtml`, { params: params }); };


