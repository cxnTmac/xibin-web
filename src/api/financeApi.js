/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const showAllAuxiItem = params => { return axios.get(`/xibin/auxiItem/showAllAuxiItem`, { params: params }); };

export const showAllAccount = params => { return axios.get(`/xibin/account/showAllAccount`, { params: params }); };

// export const saveFVoucher = params => { return axios.get(`/xibin/voucher/saveFVoucher`, { params: params }); };
export const saveFVoucher = params => { return axios.post(`/xibin/voucher/saveFVoucher`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };
// export const updateFVoucher = params => { return axios.get(`/xibin/voucher/updateFVoucher`, { params: params }); };
export const updateFVoucher = params => { return axios.post(`/xibin/voucher/updateFVoucher`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const deleteFVoucher = params => { return axios.get(`/xibin/voucher/deleteFVoucher`, { params: params }); };

export const getById = params => { return axios.get(`/xibin/voucher/getById`, { params: params }); };

export const findFVoucherentryList1 = params => { return axios.get(`/xibin/voucher/findFVoucherentryList1`, { params: params }); };

export const updateChecked = params => { return axios.get(`/xibin/voucher/updateChecked`, { params: params }); };

export const updateBackChecked = params => { return axios.get(`/xibin/voucher/updateBackChecked`, { params: params }); };

export const updatePosted = params => { return axios.get(`/xibin/voucher/updatePosted`, { params: params }); };

export const findFIncome = params => { return axios.get(`/xibin/income/findFIncome`, { params: params }); };

export const findtranTypeAddVoucheerList = params => { return axios.get(`/xibin/income/findtranTypeAddVoucheerList`, { params: params }); };

export const fanVoucheer = params => { return axios.get(`/xibin/income/fanVoucheer`, { params: params }); };

export const findFCarried = params => { return axios.get(`/xibin/carried/findFCarried`, { params: params }); };

export const findtranTypeAddCarriedVoucheerList = params => { return axios.get(`/xibin/carried/findtranTypeAddVoucheerList`, { params: params }); };

export const fanCarriedVoucheer = params => { return axios.get(`/xibin/carried/fanVoucheer`, { params: params }); };

export const findFProfitLoss = params => { return axios.get(`/xibin/profitLoss/findFProfitLoss`, { params: params }); };

export const updateFProfitLoss = params => { return axios.get(`/xibin/profitLoss/updateFProfitLoss`, { params: params }); };

export const fanProfitLossVoucheer = params => { return axios.get(`/xibin/profitLoss/fanVoucheer`, { params: params }); };

export const findSettleAccounts = params => { return axios.get(`/xibin/settleAccounts/findSettleAccounts`, { params: params }); };

export const findIsJzList = params => { return axios.get(`/xibin/settleAccounts/findIsJzList`, { params: params }); };

export const deleteSettleAccounts = params => { return axios.get(`/xibin/settleAccounts/deleteSettleAccounts`, { params: params }); };

export const saveSettleAccounts = params => { return axios.get(`/xibin/settleAccounts/saveSettleAccounts`, { params: params }); };

export const saveFIncome = params => { return axios.post(`/xibin/voucher/saveFIncome`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };