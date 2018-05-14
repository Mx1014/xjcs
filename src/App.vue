<template>
    <div id="app" class="layout" :class="thime">
        <Layout>
            <Header class="sjcs-header">
                    <div class="sjcs-layout-logo"><span class="logo "><img :src="thime=='thime1'?logo:logo2" alt=""></span>星峻城市节能管理平台</div>
                    <div class="sjcs-info">
                      <span><span @click="$router.push({path:'/warnlist'})" class="iconfont icon-baojing" :class="{blin:parseInt(info.is_waring)>0}" style="font-size:1.2em"></span> &nbsp;&nbsp;&nbsp;&nbsp;{{info.date}} &nbsp;&nbsp;&nbsp;&nbsp;{{info.week}}  &nbsp;农历  &nbsp;{{info.lundate}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                      <span>{{info.temperature}}℃  &nbsp;&nbsp;&nbsp;&nbsp;{{info.text}}  &nbsp;&nbsp;&nbsp;&nbsp;{{info.wind_scale}}  &nbsp;&nbsp;&nbsp;&nbsp;PM2.5:{{info.pmtwo}}</span>
                      <span class="sjcs-h-menu">
                          <span>
                              <Dropdown>
                                <a href="javascript:void(0)">
                                    
                                   <Icon type="gear-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem @click.native="thime = 'thime1'"><span ><span class="thime-1-span"></span>主题一 <sup v-if="thime == 'thime1'">now</sup></span></DropdownItem>
                                    <DropdownItem @click.native="thime = 'thime2'"><span ><span class="thime-2-span" ></span>主题二 <sup v-if="thime == 'thime2'">now</sup></span></DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                          </span>
                          <span><Dropdown>
                                <a href="javascript:void(0)">
                                    
                                 {{info.username}} <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem @click.native="logout"><span >退出</span></DropdownItem>

                                </DropdownMenu>
                            </Dropdown></span>
                      </span>
                    </div>
            </Header>
            <Layout class="sjcs-main">
                <Sider class="sjcs-slide" hide-trigger :style="{background: '#fff'}">
                    <Menu ref="menu"  :accordion="true" :active-name="acname" theme="light" width="auto" :open-names="opname">
                        <Submenu :name="index" v-for="(item,index) in menuData" :key="index">
                            <span slot="title">
                                <span class="iconfont" :class="{[item.icon]:true}"></span> 
                                {{item.title}}
                            </span >
                            
                            <MenuItem v-for="(citem,idex) in item.children" :name="citem.name" :key="idex" @click.native="$router.push({ path: citem.url })">
                                 
                           
                              {{citem.title}}
                           
                             
                            </MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout >
                    <div class="sjcs-content" :style="{height:height}" style="">
                        <router-view class="content-view"></router-view>
                    </div>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>


<script>
import menuData from "@/config/menuData";
export default {
  name: "App",
  data(){
    return {
        thime:"thime1",
        info:{},
        height:'600px',
        acname:'',
        opname:[],
        logo:require("@/assets/logo.png"),
        logo2:require("@/assets/logo-2.jpg"),

      menuData
    }
  },
  methods:{
      setSize(){
          let height = document.documentElement.clientHeight
          this.height = (height-100) +"px"
          

      },
      logout(){
          location.href = "login.html"
      },
      getEviInfo(){
          this.$http.get("/Public/get_header_data").then(res=>{
                if(res.data.status=="ok"){
                    this.info = res.data
                }
          }).catch(e=>{

          })
      }
  },
  watch:{
      thime(val){
          localStorage.setItem("THIME",val)
      }
  },
  mounted(){
     
      this.thime = localStorage.getItem("THIME")
      this.getEviInfo()
      window.onresize = ()=>{
         
               this.setSize()
          }
      this.setSize()
      setTimeout(()=>{
           let mindex = this.$route.meta.mindex
            let name = this.$route.name
            this.acname = name
            this.opname = [mindex-1]
            this.$nextTick(()=>{
                this.$refs.menu.updateActiveName()
                    this.$refs.menu.updateOpened()
            })
        },1000)
     
      
    
  }
};
</script>

<style> 
    .thime-1-span{
        display: inline-block;
        width: 12px;
        height: 12px;
        vertical-align: middle;
        background: #f28a24;
        margin-bottom: 2px;
        margin-right: 10px;
    }
    .thime-2-span{
        display: inline-block;
        width: 12px;
        height: 12px;
        vertical-align: middle;
        background: #3394f2;
        margin-bottom: 2px;
        margin-right: 10px;
    }
    .content-view{
        height: 100%
    }
    .logo{
        display: inline-=block;
        vertical-align: middle;
    }
    .logo img{
        vertical-align: middle;
        margin-top: -10px;
    }
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  color: #333333;
}
#app .sjcs-content {
  padding: 20px;
}
#app .sjcs-layout-logo {
  color: #f28a24;
  font-size: 30px;
  float: left;
}
#app .sjcs-info {
  float: right;
}
#app .xjcs-c-form{
    padding: 15px 0;
  background: #fff;
  margin-bottom: 20px;
}
#app .sjcs-header {
  padding-top: 15px;
  height: 100px;
  box-sizing: border-box;
  background: #fff;
  font-size: 16px;
  padding-right: 40px;
  z-index: 2;
  width: 100%;
  white-space: nowrap;
  box-shadow: -2px 1px 5px #ddd;
}
#app .sjcs-info > span.sjcs-h-menu {
  margin-left: 170px;
  margin-right: 0px;
}
#app .sjcs-info > span.sjcs-h-menu > span{
    margin-right: 10px;
}
#app .sjcs-info > span {
  margin-right: 30px;
}
#app .sjcs-slide {
  box-sizing: border-box;
  width: 160px;
}
#app .sjcs-main {
  z-index: 1;
}
#app a {
    color: #333;
    background: 0 0;
    text-decoration: none;
    outline: 0;
    cursor: pointer;
    transition: color .2s ease;
}
#app a:hover {
    color: #333;
}
#app .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
    color: #333;
    border-right: none;
    border: none
}
#app .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover{
  background: #fef3e9
}
#app .ivu-icon-ios-arrow-down.ivu-menu-submenu-title-icon::before{
  content: ""
}
#app .ivu-menu-vertical.ivu-menu-light:after{
  border: none;
}
#app .map-view {
    width: 100%;
    height: 100%;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: auto;
}
#app .jtleft{
    font-size: 60px!important;
    position: absolute;
    left: -10px;
    top: 150px;
    color: #ddd;
    transform: rotate(180deg);
    cursor: pointer;
}
#app .jtright{
    font-size: 60px!important;
    position: absolute;
    right: -10px;
    top: 150px;
    color: #ddd;
    cursor: pointer;
}
#app .xjcs-c-aside {
    width: 220px;
    box-sizing: border-box;
    height: 600px;
    background: #fff;
    display: inline-block;
    vertical-align: top;
    padding-top: 20px;
    padding-left: 20px;
}

