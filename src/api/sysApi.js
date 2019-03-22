/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';


export const showAllCompanyListPage = params => { return axios.get(`/xibin/sys/showAllCompanyListPage.shtml`, { params: params }); };

export const showAllRoleListPage = params => { return axios.get(`/xibin/sys/showAllRoleListPage.shtml`, { params: params }); };

export const showAllFunctionListPage = params => { return axios.get(`/xibin/sys/showAllFunctionListPage.shtml`, { params: params }); };

export const getAllRoleFunctions = params => { return axios.get(`/xibin/sys/getAllRoleFunctions.shtml`, { params: params }); };

export const showAllMenu = params => { return axios.get(`/xibin/sys/showAllMenu.shtml`, { params: params }); };



