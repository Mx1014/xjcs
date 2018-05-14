<template>
<div class="map-view">
    <div class="xjcs-c-aside">
        <div>
            <!-- <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
                <Submenu name="1" v-for="item in treeList" :key="item.cityid">
                    <template slot="title">
                            <Checkbox label="twitter" @click.native="checkboxClick">
                                
                            </Checkbox>{{item.city}}
                            </template >
                            <MenuItem class="c-childe-item" v-for="citem in item.cityList" name="1-1" :key="citem.cityid">
                            <Checkbox label="twitter">
                               
                            </Checkbox> {{citem.city}}
                                <MenuItem class="c-childe-item" v-for="citem in item.cityList" name="1-1" :key="citem.cityid">
                                        <Checkbox label="twitter">
                               
                                        </Checkbox> {{citem.city}}
                                 </MenuItem>
                            </MenuItem>
                        </Submenu>
                    </Menu> -->
                    <Tree :data="treeList" @on-select-change="selectchange"></Tree>
          </div>
      </div>
      <div class="xjcs-c-content">
        <div class="xjcs-c-form">
            <div class='xjcs-c-action'>
                <span class="xjcs-city-title">能耗曲线</span>
                  <span class="xjcs-city-type"><span @click="changeEntype('电能')" :class="{actived:enType=='电能'}">电能</span><span @click="changeEntype('水能')" :class="{actived:enType=='水能'}">水能</span><span @click="changeEntype('气能')" :class="{actived:enType=='气能'}">气能</span><span @click="changeEntype('油能')" :class="{actived:enType=='油能'}">油能</span></span>
                <span class="xjcs-city-time"><span @click="changeDatetype(0)" :class="{actived:dateType=='0'}">日</span><span @click="changeDatetype(1)" :class="{actived:dateType=='1'}">月</span><span @click="changeDatetype(2)" :class="{actived:dateType=='2'}">年</span></span> 
                <span class="xjcs-city-date" v-show="dateType=='0'"> <DatePicker @on-change="getData()" v-model="datetime"  placeholder="" style="width: 200px"></DatePicker></span>       
            </div>
        </div>
        <div style="position:relative">
            <div id="echart_nhzl" class="echart_nhzl"></div>
<span class="iconfont icon-jiantou jtleft" @click="intChart+=1;getData()"></span>
            <span v-show="intChart>0" class="iconfont icon-jiantou jtright" @click="intChart-=1;getData()"></span>
            <div>
                <Table :columns="cols" :data="dataList"></Table>
            </div>
        </div>
      </div>
       <div class="xjcs-c-right">
         <div id="echart-nhzl-1" class="echart-nhzl-1"></div>
        <!-- <div id="echart-nhzl-2" class="echart-nhzl-2"></div> -->
      </div>
  </div>
</template>

