<template>
    <div id="app" class="layout" :class="$thime">
        <Layout>
            <Header class="sjcs-header" id="main-header" v-show="!$route.meta.hideMenu">
                    <div class="sjcs-layout-logo"><span class="iconfont icon-pingtaixitongjiankong logo"></span> 城市节能管理平台</div>
                    <div class="sjcs-info">
                      <span><span @click="$router.push({path:'/warnlist'})" class="iconfont icon-baojing" :class="{blin:parseInt(info.is_waring)>0}" style="font-size:1.2em"></span> &nbsp;&nbsp;&nbsp;&nbsp;{{info.date}} &nbsp;&nbsp;&nbsp;&nbsp;{{info.week}}  &nbsp;农历  &nbsp;{{info.lundate}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                      <span>{{info.temperature}}℃  &nbsp;&nbsp;&nbsp;&nbsp;{{info.text}}  &nbsp;&nbsp;&nbsp;&nbsp;{{info.wind_scale}}  &nbsp;&nbsp;&nbsp;&nbsp;PM2.5:{{info.pmtwo}}</span>
                      <span class="sjcs-h-menu">
                          <span >
                              <Icon @click.native="goDataAll" type="pie-graph"></Icon>
                          </span>

                          <span>
                              <Dropdown>
                                <a href="javascript:void(0)">
                                    
                                   <span class="iconfont icon-diaoseban"></span>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem @click.native="setThime('thime1')"><span ><span class="thime-1-span"></span>主题一 <sup v-if="$thime == 'thime1'">now</sup></span></DropdownItem>
                                    <DropdownItem @click.native="setThime('thime2')"><span ><span class="thime-2-span" ></span>主题二 <sup v-if="$thime == 'thime2'">now</sup></span></DropdownItem>
                                     <DropdownItem @click.native="setThime('thime3')"><span ><span class="thime-3-span" ></span>主题三 <sup v-if="$thime == 'thime3'">now</sup></span></DropdownItem>
                                      <DropdownItem @click.native="setThime('thime6')"><span ><span class="thime-4-span" ></span>主题四 <sup v-if="$thime == 'thime4'">now</sup></span></DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                          </span>

                          <span><Dropdown>
                                <a href="javascript:void(0)">
                                    
                                 {{info.username}} <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <!-- <DropdownItem @click.native="goDataAll"><span >数据大屏</span></DropdownItem> -->
                                    <DropdownItem @click.native="logout"><span >退出</span></DropdownItem>

                                </DropdownMenu>
                            </Dropdown></span>
                      </span>
                    </div>
            </Header>
            <Layout class="sjcs-main">
                <Sider class="sjcs-slide" v-show="!$route.meta.hideMenu" id="main-menu" width="160px" hide-trigger :style="{background: '#fff',width:'160px','min-width':'160px'}">
                    <Menu ref="menu"  :accordion="true" :active-name="acname" theme="light" width="160px" :open-names="opname">
                        <Submenu :name="index" v-show="item.manager!=manager" v-for="(item,index) in menuData" :key="index"  >
                            <span slot="title" >
                                <a href="javascript:void(0)" @click="goUrl(item.url)"> <span class="iconfont" :class="{[item.icon]:true}"></span> 
                                {{item.title}}
                                </a> 
                            </span >
                            
                            <MenuItem v-if="item.children" v-show="citem.manager!=manager" v-for="(citem,idex) in item.children" :name="citem.name" :key="idex" @click.native="$router.push({ path: citem.url })">
                                 
                           
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
        manager:"1",
        thime:"thime1",
        info:{},
        height:'600px',
        acname:'',
        opname:[],
        logo:{
            thime1:require("@/assets/logo.png"),
            thime2:require("@/assets/logo-2.jpg"),
            thime3:require("@/assets/logo-3.jpg")
        },
        // logo:require("@/assets/logo.png"),
        // logo2:require("@/assets/logo-2.jpg"),
        // logo3:require("@/assets/logo-3.jpg"),

      menuData
    }
  },
  methods:{
      setSize(){
          let height = document.documentElement.clientHeight
          if(this.$route.meta.hideMenu){
              this.height = (height) +"px"
          }else{
              this.height = (height-100) +"px"
          }
          

      },
      setThime(val){
          localStorage.setItem("THIME",val)
          location.reload()
      },
      logout(){
          this.$http.post("Login/do_unsetLogin").then(res=>{
              location.href = "login.html"
          }).catch(e=>{

          })
          
      },
      goDataAll(){
          this.$router.push({ path: '/lzcityhome'})
      },
      goUrl(url){
          
          if(url){
               this.$router.push({ path:url})
        //       location.href="#"+url
        // function _IEVersion() {
        //     var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        //     var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
        //     var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
        //     var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        //     if(isIE) {
        //         var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        //         reIE.test(userAgent);
        //         var fIEVersion = parseFloat(RegExp["$1"]);
        //         if(fIEVersion == 7) {
        //             return 7;
        //         } else if(fIEVersion == 8) {
        //             return 8;
        //         } else if(fIEVersion == 9) {
        //             return 9;
        //         } else if(fIEVersion == 10) {
        //             return 10;
        //         } else {
        //             return 6;//IE版本<=7
        //         }   
        //     } else if(isEdge) {
        //         return 'edge';//edge
        //     } else if(isIE11) {
        //         return 11; //IE11  
        //     }else{
        //         return -1;//不是ie浏览器
        //     }
        // }
        //       if(_IEVersion()!=-1){
        //            location.reload()
        //       }
             
          }
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
        //   localStorage.setItem("THIME",val)
        //   location.reload()
      },
      $route(){
        this.setSize()
      }
  },
  mounted(){
      this.manager = localStorage.getItem("manager")||1
     
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
     .thime-3-span{
        display: inline-block;
        width: 12px;
        height: 12px;
        vertical-align: middle;
        background: #161a49;
        margin-bottom: 2px;
        margin-right: 10px;
    }
    .thime-4-span{
        display: inline-block;
        width: 12px;
        height: 12px;
        vertical-align: middle;
        background: #24936e;
        margin-bottom: 2px;
        margin-right: 10px;
    }
    .content-view{
        height: 100%
    }
    .logo{
        display: inline-=block;
        vertical-align: middle;
        font-size: 28px!important;
    font-weight: 600;
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
#app .sjcs-info > span.sjcs-h-menu > span {
  cursor: pointer;
}
#app .sjcs-info > span.sjcs-h-menu > span{
    margin-right: 10px;
}
#app .sjcs-info > span {
  margin-right: 30px;
}
#app .sjcs-slide {
  box-sizing: border-box;
  width: 120px;
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
    width: 200px;
    box-sizing: border-box;
    height: 600px;
    background: #fff;
    display: inline-block;
    vertical-align: top;
    padding-top: 20px;
    padding-left: 20px;
}
#app .xjcs-c-aside.nhfx{
    width: 230px;
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
#app .xjcs-city-type {
    margin-left: 40px;
}
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
#app .export-data{
    margin-top:20px;
}
#app .export-data a{
    display:inline-block;
    padding:5px 10px;
    color:#666!important;
    border:1px #ddd solid;
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
#app .echart-nhzl-t{
    background:#fff;
    padding:15px 0 0 15px;
}
</style>
<style>
@import "//at.alicdn.com/t/font_652317_x6vup3hnzca.css"

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
    .ivu-date-picker-cells-cell-range:before{
        background:$h-1-bgcolor;
    }
    .ivu-date-picker-cells-cell-today em:after{
         background-color: $h-1-color;
    }
    .ivu-btn-primary {
        color: #fff;
        background-color: $h-1-color;
        border-color: $h-1-color;
    }
    tr.ivu-table-row-hover td{
        background-color: $h-1-bgcolor;
    }
    .ivu-date-picker-cells span em {
        /* color:#fff; */
    }
    .ivu-date-picker-cells-cell-range:before{
        background-color: $h-1-color;
    }
    
};