#app .xjcs-c-content {
    display: inline-block;
    margin-left: 15px;
    width: 980px;
    box-sizing: border-box;
    vertical-align: top;
}
#app .xjcs-c-right{
    display: inline-block;
    margin-left: 15px;
    width: 400px;
    box-sizing: border-box;
    vertical-align: top;
}

#app .xjcs-c-title {
    padding-left: 30px;
    margin-bottom: 20px;
}

#app .xjcs-c-tree {}

#app .ivu-checkbox-checked .ivu-checkbox-inner {
    border-color: #f28a24;
    background-color: #f28a24;
}

#app .map-view .ivu-menu-vertical .ivu-menu-item,
#app .map-view .ivu-menu-vertical .ivu-menu-submenu-title {
    padding: 10px 44px;
}

#app .c-childe-item {
    padding-left: 73px !important;
}

#app .ivu-checkbox-checked:hover .ivu-checkbox-inner {
    border-color: #f28a24;
}

#app .xjcs-form-title {
    padding: 15px 30px;
}
#app .echart_3_1{
    padding: 15px 30px;
    width: 800px;
    height: 400px;
}
#app .echart_3_2,.echart_3_3{
    padding: 15px 30px;
    width: 800px;
    height: 400px;
}
#app .xjcs-city-time {
    margin-left: 30px;
}
@media screen and (max-width: 1365px) {
   #app .sjcs-info > span.sjcs-h-menu {
        margin-left: 24px;
        margin-right: 0px;
    }
}
#app .echart-nhzl-1 {
    width: 100%;
    height: 200px;
    background: #fff;
    margin-bottom: 20px;
}

