<template>
<div class="login-c" @keyup.enter="login">
  <div class="login">
    <span class="login-left">
            <transition name="slide-fade">
          <img :src="login_img1" alt="" v-show="showIndex == 0">
           </transition>
            <transition name="slide-fade">
           <img :src="login_img2" alt=""  v-show="showIndex == 1">
           </transition>
              <transition name="slide-fade">
            <img :src="login_img3" alt=""  v-show="showIndex == 2">
             </transition>
        </span>
    <span class="login-right">
            <div class="login-title">城市节能监测管理平台</div>
            <div class="login-center">
              <label for="">账号</label><input v-model="user" type="text" />
            </div>
             <div class="login-center">
              <label for="">密码</label><input v-model="pwd" type="password" />
            </div>
             <div class="login-bt" @click="login">
              <Button :loading="loading" class="login-bt-span" >立即登录</Button>
  </div>
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
          location.href = 'index.html#/cityenergymap'
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
  align-items: center;
  justify-content: center;
  background: #f1f7f8;
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
  display: inline-block;
  vertical-align: top;
  height: 100%;
  width: 480px;
  box-sizing: border-box;
  margin: 0;
  text-align: center;
}

.login-left img {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.login {
  width: 1160px;
  height: 540px;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.3) 1px 2px 10px;
}

.login-title {
  color: #f28a24;
  font-size: 33px;
  margin-top: 100px;
  padding-bottom: 20px;
}

.login-center {
  margin-top: 40px;
  color: #f28a24;
  font-size: 16px;
}

.login-center label {
  display: inline-block;
  width: 60px;
}

.login-center input {
  width: 300px;
  padding: 3px 10px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 2px;
  height: 30px;
}

.login-bt {
  cursor: pointer;
  margin-top: 40px;
}

.login-bt .login-bt-span {
  display: inline-block;
  background: #f28a24;
  width: 300px;
  padding: 10px 0px;
  font-size: 14px;
  margin-left: 60px;
  color: #fff;
  outline: none
}

html,
body {
  height: 100%;
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
