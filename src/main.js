// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'

import axios from "axios"

// import {
//   Button,
//   ButtonGroup,
//   Col,
//   Content,
//   DatePicker,
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   Form,
//   FormItem,
//   Header,
//   Icon,
//   Input,
//   Menu,
//   MenuGroup,
//   MenuItem,
//   Sider,
//   Submenu,
//   Modal,
//   Option,
//   OptionGroup,
//   Row,
//   Select,
//   Slider,
//   Table,
//   TimePicker,
//   Tree,
//   Layout,
//   Message,
//   Spin,
//   Cascader,
//   Page
// } from 'iview';
// Vue.component('Button', Button);
// Vue.component('ButtonGroup', ButtonGroup);
// Vue.component('Col', Col);
// Vue.component('Content', Content);
// Vue.component('DatePicker', DatePicker);
// Vue.component('Dropdown', Dropdown);
// Vue.component('DropdownItem', DropdownItem);
// Vue.component('DropdownMenu', DropdownMenu);
// Vue.component('Form', Form);
// Vue.component('FormItem', FormItem);
// Vue.component('Header', Header);
// Vue.component('Icon', Icon);
// Vue.component('Input', Input);
// Vue.component('Menu', Menu);
// Vue.component('MenuGroup', MenuGroup);
// Vue.component('MenuItem', MenuItem);
// Vue.component('Sider', Sider);
// Vue.component('Submenu', Submenu);
// Vue.component('Modal', Modal);
// Vue.component('Option', Option);
// Vue.component('OptionGroup', OptionGroup);
// Vue.component('Row', Row);
// Vue.component('Select', Select);
// Vue.component('Slider', Slider);
// Vue.component('Table', Table);
// Vue.component('TimePicker', TimePicker);
// Vue.component('Tree', Tree);
// Vue.component('Layout', Layout);
// Vue.component('Message', Message);
// Vue.component('Spin', Spin);
// Vue.component('Cascader',Cascader)
// Vue.component('Page',Page)
import iView from 'iview'
import {

  Modal,

  Message,
  Spin,
} from 'iview';
Vue.use(iView);
import querystring from 'querystring'
import { resolve } from 'url';
//Vue.prototype.configPath = "http://47.98.205.224:8080"
//Vue.prototype.configPath = "http://10.1.100.31:8080"
Vue.prototype.configPath = ""
// Vue.prototype.configPath = "http://120.79.82.183:8080"
Vue.prototype.$Message = Message
Vue.prototype.$Spin = Spin
Vue.prototype.$Modal = Modal
Vue.prototype.$thime = localStorage.getItem("THIME")
router.beforeEach((to, from, next) => {
  // if (to.matched.some(record => record.meta.hideMenu)) {
  //     document.getElementById("main-header").style.display = "none"
  //     document.getElementById("main-menu").style.display = "none"
  // }else{
  //   document.getElementById("main-header").style.display = "block"
  //     document.getElementById("main-menu").style.display = "block"
  // }
  Spin.show()
  next()
})

Date.prototype.format = function(fmt) { 
  var o = { 
     "M+" : this.getMonth()+1,                 //月份 
     "d+" : this.getDate(),                    //日 
     "h+" : this.getHours(),                   //小时 
     "m+" : this.getMinutes(),                 //分 
     "s+" : this.getSeconds(),                 //秒 
     "q+" : Math.floor((this.getMonth()+3)/3), //季度 
     "S"  : this.getMilliseconds()             //毫秒 
 }; 
 if(/(y+)/.test(fmt)) {
         fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
 }
  for(var k in o) {
     if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
  }
 return fmt; 
} 

// Vue.prototype.$baseUrl = '/xjcs/'
Vue.prototype.$baseUrl = ''
let baseURL = "/"
if(process.env.NODE_ENV=="development"){
  baseURL = "/xjcs/"
}
var instance = axios.create({
  // baseURL: '/xjcs/',
  baseURL,
  timeout: 15000,
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  transformRequest: [function (data) {  
    // Do whatever you want to transform the data 
    return querystring.stringify(data)
  }],
});

var http = {
  get(url,params){
    return new Promise((resolve,reject)=>{
      instance.get(url,params).then(res=>{
        if(res.data.status != "error"){
          resolve(res)
       }else{
          Vue.prototype.$Message.error(res.data.msg);
           if(res.data.msg=="账户未登录"){
             location.href = "login.html"
             return
           }else{
            reject(res)
           }
            
         }
      }).catch(e=>{
        console.error(e)
        
        Vue.prototype.$Message.error("网络异常");
      })
    })
    
  },
  post(url,params){
    return new Promise((resolve,reject)=>{
      instance.post(url,params).then(res=>{
         if(res.data.status != "error"){
            resolve(res)
         }else{
          Vue.prototype.$Message.error(res.data.msg);
           if(res.data.msg=="账户未登录"){
             location.href = "login.html"
             return
           }else(
            reject(res)
           )
            
         }
      }).catch(e=>{
        console.error(e)
        Vue.prototype.$Message.error("网络异常");
       
      })
    })
  }
}

Vue.prototype.$http = http

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
