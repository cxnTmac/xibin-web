/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getInboundOrderListPage = params => { return axios.get(`/xibin/inbound/showAllInboundOrder.shtml`, { params: params }); };

export const getInboundDetailListPage = params => { return axios.get(`/xibin/inbound/showAllInboundDetail.shtml`, { params: params }); };

export const showAllClosedOrderInboundDetail = params => { return axios.get(`/xibin/inbound/showAllClosedOrderInboundDetail.shtml`, { params: params }); };

export const getInboundRecListPage = params => { return axios.get(`/xibin/inbound/showAllInboundRecieve.shtml`, { params: params }); };
// export const removeFittingSku = params => { return axios.get(`/xibin/fittingSku/removeFittingSku.shtml`, { params: params }); };
//
export const removeInboundDetail = params => { return axios.post(`/xibin/inbound/removeInboundDetail.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const remove = params => { return axios.post(`/xibin/inbound/remove.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const audit = params => { return axios.post(`/xibin/inbound/audit.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const close = params => { return axios.post(`/xibin/inbound/close.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const createVoucher = params => { return axios.post(`/xibin/inbound/createVoucher.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const cancelAudit = params => { return axios.post(`/xibin/inbound/cancelAudit.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };
//
export const saveInboundOrder = params => { return axios.get(`/xibin/inbound/saveInboundOrder.shtml`, { params: params }); };

export const saveInboundDetail = params => { return axios.get(`/xibin/inbound/saveInboundDetail.shtml`, { params: params }); };

export const receive = params => { return axios.get(`/xibin/inbound/receive.shtml`, { params: params }); };

export const cancelReceive = params => { return axios.get(`/xibin/inbound/cancelReceive.shtml`, { params: params }); };
//
export const getInboundOrderHeader = params => { return axios.get(`/xibin/inbound/getInboundHeaderByOderNo.shtml`, { params: params }); };

export const accountByOrderNo = params => { return axios.get(`/xibin/inbound/accountByOrderNo.shtml`, { params: params }); };

export const accountByOrderNos = params => { return axios.post(`/xibin/inbound/accountByOrderNos.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };
//
// export const removeFittingSkuPic = params => { return axios.get(`/xibin/fittingSku/removeFittingSkuPic.shtml`, { params: params }); };

