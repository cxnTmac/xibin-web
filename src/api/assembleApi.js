/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getAssembleOrderListPage = params => { return axios.get(`/xibin/assemble/showAllAssembleOrder`, { params: params }); };

export const getAssembleFDetailList = params => { return axios.get(`/xibin/assemble/showAllAssembleFDetail`, { params: params }); };

export const getAssembleSDetailList = params => { return axios.get(`/xibin/assemble/showAllAssembleSDetail`, { params: params }); };

export const getAllAssembleAllocList = params => { return axios.get(`/xibin/assemble/showAllAssembleAlloc`, { params: params }); };

export const saveAssembleOrder = params => { return axios.get(`/xibin/assemble/saveAssembleOrder`, { params: params }); };

export const saveAssembleFDetail = params => { return axios.get(`/xibin/assemble/saveAssembleFDetail`, { params: params }); };

export const createAssembleSDetailByOrderNo = params => { return axios.get(`/xibin/assemble/createAssembleSDetailByOrderNo`, { params: params }); };

export const cancelCreateByOrderNo = params => { return axios.get(`/xibin/assemble/cancelCreateByOrderNo`, { params: params }); };

export const allocByOrderNoAndLineNo = params => { return axios.get(`/xibin/assemble/allocByOrderNoAndLineNo`, { params: params }); };

export const allocByOrderNoAndLineNos = params => { return axios.get(`/xibin/assemble/allocByOrderNoAndLineNos`, { params: params }); };

export const cancelAllocByOrderNoAndLineNo = params => { return axios.get(`/xibin/assemble/cancelAllocByOrderNoAndLineNo`, { params: params }); };

export const pickByAlloc = params => { return axios.get(`/xibin/assemble/pickByAlloc`, { params: params }); };

export const pickByAllocIds = params => { return axios.get(`/xibin/assemble/pickByAllocIds`, { params: params }); };

export const cancelPickByAlloc = params => { return axios.get(`/xibin/assemble/cancelPickByAlloc`, { params: params }); };

export const assemble = params => { return axios.get(`/xibin/assemble/assemble`, { params: params }); };

export const remove = params => { return axios.post(`/xibin/assemble/remove`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const removeAssembleFDetail = params => { return axios.post(`/xibin/assemble/removeAssembleFDetail`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };
export const audit = params => { return axios.post(`/xibin/assemble/audit`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const cancelAudit = params => { return axios.post(`/xibin/assemble/cancelAudit`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const getAssembleOrderHeader = params => { return axios.get(`/xibin/assemble/getAssembleHeaderByOderNo`, { params: params }); };