$color-t3:#4285f3;
$bgcolor-t3:#393c65;
$dkbgcolor-t3:rgba(134, 211, 241, 0.05);
$bdcolor-t3:#57a3f3;
$color-f-t3:#f68a0a;
$color-txt-t3:#fff;
$color-m-bg-t3:#151d4e;
$c-bg-color-t3:rgba(134, 211, 241, 0.05);
#app.thime3{
    background: linear-gradient(to bottom right,#161a49, #161a49 , #14498a); /* 标准的语法 */;
    .ivu-layout{
         background: linear-gradient(to top right, #161a49,#161a49 , #14498a); /* 标准的语法 */;
    }
    .sjcs-layout-logo{
            color:$color-t3;
    }
    .ivu-table{
        background-color: transparent;
    }
    .sjcs-header{
        background:$dkbgcolor-t3;
        box-shadow: -2px 1px 5px $dkbgcolor-t3;
    }
    .sjcs-info{
        color:$color-txt-t3;
    }
    .ivu-table-fixed-header th.col-heignlight {
           background:#2d3f6b;
       }
        .ivu-table-fixed-body td.col-heignlight {
           background:#2d3f6b;
       }
    .col-heignlight .ivu-table-cell{
        /* background:rgba(134, 211, 241, 0.05); */
        color: #0bbdf7;
    }
    a{
        color:$color-txt-t3;
    }
    .blin{
        color:$color-f-t3;
    }
    .ivu-select-dropdown{
        background:$bgcolor-t3;
    }
    .ivu-dropdown-item{
        color:$color-txt-t3;
    }
    .ivu-dropdown-item:hover{
        background:$dkbgcolor-t3;
    }
    .ivu-menu-vertical.ivu-menu-light:after{
        content:"";
        width:0
    }
    .ivu-menu-submenu.ivu-menu-opened a{
        color:#fff;
    }
    .ivu-menu-submenu-title a{
        color:#999;
    }
    .sjcs-slide,.ivu-menu-light{
        background:transparent!important;
    }
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item{
        color:#999;
    }
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
        color:#fff;
    }
    .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover{
        background:$dkbgcolor-t3!important;
    }
     .ivu-date-picker-cells span em {
        color:#fff;
    }
    .ivu-date-picker-cells-cell-range:before{
        background-color: $dkbgcolor-t3;
    }
    .ivu-picker-panel-sidebar{
        background-color: $bgcolor-t3;
        color:#fff;
    }
    .ivu-select-item{
        color:#fff;
    }
    .ivu-select-item:hover{
        background-color: $dkbgcolor-t3;
    }
    .nhmap-c-data table{
        background:$c-bg-color-t3;
    }
    .nhmap-c-data table th{
        color:#ddd;
    }
    .nhmap-c-data table td{
        color:#ddd;
    }
    .nhmap-c-data-title{
        color:#ddd;
    }
    .actived .iconfont{
        color:#40ddef;
    }
    .nhmap-c-data table{
        border-color:#999;
    }
    .nhmap-c-data table th{
            border-bottom: 1px solid #999;
    }
    .echart-npmp-map {
background:$c-bg-color-t3;
        }
        .xjcs-c-form{
            background:$c-bg-color-t3;
        }
        .xjcs-city-title{
            color:#ddd
        }
        .xjcs-city-time span.actived, .xjcs-city-type span.actived {
            border-color: $color-t3;
            border: 1px solid $color-t3!important;
            background:$color-t3;
            color: #ddd;
        }
        .xjcs-city-time span, .xjcs-city-type span {
            border-top: 1px solid #999;
            border-right: 1px solid #999;
            border-bottom: 1px solid #999;
            display: inline-block;
            padding: 10px 25px;
            color:#ddd;
            cursor: pointer;
        }
        .xjcs-city-time span:nth-child(1), .xjcs-city-type span:nth-child(1) {
            border-left: 1px solid #999;
        }
        .ivu-input{
            background:$c-bg-color-t3;
            color:#ddd;
            border:1px solid #999;
        }
        .echart_nhzl{
            background:$c-bg-color-t3;
        }
        .ivu-table th{
            background:$c-bg-color-t3;
            color:#fff
        }
        .ivu-table td{
            background:$c-bg-color-t3;
            color:#fff
        }
        .ivu-table-fixed-header th{
            background:#1c2451;
            color:#fff
        }
        .ivu-table-fixed-body td{
            background:#1c2451;
            color:#fff
        }
        .ivu-table-wrapper{
            border: 1px solid #999;
        }
        .ivu-table td, .ivu-table th{
            border-bottom: 1px solid #999;
        }
        .ivu-table::after,.ivu-table::before{
            display:none;
            color:#999;
        }
        .export-data a {
            color:#fff!important;
            background:$color-t3!important;
            border:none
        }
        .echart-nhzl-1,.echart-nhzl-2{
            background:$c-bg-color-t3;
        }
        .echart-nhzl-t{
            background:$c-bg-color-t3;
            color:#ddd;
        }
        .warn-title{
            color:$color-t3;
            background:$c-bg-color-t3;
        }
        .warn-title h3 a{
            color:#ddd;
        }
        .warn-title h3 span{
             color:#ddd;
        }
        .ivu-page-options-elevator{
            color:#ddd;
        }
        .ivu-page-options-elevator input{
            color:#ddd;
            background:$c-bg-color-t3;
            border:1px solid #999;
        }
        .btn-claerall{
            border:1px solid #999;
            color:#ddd;
        }
        .ivu-page-next, .ivu-page-prev{
            background:$c-bg-color-t3;
            border:1px solid #999;
        }
        .xjcs-c-aside{
            background:$c-bg-color-t3;
        }
        .ivu-tree-title{
            color:#ddd
        }
        .ivu-tree-title-selected, .ivu-tree-title-selected:hover{
            background:$c-bg-color-t3;
            color:#0bbdf7!important;
        }
        .ivu-tree-title:hover{
            background:$c-bg-color-t3;
            color:#0bbdf7!important;
        }
        .bilid-info {
            background:$c-bg-color-t3;
            color:#ddd;
        }
        .build-info-items h3::before{
            background:$color-t3;
        }
        .echart_nhdbfx{
             background:$c-bg-color-t3;
        }
        .nh-date{
            background:$c-bg-color-t3;
        }
        .ivu-btn{
            background:$color-t3;
            border:none;
            color:#ddd;
        }
        .ivu-form .ivu-form-item-label{
            color:#ddd;
        }
        .ivu-select-selection{
            background:$c-bg-color-t3;
            color:#ddd;
            border:1px solid #999;
        }
        .xjcs-c-action{
            background:transparent;
            color:#ddd;
        }
        .mapview-report{
            background:$c-bg-color-t3;
            color:#ddd;
        }
        .xjcs-report-yaer ul li{
            border: 1px solid #999;

        }
        .xjcs-report-month ul{
            background:rgba(134, 211, 241, 0.05);
        }
        .xjcs-report-month ul li.actived{
            background:$color-t3;
        }
        .xjcs-report-yaer ul li.actived{
            background:$color-t3;
        }
        .ivu-checkbox-checked .ivu-checkbox-inner{
                border-color: $color-t3;
                background-color: $color-t3;
        }
        .xjcs-c-title{
            color:#ddd;
            select{
                background:$c-bg-color-t3;
                color:#ddd;
            }
        }
        .echart-nhzl-22{
             background:$c-bg-color-t3;
        }
        .ivu-cascader .ivu-cascader-menu-item{
    color:#ddd
}
.ivu-cascader-menu .ivu-cascader-menu-item-active{
    color:$color-t3;
}
.ivu-cascader-menu{
     border-color:#999;
}
.ivu-cascader-menu:last-child{
    border-color:transparent;
}
.lzs-left {
  .main-db {
     background: $c-bg-color-t3;
  }
  .main-week {
     background: $c-bg-color-t3;
  }
  .main-bar {
    background: $c-bg-color-t3;
  }
}
.lzs-center {
  .main-map {
     background: $c-bg-color-t3;
  }
  .main-yb {
     background: $c-bg-color-t3;
  }
}
.lzs-right {
  .main-pie {
    background: $c-bg-color-t3;
  }
}
}


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
$h-5-color:#24936e;
$h-5-bgcolor:#e9feec;
$h-5-dkbgcolor:#24936e;
$h-5-bdcolor:#24936e;
#app.thime5{
    .sjcs-layout-logo{
            color:$h-5-color;
    }
    .xjcs-city-time span.actived, .xjcs-city-type span.actived {
        border-color:$h-5-color;
        border: 1px solid $h-5-color!important;
        color: $h-5-color;
    }
    .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover {
        background: $h-5-bgcolor;
    }
    .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
        background-color: $h-5-bgcolor;
    }
    .ivu-select-item-selected, .ivu-select-item-selected:hover{
        background: $h-5-dkbgcolor;
    }
    .ivu-select-visible .ivu-select-selection{
        border-color: $h-5-bdcolor;
    }
    .ivu-input:hover{
        border-color: $h-5-bdcolor;
    }
    .ivu-date-picker-cells-cell-selected em, .ivu-date-picker-cells-cell-selected:hover em{
        background: $h-5-color
    }
    .ivu-date-picker-cells-cell:hover em{
        background: $h-5-bgcolor
    }
    .ivu-picker-panel-icon-btn:hover{
        color: $h-5-color;
    }
    .xjcs-report-yaer ul li.actived{
        background: $h-5-color
    }
    .xjcs-report-month ul li.actived{
        background: $h-5-color
    }
    .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color: $h-5-color;
        background-color: $h-5-color;
    }
    .build-info-items h3::before{
        background:$h-5-color
    }
  

    .ivu-select-selection:hover{
        border-color: $h-5-bdcolor;
    }
    .ivu-tree-title:hover{
        background: $h-5-bgcolor;
    }
    .ivu-input:focus{
border-color: $h-5-bdcolor;
    }
    .ivu-cascader-menu .ivu-cascader-menu-item-active{
        color: $h-5-color
    }
    .ivu-page-item:hover {
        border-color: $h-5-bdcolor
    }

    .ivu-page-item-active {
        color: #fff;
        background-color: $h-5-color;
        border-color: $h-5-bdcolor
    }
    .ivu-date-picker-cells-cell-range:before{
        background:$h-5-bgcolor;
    }
    .ivu-date-picker-cells-cell-today em:after{
         background-color: $h-5-color;
    }
    .ivu-btn-primary {
        color: #fff;
        background-color: $h-5-color;
        border-color: $h-5-color;
    }
    tr.ivu-table-row-hover td{
        background-color: $h-5-bgcolor;
    }
    .ivu-date-picker-cells span em {
        /* color:#fff; */
    }
    .ivu-date-picker-cells-cell-range:before{
        background-color: $h-5-color;
    }
    
};
$color-t4:#24936e;
#app.thime4{
    background:$color-m-bg-t3;
    .ivu-layout{
         background:$color-m-bg-t3;
    }
    .sjcs-layout-logo{
            color:$color-t4;
    }
    .sjcs-header{
        background:$dkbgcolor-t3;
        box-shadow: -2px 1px 5px $dkbgcolor-t3;
    }
    .sjcs-info{
        color:$color-txt-t3;
    }
    a{
        color:$color-txt-t3;
    }
    .blin{
        color:$color-f-t3;
    }
    .ivu-select-dropdown{
        background:$bgcolor-t3;
    }
    .ivu-dropdown-item{
        color:$color-txt-t3;
    }
    .ivu-dropdown-item:hover{
        background:$dkbgcolor-t3;
    }
    .ivu-menu-vertical.ivu-menu-light:after{
        content:"";
        width:0
    }
    .ivu-menu-submenu.ivu-menu-opened a{
        color:#fff;
    }
    .ivu-menu-submenu-title a{
        color:#999;
    }
    .sjcs-slide,.ivu-menu-light{
        background:$dkbgcolor-t3!important;
    }
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item{
        color:#999;
    }
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
        color:#fff;
    }
    .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover{
        background:$dkbgcolor-t3!important;
    }
     .ivu-date-picker-cells span em {
        color:#fff;
    }
    .ivu-date-picker-cells-cell-range:before{
        background-color: $dkbgcolor-t3;
    }
    .ivu-picker-panel-sidebar{
        background-color: $bgcolor-t3;
        color:#fff;
    }
    .ivu-select-item{
        color:#fff;
    }
    .ivu-select-item:hover{
        background-color: $dkbgcolor-t3;
    }
    .nhmap-c-data table{
        background:$c-bg-color-t3;
    }
    .nhmap-c-data table th{
        color:#ddd;
    }
    .nhmap-c-data table td{
        color:#ddd;
    }
    .nhmap-c-data-title{
        color:#ddd;
    }
    .actived .iconfont{
        color:#40ddef;
    }
    .nhmap-c-data table{
        border-color:$color-t4;
    }
    .nhmap-c-data table th{
            border-bottom: 1px solid $color-t4;
    }
    .echart-npmp-map {
background:$c-bg-color-t3;
        }
        .xjcs-c-form{
            background:$c-bg-color-t3;
        }
        .xjcs-city-title{
            color:#ddd
        }
        .xjcs-city-time span.actived, .xjcs-city-type span.actived {
            border-color: $color-t4;
            border: 1px solid $color-t4!important;
            background:$color-t4;
            color: #ddd;
        }
        .xjcs-city-time span, .xjcs-city-type span {
            border-top: 1px solid $color-t4;
            border-right: 1px solid $color-t4;
            border-bottom: 1px solid $color-t4;
            display: inline-block;
            padding: 10px 25px;
            color:#ddd;
            cursor: pointer;
        }
        .xjcs-city-time span:nth-child(1), .xjcs-city-type span:nth-child(1) {
            border-left: 1px solid $color-t4;
        }
        .ivu-input{
            background:$c-bg-color-t3;
            color:#ddd;
            border:1px solid $color-t4;
        }
        .echart_nhzl{
            background:$c-bg-color-t3;
        }
        .ivu-table th{
            background:$c-bg-color-t3;
            color:#fff
        }
        .ivu-table td{
            background:$c-bg-color-t3;
            color:#fff
        }
        .ivu-table-wrapper{
            border: 1px solid $color-t4;
        }
        .ivu-table td, .ivu-table th{
            border-bottom: 1px solid $color-t4;
        }
        .ivu-table::after,.ivu-table::before{
            display:none;
            color:$color-t4;
        }
        .export-data a {
            color:#fff!important;
            background:$color-t4!important;
            border:none
        }
        .echart-nhzl-1,.echart-nhzl-2{
            background:$c-bg-color-t3;
        }
        .echart-nhzl-t{
            background:$c-bg-color-t3;
            color:#ddd;
        }
        .warn-title{
            color:$color-t4;
            background:$c-bg-color-t3;
        }
        .warn-title h3 a{
            color:#ddd;
        }
        .warn-title h3 span{
             color:#ddd;
        }
        .ivu-page-options-elevator{
            color:#ddd;
        }
        .ivu-page-options-elevator input{
            color:#ddd;
            background:$c-bg-color-t3;
            border:1px solid $color-t4;
        }
        .btn-claerall{
            border:1px solid $color-t4;
            color:#ddd;
        }
        .ivu-page-next, .ivu-page-prev{
            background:$c-bg-color-t3;
            border:1px solid $color-t4;
        }
        .xjcs-c-aside{
            background:$c-bg-color-t3;
        }
        .ivu-tree-title{
            color:#ddd
        }
        .ivu-tree-title-selected, .ivu-tree-title-selected:hover{
            background:$c-bg-color-t3;
            color:#0bf7cf!important;
        }
        .ivu-tree-title:hover{
            background:$c-bg-color-t3;
            color:#0bf7cf!important;
        }
        .bilid-info {
            background:$c-bg-color-t3;
            color:#ddd;
        }
        .build-info-items h3::before{
            background:$color-t4;
        }
        .echart_nhdbfx{
             background:$c-bg-color-t3;
        }
        .nh-date{
            background:$c-bg-color-t3;
        }
        .ivu-btn{
            background:$color-t4;
            border:none;
            color:#ddd;
        }
        .ivu-form .ivu-form-item-label{
            color:#ddd;
        }
        .ivu-select-selection{
            background:$c-bg-color-t3;
            color:#ddd;
            border:1px solid $color-t4;
        }
        .xjcs-c-action{
            /* background:$c-bg-color-t3; */
            color:#ddd;
        }
        .mapview-report{
            background:$c-bg-color-t3;
            color:#ddd;
        }
        .xjcs-report-yaer ul li{
            border: 1px solid $color-t4;

        }
        .xjcs-report-month ul{
            background:#2b3065;
        }
        .xjcs-report-month ul li.actived{
            background:$color-t4;
        }
        .xjcs-report-yaer ul li.actived{
            background:$color-t4;
        }
        .ivu-checkbox-checked .ivu-checkbox-inner{
                border-color: $color-t4;
                background-color: $color-t4;
        }
        .xjcs-c-title{
            color:#ddd;
            select{
                background:$c-bg-color-t3;
                color:#ddd;
            }
        }
        .echart-nhzl-22{
             background:$c-bg-color-t3;
        }
        .ivu-page-item-active {
    background-color:  $color-t4;
    border-color:  $color-t4;
}

