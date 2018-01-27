/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getAssembleOrderListPage = params => { return axios.get(`/xibin/assemble/showAllAssembleOrder.shtml`, { params: params }); };

export const getAssembleFDetailList = params => { return axios.get(`/xibin/assemble/showAllAssembleFDetail.shtml`, { params: params }); };

export const saveAssembleOrder = params => { return axios.get(`/xibin/assemble/saveAssembleOrder.shtml`, { params: params }); };

export const saveAssembleFDetail = params => { return axios.get(`/xibin/assemble/saveAssembleFDetail.shtml`, { params: params }); };

export const removeAssembleFDetail = params => { return axios.post(`/xibin/assemble/removeAssembleFDetail.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const audit = params => { return axios.post(`/xibin/assemble/audit.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const cancelAudit = params => { return axios.post(`/xibin/assemble/cancelAudit.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const getAssembleOrderHeader = params => { return axios.get(`/xibin/assemble/getAssembleHeaderByOderNo.shtml`, { params: params }); };



