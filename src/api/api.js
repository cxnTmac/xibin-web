import axios from 'axios';
var qs = require('qs');
let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

// export const requestLogin = params => { return axios.post(`/xibin/user/login `,qs.stringify(params),{headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
// }} ).then(res => res.data); };

// export const requestLogin = params => { return axios.post(`/xibin/user/login`,qs.stringify(params),{headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
// }} ).then(res => res.data); };

export const requestLogin = params => { return axios.post(`/xibin/user/login`,params).then(res => res.data); };
// export const  requestLogin = params => { return axios.post(`/xibin/user/login.`,{params},{headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
// }} ).then(res => res.data); };
// export const requestLogin = params => { return axios.post(`/xibin/crm/user/login`,qs.stringify(params),{headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
// }} ).then(res => res.data); };
export const logout = params => { return axios.post(`/xibin/logout`).then(res => res.data); };
// export const requestLogin = params => { return axios({method:'post',url:'/xibin/user/login ',
//     data:params,headers:{'Content-Type':'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

//export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const getUserListPage = params => { return axios.get(`/xibin/user/showAllUser`, { params: params }); };
//export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const removeUser = params => { return axios.get(`/xibin/user/removeUser`, { params: params }); };

// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

//export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const saveUser = params => { return axios.get(`/xibin/user/saveUser`, { params: params }); };

