/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';


export const showAllCompanyListPage = params => { return axios.get(`/xibin/sys/showAllCompanyListPage`, { params: params }); };

export const showAllRoleListPage = params => { return axios.get(`/xibin/sys/showAllRoleListPage`, { params: params }); };

export const showAllFunctionListPage = params => { return axios.get(`/xibin/sys/showAllFunctionListPage`, { params: params }); };

export const getAllRoleFunctions = params => { return axios.get(`/xibin/sys/getAllRoleFunctions`, { params: params }); };

export const showAllMenus = params => { return axios.get(`/xibin/sys/showAllMenus`, { params: params }); };



