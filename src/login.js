// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import Login from './login.vue'

import axios from "axios"

import querystring from 'querystring'

let baseURL = "/"
if(process.env.NODE_ENV=="development"){
  baseURL = "/xjcs/"
}
var instance = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  transformRequest: [function (data) {  
    // Do whatever you want to transform the data 
    return querystring.stringify(data)
  }],
});
Vue.prototype.$http = instance
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#login',
  components: { Login },
  template: '<Login/>'
})
