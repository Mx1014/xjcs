<template>
<div class="login-c" @keyup.enter="login">
  <div class="login">
    <!-- <span class="login-left">
            <transition name="slide-fade">
          <img :src="login_img1" alt="" v-show="showIndex == 0">
           </transition>
            <transition name="slide-fade">
           <img :src="login_img2" alt=""  v-show="showIndex == 1">
           </transition>
              <transition name="slide-fade">
            <img :src="login_img3" alt=""  v-show="showIndex == 2">
             </transition>
        </span> -->
        
         <div class="login-title">城市节能监测管理平台</div>
    <span class="login-right">
           
            <div class="login-center">
             <input v-model="user" type="text" placeholder="账户/用户名"/>
            </div>
             <div class="login-center">
             <input v-model="pwd" type="password" placeholder="密码"/>
            </div>
             <div class="login-bt" @click="login">
              <Button :loading="loading" class="login-bt-span" >登录</Button>
  </div>
<!-- <div class="sanjiao"></div> -->
  </span>
  
</div>
</div>
</template>

<script>
import {Message} from 'iview'
export default {
  name: "Login",
  components:{
    Message
  },
  data() {
    return {
      user:"",
      pwd:"",
      loading:false,
      timer: null,
      login_img1: require("@/assets/login1.jpg"),
      login_img2: require("@/assets/login2.jpg"),
      login_img3: require("@/assets/login3.jpg"),
      showIndex: 0

    }
  },
  methods: {
    login() {
      if (this.user.trim() == "") {
        Message.warning('请输入用户名！')
        return
      } else if (this.pwd.trim() == "") {
        Message.warning('请输入密码！')
        return
      }
      this.loading = true
      this.$http({
        method: 'post',
        url: '/Login/do_login',
        data: {
          userName: this.user.trim(),
          passWord: this.pwd.trim()
        }
      }).then(res=>{
        this.loading = false
        if(res.data.status==1){
          localStorage.setItem("manager",res.data.manager||1)
          if(res.data.manager == 2){
            location.href = 'index.html#/areaenergyoverview'
          }else{
            location.href = 'index.html#/cityenergymap'
          }
          
          
        }else{
          Message.warning(res.data.msg)
        }
      }).catch(e=>{
          this.loading = false
          Message.warning("网络错误")
      })
    }
  },
  mounted() {
    var i = 0
    this.timer = setInterval(() => {
      i++;
      let c = (i % 3)
      this.showIndex = c
    }, 5000)
  },
  destroyed() {
    clearInterval(this.timer)
  }
};
</script>

<style>
.login-c {
  height: 100%;
  width: 100%;
  display: flex;
  color:#00d9ed;
  justify-content: center;
  background: url(./assets/login-bg.jpg);
}

.login-left {
  display: inline-block;
  height: 100%;
  width: 670px;
  box-sizing: border-box;
  margin: 0;
  vertical-align: top;
  position: relative;
}

.login-right {
  margin-top:-30px;
  position:relative;
  display: inline-block;
  vertical-align: top;
  width: 660px;
  height: 440px;
  background: url(./assets/login-top-sanjiao.png) no-repeat;
  background-size:100% 100%;
  border-radius:10px;
  box-sizing: border-box;
  text-align: center;
  padding-top:120px;
}

.login-left img {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.login {
  text-align:center;
  
}

.login-title {
  color: #00d9ed;
  font-size: 32px;
  margin-top: 250px;
  margin-left:25px
}
@media screen and (max-width: 1365px) {
   .login-title {
margin-top: 100px;
}
}
.login-center {
  margin-bottom: 35px;
  color: #00d9ed;
  font-size: 20px;
}

.login-center label {
  display: inline-block;
  width: 60px;
}

.login-center input {
  width: 420px;
  padding: 3px 10px;
  border:none;
  outline:none;
  background: rgba(255, 255, 255, 0);
  box-shadow:0px 7px 12px rgba(0, 0, 0, 0.3), 0px -1px 3px rgba(255, 255, 255, 1);
  height: 50px;
  border-radius: 5px;
  line-height:0px;
  color: #00d9ed;
  box-sizing:border-box;
}

.login-bt {
  cursor: pointer;
  margin-top: 65px;
}

.login-bt .login-bt-span {
  display: inline-block;
  width: 420px;
 padding: 3px 10px;
   background: rgba(255, 255, 255, 0);
   box-shadow:0px 7px 12px rgba(0, 0, 0, 0.3), 0px -1px 3px rgba(255, 255, 255, 1);
  font-size: 20px;
  border-radius: 5px;
  border:none;
  outline:none;
   height: 50px;
  line-height:50px;
  color: #00d9ed;
  outline: none
}
::-webkit-input-placeholder { /* WebKit browsers */
    color:    #00d9ed;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:    #00d9ed;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:    #00d9ed;
}
:-ms-input-placeholder { /* Internet Explorer 10+ */
    color:    #00d9ed;
}
html,
body {
  height: 100%;
}

.sanjiao{
  border-top:1px solid rgba(255,255,255,1);
  border-right:1px solid rgba(255,255,255,1);
  border-bottom:1px solid transparent;
  border-left:1px solid transparent;
  transform:rotate(-45deg);
  background:url(./assets/login-bg.jpg) center center;
  opacity:.5;
  position:absolute;
  top:-10px;
  left:300px;
  width:20px;
  height:20px;
}
/* 可以设置不同的进入和离开动画 */


/* 设置持续时间和动画函数 */

.slide-fade-enter-active {
  transition: all 3s ease;
}

.slide-fade-leave-active {
  transition: all 3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */

{
  opacity: 0;
}
</style>
