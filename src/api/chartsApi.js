import axios from 'axios';
var qs = require('qs');
let base = '';


export const pieChartForCurrentMonthSaleByType = params => { return axios.get(`/xibin/charts/pieChartForCurrentMonthSaleByType`, { params: params }); };

export const lineChartForCurrentAndPreMonthSaleByType = params => { return axios.get(`/xibin/charts/lineChartForCurrentAndPreMonthSaleByType`, { params: params }); };

export const pieChartAndMapForMonthSaleByProvince = params => { return axios.get(`/xibin/charts/pieChartAndMapForMonthSaleByProvince`, { params: params }); };

export const lineChartAndMapForCurrentAndPreMonthSaleByProvince = params => { return axios.get(`/xibin/charts/lineChartAndMapForCurrentAndPreMonthSaleByProvince`, { params: params }); };

export const monthSaleByDate = params => { return axios.get(`/xibin/charts/monthSaleByDate`, { params: params }); };

export const yearSaleByMonth = params => { return axios.get(`/xibin/charts/yearSaleByMonth`, { params: params }); };