.ivu-cascader .ivu-cascader-menu-item{
    color:#ddd
}
.ivu-cascader-menu .ivu-cascader-menu-item-active{
    color:$color-t4;
}
.ivu-cascader-menu{
     border-color:$color-t4;
}
.ivu-cascader-menu:last-child{
    border-color:transparent;
}
.ivu-date-picker-cells-cell-selected em, .ivu-date-picker-cells-cell-selected:hover em{
    background-color:  $color-t4;
}
.ivu-date-picker-cells-cell-today em:after{
    background-color:  $color-t4;
}
.ivu-select-item-selected, .ivu-select-item-selected:hover{
    background-color:  $color-t4;
}
}
#app.thime6{
    .sjcs-layout-logo{
            color:$h-5-color;
    }
    .xjcs-city-time span.actived, .xjcs-city-type span.actived {
        border-color:$h-5-color;
        border: 1px solid $h-5-color!important;
        color: $h-5-color;
    }
    .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover {
        background: $h-5-bgcolor;
    }
    .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
        background-color: $h-5-bgcolor;
    }
    .ivu-select-item-selected, .ivu-select-item-selected:hover{
        background: $h-5-dkbgcolor;
    }
    .ivu-select-visible .ivu-select-selection{
        border-color: $h-5-bdcolor;
    }
    .ivu-input:hover{
        border-color: $h-5-bdcolor;
    }
    .ivu-date-picker-cells-cell-selected em, .ivu-date-picker-cells-cell-selected:hover em{
        background: $h-5-color
    }
    .ivu-date-picker-cells-cell:hover em{
        background: $h-5-bgcolor
    }
    .ivu-picker-panel-icon-btn:hover{
        color: $h-5-color;
    }
    .xjcs-report-yaer ul li.actived{
        background: $h-5-color
    }
    .xjcs-report-month ul li.actived{
        background: $h-5-color
    }
    .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color: $h-5-color;
        background-color: $h-5-color;
    }
    .build-info-items h3::before{
        background:$h-5-color
    }
  

    .ivu-select-selection:hover{
        border-color: $h-5-bdcolor;
    }
    .ivu-tree-title:hover{
        background: $h-5-bgcolor;
    }
    .ivu-input:focus{
border-color: $h-5-bdcolor;
    }
    .ivu-cascader-menu .ivu-cascader-menu-item-active{
        color: $h-5-color
    }
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
        background: #1f795b;

    }
    .ivu-page-item:hover {
        border-color: $h-5-bdcolor
    }

    .ivu-page-item-active {
        color: #fff;
        background-color: $h-5-color;
        border-color: $h-5-bdcolor
    }
    .ivu-date-picker-cells-cell-range:before{
        background:$h-5-bgcolor;
    }
    .ivu-date-picker-cells-cell-today em:after{
         background-color: $h-5-color;
    }
    .ivu-btn-primary {
        color: #fff;
        background-color: $h-5-color;
        border-color: $h-5-color;
    }
    tr.ivu-table-row-hover td{
        background-color: $h-5-bgcolor;
    }
    .ivu-date-picker-cells span em {
        /* color:#fff; */
    }
    .ivu-date-picker-cells-cell-range:before{
        background-color: $h-5-color;
    }
    .sjcs-header {
        background: #24936e
    }
    .sjcs-info > span{
        color: #fff;
    }
    .ivu-dropdown a,ivu-menu-item{
        color: #fff;
    }
    .ivu-menu-light{
        background: #24936e
    }
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item{
        color: #ddd;
    }
    .ivu-menu-submenu a{
        color: #ddd;
    }
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
         color: #fff;
    }
    .sjcs-layout-logo{
        color: #0f4c3A
    }
    .sjcs-header{
        box-shadow: none
    }
    .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover{
        color: #fff;
        background: #1f795b
    }
    .actived .iconfont{
        color: #24936e
    }
    .ivu-layout-sider-children{
         background: #24936e
    }
}
</style>

