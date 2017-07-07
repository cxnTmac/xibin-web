/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getOutboundOrderListPage = params => { return axios.get(`/xibin/outbound/showAllOutboundOrder.shtml`, { params: params }); };

export const getOutboundDetailListPage = params => { return axios.get(`/xibin/outbound/showAllOutboundDetail.shtml`, { params: params }); };

export const getOutboundAllocListPage = params => { return axios.get(`/xibin/outbound/showAllOutboundAlloc.shtml`, { params: params }); };

export const removeOutboundDetail = params => { return axios.post(`/xibin/outbound/removeOutboundDetail.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const remove = params => { return axios.post(`/xibin/outbound/remove.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const audit = params => { return axios.post(`/xibin/outbound/audit.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const cancelAudit = params => { return axios.post(`/xibin/outbound/cancelAudit.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };


export const alloc = params => { return axios.post(`/xibin/outbound/alloc.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const cancelAlloc = params => { return axios.post(`/xibin/outbound/cancelAlloc.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const shipByHeader = params => { return axios.get(`/xibin/outbound/shipByHeader.shtml`, { params: params }); };

export const cancelShipByHeader = params => { return axios.get(`/xibin/outbound/cancelShipByHeader.shtml`, { params: params }); };

export const ship = params => { return axios.get(`/xibin/outbound/shipByAlloc.shtml`, { params: params }); };

export const cancelShip = params => { return axios.get(`/xibin/outbound/cancelShipByAlloc.shtml`, { params: params }); };

export const pick = params => { return axios.get(`/xibin/outbound/pickByAlloc.shtml`, { params: params }); };

export const cancelPick = params => { return axios.get(`/xibin/outbound/cancelPickByAlloc.shtml`, { params: params }); };

export const saveOutboundOrder = params => { return axios.get(`/xibin/outbound/saveOutboundOrder.shtml`, { params: params }); };

export const saveOutboundDetail = params => { return axios.get(`/xibin/outbound/saveOutboundDetail.shtml`, { params: params }); };

export const getOutboundOrderHeader = params => { return axios.get(`/xibin/outbound/getOutboundHeaderByOderNo.shtml`, { params: params }); };

// export const receive = params => { return axios.get(`/xibin/outbound/receive.shtml`, { params: params }); };
//
// export const cancelReceive = params => { return axios.get(`/xibin/outbound/cancelReceive.shtml`, { params: params }); };
// //