#app .echart-nhzl-2 {
    width: 100%;
    height: 430px;
    background: #fff;
}
.ivu-spin-fix{
    background: rgba(255,255,255,.3)
}
.blin{
    color:red;
    animation: twinkling 1s infinite
}
@keyframes twinkling{  
    0%{  
        opacity: 0.3;  
    }
    50%{  
        opacity: 1;  
    }  
    100%{  
        opacity: .3;  
    }  
} 
#app .ivu-page-item{
    color: #fff;
}
#app   .ivu-page-item-active a, .ivu-page-item-active:hover a{
        color: #fff;
    }
#app span.content-text div {
    line-height: 1.5em;
    margin: 10px 15px;
}
#app .xjcs-city-date  .ivu-input{
    height: 45px;
    vertical-align: middle;
    margin-top: -4px;

}
</style>
<style>
@import "//at.alicdn.com/t/font_652317_zy11ifbi6y8k6gvi.css"

</style>
<style lang="scss">
$h-1-color:#f28a24;
$h-1-bgcolor:#fef3e9;
$h-1-dkbgcolor:#f39c45;
$h-1-bdcolor:#f28a24;
#app.thime1{
    .sjcs-layout-logo{
            color:$h-1-color;
    }
    .xjcs-city-time span.actived, .xjcs-city-type span.actived {
        border-color:$h-1-color;
        border: 1px solid $h-1-color!important;
        color: $h-1-color;
    }
    .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover {
        background: $h-1-bgcolor;
    }
    .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
        background-color: $h-1-bgcolor;
    }
    .ivu-select-item-selected, .ivu-select-item-selected:hover{
        background: $h-1-dkbgcolor;
    }
    .ivu-select-visible .ivu-select-selection{
        border-color: $h-1-bdcolor;
    }
    .ivu-input:hover{
        border-color: $h-1-bdcolor;
    }
    .ivu-date-picker-cells-cell-selected em, .ivu-date-picker-cells-cell-selected:hover em{
        background: $h-1-color
    }
    .ivu-date-picker-cells-cell:hover em{
        background: $h-1-bgcolor
    }
    .ivu-picker-panel-icon-btn:hover{
        color: $h-1-color;
    }
    .xjcs-report-yaer ul li.actived{
        background: $h-1-color
    }
    .xjcs-report-month ul li.actived{
        background: $h-1-color
    }
    .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color: $h-1-color;
        background-color: $h-1-color;
    }
    .build-info-items h3::before{
        background:$h-1-color
    }
  

    .ivu-select-selection:hover{
        border-color: $h-1-bdcolor;
    }
    .ivu-tree-title:hover{
        background: $h-1-bgcolor;
    }
    .ivu-input:focus{
border-color: $h-1-bdcolor;
    }
    .ivu-cascader-menu .ivu-cascader-menu-item-active{
        color: $h-1-color
    }
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
        background: $h-1-bgcolor;
    }
    .ivu-page-item:hover {
        border-color: $h-1-bdcolor
    }

    .ivu-page-item-active {
        color: #fff;
        background-color: $h-1-color;
        border-color: $h-1-bdcolor
    }
};


$color:#3394f2;
$bgcolor:#d5e8fc;
$dkbgcolor:#2d8cf0e6;
$bdcolor:#57a3f3;
#app.thime2{
    .sjcs-layout-logo{
            color:$color;
    }
    .xjcs-city-time span.actived, .xjcs-city-type span.actived {
        border-color:$color;
        border: 1px solid $color!important;
        color: $color;
    }
    .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover {
        background: $bgcolor;
    }
    .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
        background-color: $bgcolor;
    }
    .ivu-select-item-selected, .ivu-select-item-selected:hover{
        background: $dkbgcolor;
    }
    .ivu-select-visible .ivu-select-selection{
        border-color: $bdcolor;
    }
    .ivu-input:hover{
        border-color: $bdcolor;
    }
    .ivu-date-picker-cells-cell-selected em, .ivu-date-picker-cells-cell-selected:hover em{
        background: $color
    }
    .ivu-date-picker-cells-cell:hover em{
        background: $bgcolor
    }
    .ivu-picker-panel-icon-btn:hover{
        color: $color;
    }
    .xjcs-report-yaer ul li.actived{
        background: $color
    }
    .xjcs-report-month ul li.actived{
        background: $color
    }
    .ivu-checkbox-checked .ivu-checkbox-inner{
            border-color: $color;
        background-color: $color;
    }
    .build-info-items h3::before{
        background:$color
    }
     .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
        background: $bgcolor;
    }
     .ivu-page-item:hover {
        border-color: $bdcolor
    }

    .ivu-page-item-active {
        color: #fff;
        background-color: $color;
        border-color: $bdcolor
    }
}
</style>

