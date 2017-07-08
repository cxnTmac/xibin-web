import Vue from 'vue'
import popwin from './popwin'

export default {
    install(Vue, defaultOptions = {}) {
        const CONSTRUCTOR = Vue.extend(popwin)
        console.log(Vue);
        console.log(popwin);
        function loginPopWin(msg, options = {}) {
            debugger
            let popwin = new CONSTRUCTOR
            let vm = popwin.$mount()
            document.querySelector('body').appendChild(vm.$el)
        }
        Vue.loginPopWin = Vue.prototype.$loginPopWin = loginPopWin
    }
}