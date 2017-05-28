/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getFittingTypeListPage = params => { return axios.get(`/xibin/fittingType/showAllFittingType.shtml`, { params: params }); };

export const removeFittingType = params => { return axios.get(`/xibin/fittingType/removeFittingType.shtml`, { params: params }); };

export const batchRemoveFittingType = params => { return axios.post(`/xibin/fittingType/batchRemove.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };

export const saveFittingType = params => { return axios.get(`/xibin/fittingType/saveFittingType.shtml`, { params: params }); };