<script>
import menuData from "@/config/menuData";
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
export default {
    data() {
        return {
            menuData,
            enType:"电能",
            dateType:0,
            treeList:[],
            intChart:0,
             disabled:true,
            datetime:new Date(),
            selnode:{},

            
                dataList:[
                    
                ],
            dateList: [{
                label: "逐月",
                value: 1
            }]
        };
    },
    computed:{
        span(){
            if(this.dateType == 0){

                let span = []
                for(var i=0;i<24; i++){
                    span.push((i<10?"0"+i:i) + ":00")
                }
                return span
            }
            if(this.dateType == 1){
                let span = []
                for(var i=1;i<=31; i++){
                    span.push((i) + "日")
                }
                return span
            }
            if(this.dateType == 2){
                let span = []
                for(var i=1;i<=12; i++){
                    span.push((i) + "月")
                }
                return span
            }
        },
        cols(){
            let index= 0
            let list = this.span.map(ele=>{
                index ++
                return {
                    title:ele,
                    key:index,
                    width:120,
                }
            })
            return [{
                title:"机构",
                key:"name",
                width:120,
            },{
                title:"日期",
                key:"date",
                width:120,
            },...list]
        }
    },
    methods: {
        checkboxClick(e) {
            e.stopPropagation();
        },
        changeEntype(type){
            this.enType = type
            this.getData()
        },
        changeDatetype(type){
            this.dateType = type
            this.getData()
        },
        selectchange(e){
            if(e.length>0){
                this.selnode = e[0]
                this.getData()
            }
            
        },
        getOrigin() {
            this.$http.get("/Empor/employTree").then(res => {
                this.treeList = this.buildTree(res.data.lists)
                this.getData()
                console.log(this.treeList, 111)
            }).catch(e => {
                console.log(e)
            })
        },
        buildTree(list) {
            let rList = []

            var _buildChildren = (list,lv) => {
                if (!list) {
                    return []
                }
                let rlist = []
                let index= 0
                
                list.forEach(ele => {
                var obj = {
                        title: ele.city,
                        value: ele.cityid,
                        expand: true,
                        disabled:lv!=4,
                        children: _buildChildren(ele.regList || ele.empList,lv+1)
                    }
                    if(index==0&&lv==4){
                        obj.selected= true
                        this.selnode = obj
                    }
                    rlist.push(obj)
                    index++
                })
                
                return rlist
            }
            list.forEach(ele => {
                rList.push({
                    title: ele.city,
                    value: ele.cityid,
                    expand: true,
                    disabled:true,
                    children: _buildChildren(ele.cityList,2)
                })
            })



            return rList
        },
        
        getData(){
            this.$http.get("/Index/get_data_by_time",{params:{
                intChart:this.intChart,
                time_type:this.dateType,
                energy_type:this.enType,
                emp_code:this.selnode.value,
                datetime:this.dateType==0?this.datetime:undefined
            }}).then(res=>{
                if(this.enType == "气能"||this.enType == "油能"){
                    res.data= {"elect_node_id":"1","cityname":"\u767e\u8272\u5e02","water_node_id":"30001","node_id":"1","title":"2018-01-04","energy_today":0,"energy_yesterday":0,"energy_lastyeartoday":0,"energy_today_list":{"name":"","data":[]},"energy_yesterday_list":{"name":"2018-01-03","data":[]},"energy_lastyeartoday_list":null,"energy_chartdata_list":[{"name":"2018-01-04","data":[]},{"name":"2018-01-03","data":[]}],"energy_department_energy_arr":[{"value":[]}]}

                }
                this.buildchart(res.data)
                this.buildTable(res.data.energy_today_list)
                this.setRight1([res.data.energy_lastyeartoday,res.data.energy_yesterday,res.data.energy_today])
        this.setRight2(res.data.energy_department_energy_arr)
                console.log(res)
            }).catch(e=>{
                console.log(e)
            })
        },
        buildTable(ele){
            let rlist = []
  
                let obj ={}
                let i = 0
                ele.data.forEach(item=>{
                    i++
                    obj[i] = item
                })
                rlist.push({
                    name:this.selnode.title,
                    date:ele.name,
                    ...obj
                })
            
            this.dataList = rlist
        },
        buildchart(data){
               var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/chart/line"); //线
            require("echarts/lib/chart/bar"); //线
        var myChart = echarts.init(document.getElementById("echart_nhzl"));

        let option = {
            title:{
                text:this.selnode.title
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                    data:[data.energy_chartdata_list[0].name,data.energy_chartdata_list[1].name]
                },
            toolbox: {
                    show: true,
                    feature: {

                        magicType: {
                            type: ['line', 'bar']
                        },

                    }
                },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: this.span,
                axisTick: {
                    alignWithLabel: true
                }
            }],
            yAxis: [{
                 name:{"电能":"电耗(kwh)","水能":"水耗(t)","气能":"气耗(m³)","油能":"油耗(L)"}[this.enType],
                type: 'value'
            }],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            dataZoom: [{
                type: "slider",
                width: '50%',
                show: true,
                start: 0,
                end: 50,
                zoomLock: true,
                left: '50%',
                top: '95%'
            }],
                        series: [{
                name:data.energy_chartdata_list[0].name,
                data: data.energy_chartdata_list[0].data,
                type: 'line',
                smooth: true
            },{
                name:data.energy_chartdata_list[1].name,
                data: data.energy_chartdata_list[1].data,
                type: 'line',
                smooth: true
            }]
        };
        myChart.setOption(option);
        },
        setRight1(data) {
            console.log(data)
                          var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/chart/line"); //线
            require("echarts/lib/chart/bar"); //线
            let all = (parseFloat(data[0])?parseFloat(data[0]):0)+(parseFloat(data[1])?parseFloat(data[1]):0)+(parseFloat(data[2])?parseFloat(data[2]):0)
            var builderJson = {
                "all": all,
                "charts": {
                    ["今日"+(this.enType=='电能'?"电耗":"水耗")]: data[2],
                    ["昨日"+(this.enType=='电能'?"电耗":"水耗")]: data[1],
                    ["去年今日"+(this.enType=='电能'?"电耗":"水耗")]:data[0]
                }
            };
            var myChart = echarts.init(document.getElementById("echart-nhzl-1"));
            let option = {
                grid: [{
                    top: 30,
                    width: "80%",
                    height: "70%",
                    bottom: "45%",
                    left: 10,
                    containLabel: true
                }],
                tooltip:{

                },
                xAxis: [{
                    type: "value",
                    show: false,
                    max: builderJson.all,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: "category",
                    data: Object.keys(builderJson.charts),
                    axisLabel: {
                        interval: 0
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                }],
                series: [{
                    type: "bar",
                    stack: "chart",
                    z: 3,
                    barWidth: 20,
                    label: {
                        normal: {
                            position: "right",
                            show: true,
                         
                        }
                    },
                    itemStyle:{
                        normal:{
                               color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: '#ff741d'
                                }, {
                                    offset: 1,
                                    color: '#ff211d'
                                }]),
                        }
                    },
                    data: Object.keys(builderJson.charts).map(function(key) {
                        return builderJson.charts[key];
                    })
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        setRight2(data) {

            let span = data.map(ele=>{
                return 
                    ele.name
                
            })
            let csdata = data.map(ele=>{
                return {
                    name :ele.name,
                    value : ele.elect_each_all
                }
                    
                
            })
            var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/chart/pie"); //线
            let myChart = echarts.init(document.getElementById("echart-nhzl-2"));
            let option = {

                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                /* legend: {
                    x : 'center',
                    y : 'bottom',
                    data:['照明插座系统用电','照明插座系统用电2','照明插座系统用电3','照明插座系统用电4']
                }, */
                series: [{
                    name: '分类统计',
                    type: 'pie',
                    radius: ['40', '60'],
                    center: ['50%', '50%'],
                    color: ['#f6da22', '#bbe2e8', '#6cacde', '#3394f2', '#f20376'],
                    data: csdata,
                    roseType: 'radius',
                     label: {
                        normal: {
                            formatter: '{b|{b}：}{c}   ',
                            borderColor: '#aaa',
                            borderWidth: 0,
                            rich: {
                            
                                b: {
                                    fontSize: 10,
                                    lineHeight: 16
                                }
        
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function(idx) {
                        return Math.random() * 200;
                    }
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    },

    
    mounted() {
        this.$Spin.hide()
        this.getOrigin()
        
    }
};
</script>

<style>
.echart_nhzl {
    width: 100%;
    height: 380px;
    margin-bottom: 20px;
    background: #fff;
}

.xjcs-c-action {
    padding: 15px 30px
}

.xjcs-city-title {
    color: #000;
    font-size: 1.2em;
    font-weight: bold;
}

.xjcs-city-type {
    margin-left: 80px;
}

.xjcs-city-time span:nth-child(1),
.xjcs-city-type span:nth-child(1) {
    border-left: 1px solid #ddd
}

.xjcs-city-time span,
.xjcs-city-type span {
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    display: inline-block;
    padding: 10px 25px;
    cursor: pointer;
}
.xjcs-city-time span.actived,
.xjcs-city-type span.actived{
    border-color: #f28a24;
    border: 1px solid #f28a24!important;
    color: #f28a24;
}


</style>

