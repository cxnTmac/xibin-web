import axios from 'axios';
var qs = require('qs');
let base = '';


export const pieChartForCurrentMonthSaleByType = params => { return axios.get(`/xibin/charts/pieChartForCurrentMonthSaleByType.shtml`, { params: params }); };

export const pieChartAndMapForMonthSaleByProvince = params => { return axios.get(`/xibin/charts/pieChartAndMapForMonthSaleByProvince.shtml`, { params: params }); };

export const monthSaleByDate = params => { return axios.get(`/xibin/charts/monthSaleByDate.shtml`, { params: params }); };