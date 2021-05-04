/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getOutboundOrderListPage = params => { return axios.get(`/xibin/outbound/showAllOutboundOrder`, { params: params }); };

export const getOutboundDetailListPage = params => { return axios.get(`/xibin/outbound/showAllOutboundDetail`, { params: params }); };

export const getOutboundAllocListPage = params => { return axios.get(`/xibin/outbound/showAllOutboundAlloc`, { params: params }); };

export const removeOutboundDetail = params => { return axios.post(`/xibin/outbound/removeOutboundDetail`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const removeOutboundDetailAndCreateNewOrder = params => { return axios.post(`/xibin/outbound/removeOutboundDetailAndCreateNewOrder`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const remove = params => { return axios.post(`/xibin/outbound/remove`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const audit = params => { return axios.post(`/xibin/outbound/audit`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const cancelAudit = params => { return axios.post(`/xibin/outbound/cancelAudit`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };


export const alloc = params => { return axios.post(`/xibin/outbound/alloc`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const cancelAlloc = params => { return axios.post(`/xibin/outbound/cancelAlloc`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const shipByHeader = params => { return axios.get(`/xibin/outbound/shipByHeader`, { params: params }); };

export const pickByHeader = params => { return axios.get(`/xibin/outbound/pickByHeader`, { params: params }); };

export const cancelShipByHeader = params => { return axios.get(`/xibin/outbound/cancelShipByHeader`, { params: params }); };

export const allocByHeader = params => { return axios.get(`/xibin/outbound/allocByOrderNo`, { params: params }); };

export const cancelAllocByHeader = params => { return axios.get(`/xibin/outbound/cancelAllocByOrderNo`, { params: params }); };

export const ship = params => { return axios.get(`/xibin/outbound/shipByAlloc`, { params: params }); };

export const cancelShip = params => { return axios.get(`/xibin/outbound/cancelShipByAlloc`, { params: params }); };

export const close = params => { return axios.post(`/xibin/outbound/close`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const pick = params => { return axios.get(`/xibin/outbound/pickByAlloc`, { params: params }); };

export const cancelPick = params => { return axios.get(`/xibin/outbound/cancelPickByAlloc`, { params: params }); };

export const saveOutboundOrder = params => { return axios.get(`/xibin/outbound/saveOutboundOrder`, { params: params }); };

export const saveOutboundDetail = params => { return axios.get(`/xibin/outbound/saveOutboundDetail`, { params: params }); };

export const saveOutboundAllocDetail = params => { return axios.get(`/xibin/outbound/saveOutboundAllocDetail`, { params: params }); };

export const getOutboundOrderHeader = params => { return axios.get(`/xibin/outbound/getOutboundHeaderByOderNo`, { params: params }); };

export const queryHistoryPrice = params => { return axios.get(`/xibin/outbound/queryHistoryPrice`, { params: params }); };

export const queryHistorySale = params => { return axios.get(`/xibin/outbound/queryHistorySale`, { params: params }); };

export const batchSaveOutboundDetail = params => { return axios.post(`/xibin/outbound/batchSaveOutboundDetail`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const showAllClosedOrderOutboundDetail = params => { return axios.get(`/xibin/outbound/showAllClosedOrderOutboundDetail`, { params: params }); };

export const accountByOrderNo = params => { return axios.get(`/xibin/outbound/accountByOrderNo`, { params: params }); };

export const accountByOrderNos = params => { return axios.post(`/xibin/outbound/accountByOrderNos`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };


export const accountCostByOrderNo = params => { return axios.get(`/xibin/outbound/accountCostByOrderNo`, { params: params }); };

export const accountCostByOrderNos = params => { return axios.post(`/xibin/outbound/accountCostByOrderNos`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };


export const importOutboundDetailByExcel = params => { return axios.get(`/xibin/outbound/importOutboundDetailByExcel`, { params: params }); };

export const aiForOrders = params => { return axios.get(`/xibin/outbound/aiForOrders `, { params: params }); };
// export const queryWmOutboundDetailByPage = params => { return axios.post(`/xibin/outbound/queryWmOutboundDetailByPage`, { params: params }); };

export const queryWmOutboundDetailByPage = params => { return axios.post(`/xibin/outbound/queryWmOutboundDetailByPage`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const selectNextOrderNo = params => { return axios.get(`/xibin/outbound/selectNextOrderNo`, { params: params }); };

export const selectPreOrderNo = params => { return axios.get(`/xibin/outbound/selectPreOrderNo`, { params: params }); };
// export const receive = params => { return axios.get(`/xibin/outbound/receive `, { params: params }); };
//
// export const cancelReceive = params => { return axios.get(`/xibin/outbound/cancelReceive `, { params: params }); };
// //



