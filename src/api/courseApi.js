/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';


export const getCourseListPage = params => { return axios.get(`/xibin/course/showAllCourse.shtml`, { params: params }); };

export const removeCourse = params => { return axios.get(`/xibin/course/removeCourse.shtml`, { params: params }); };


export const saveCourse = params => { return axios.get(`/xibin/course/saveCourse.shtml`, { params: params }); };

export const addChildCourse = params => { return axios.get(`/xibin/course/addChildCourse.shtml`, { params: params }); };

// export const saveCourseBalance = params => { return axios.get(`/xibin/course/saveCourseBalance.shtml`, { params: params }); };

export const saveCourseBalance = params => { return axios.post(`/xibin/course/saveCourseBalance.shtml`,qs.stringify(params),{headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
}} ).then(res => res); };


