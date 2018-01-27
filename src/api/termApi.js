/**
 * Created by cxn on 2017/5/19.
 */
import axios from 'axios';
var qs = require('qs');
let base = '';


export const lossAndGainBroughtForward = params => { return axios.get(`/xibin/term/lossAndGainBroughtForward.shtml`, { params: params }); };


export const endTerm = params => { return axios.get(`/xibin/term/endTerm.shtml`, { params: params }); };



