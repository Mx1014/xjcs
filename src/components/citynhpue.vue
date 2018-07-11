<template>
<div class="map-view">
    <div class="xjcs-c-aside">

        <div>
  <Tree :data="treeList" @on-select-change="selectchange"></Tree>
          </div>
      </div>
      <div class="xjcs-c-content">
        <div class="xjcs-c-form">
              <Form >
            <Row>
                <Col span="8">
                    <!-- <FormItem :label-width="120" label="时间周期:">
                        <Select v-model="time_type" style="width:200px" @on-change="getData">
                            <Option v-for="item in dateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem> -->

                     <FormItem :label-width="120" label="时间周期:">
                        <DatePicker @on-ok="getData()" type="daterange" v-model="date" confirm :options="options2" placeholder="选择时间" style="width: 200px"></DatePicker>
                    </FormItem>
                </Col>
                <!-- <Col span="8">
                <FormItem :label-width="120" label="时间区间:">

                            <DatePicker @on-change="getData" v-model="start_time" :type="dttype" placeholder="Select date" style="width: 200px"></DatePicker>

                    </FormItem></Col>
                <Col span="8">
                </Col> -->
            </Row>
            <!-- <Row>
                 <Col span="8">
                <FormItem :label-width="120" label="">
                        <!-- <Select v-model="energy_type" style="width:200px" @on-change="getData">
                            <Option  :value="1" >电耗</Option>
                            <Option  :value="2" >水耗</Option>
                        </Select> -->
                    <!-- </FormItem></Col>
                     <Col span="8"> -->
                <!-- <FormItem :label-width="120" label="">

                            <DatePicker v-model="end_time" :type="dttype" placeholder="Select date" style="width: 200px" @on-change="getData"></DatePicker>

                    </FormItem></Col>
            </Row>  -->
            </Form>
           
        </div>
         <div class='xjcs-c-action'>
                <span class="xjcs-city-title">PUE曲线</span>
                <!-- <span class="xjcs-city-type"><span>电能</span><span>水能</span></span>
                <span class="xjcs-city-time"><span>今日</span><span>本月</span><span>今年</span></span>     -->
            </div>
        <div>
            <div id="echart_nhzl" class="echart_nhzl"></div>
            <div>
                <Table :columns="cols" :data="dataList"></Table>
                 <div class="export-data">
                     <a :href="exporturl" target="_blank">导出数据</a>
                </div>
            </div>
        </div>
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
            date:[new Date(),new Date()],
            start_time:new Date(),
            end_time:new Date(),
            energy_type:1,
            ids:[],
            time_type:1,
                    treeList:[],
                    selnode:{},
            cols:[
                    
                ],
                dataList:[
                    
                ],
             dateList: [{
                label: "日",
                value: 1
            },{
                label: "月",
                value: 2
            },{
                label: "年",
                value: 3
            }],
            options2: {
                    shortcuts: [
                        {
                            text: '今天',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
                                return [start, end];
                            }
                        },
                        {
                            text: '昨天',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                                return [start, start];
                            }
                        },
                        {
                            text: '最近7天',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },{
                            text: '最近30天',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                         {
                            text: '当月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * (end.getDate()-1));
                                return [start, end];
                            }
                        },
                        {
                            text: '上月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                end.setTime(end.getTime() - 3600 * 1000 * 24 * (end.getDate()));
                                start.setTime(end.getTime() - 3600 * 1000 * 24 * (end.getDate()-1));
                                return [start, end];
                            }
                        },
                        {
                            text: '自定义',
                            value () {
                                return [];
                            }
                        }
                    ]
                },
        };
    },
    computed:{
        dttype(){
            if(this.time_type==3){
                return "year"
            }
            if(this.time_type==2){
                return "month"
            }
            if(this.time_type==1){
                return "date"
            }
        },
        exporturl(){
            let times = this.date[1].getTime() - this.date[0].getTime()
            let day = 24*3600*1000
            let time_type = 1
            if(times>day&&times<=day*30){
                time_type = 2
            }
            if(times>30*day){
                time_type = 3
            }
            let emp_code = this.selnode.value
            let start_time = this.getStartDate(this.date[0])
            let end_time = this.getEndDate(this.date[1])
            let energy_type = this.energy_type
            return `/Index/get_energy_pue_data?import=outexcel&start_time=${start_time}&end_time=${end_time}&emp_code=${emp_code}&time_type=${time_type}`
        }
    },
    methods: {
        selectchange(e){
            if(e.length>0){
                this.selnode = e[0]
                this.getData()
            }
            
        },
        buildTree(list){
            let rList = []
            var _buildChildren = (list,lv)=>{
                if(!list){
                    return []
                }
                let rlist = []
                let index = 0
                list.forEach(ele=>{
                    var obj ={
                        title:ele.city,
                        value:ele.cityid,
                        selected:false,
                        expand:true,
                        disableCheckbox:lv!=4,
                        children:_buildChildren(ele.regList||ele.empList,lv+1)
                    }
                   if(index==0&&lv==4&&!this.selnode.value){
                        obj.selected = true
                        this.selnode = obj
                    }
                    rlist.push(obj)
                    index++
                })
                return rlist
            }
            list.forEach(ele=>{
                rList.push({
                    title:ele.city,
                    value:ele.cityid,
                    expand:true,
                    disableCheckbox:true,
                    children:_buildChildren(ele.cityList,2)
                })
            })
            
            

            return rList
        },
        getOrigin(){
           this.$http.get("/Empor/employTree").then(res=>{
                this.treeList = this.buildTree(res.data.lists)
                this.getData()
            }).catch(e=>{
                console.log(e)
            })
        },
          getStartDate(date){

                 return date.format("yyyy-MM-dd")+" 00:00:00"
     

        },
         getEndDate(date){

                 return date.format("yyyy-MM-dd")+" 23:59:59"
      

        },
         getData(){

            let times = this.date[1].getTime() - this.date[0].getTime()
            let day = 24*3600*1000
            let time_type = 1
            if(times>day&&times<=day*30){
                time_type = 2
            }
            if(times>30*day){
                time_type = 3
            }
            let emp_code = this.selnode.value
            let start_time = this.getStartDate(this.date[0])
            let end_time = this.getEndDate(this.date[1])
            let energy_type = this.energy_type
            this.$http.get("Index/get_energy_pue_data",{
                params:{
                    emp_code,
                    start_time,
                    end_time,
                    time_type
                }
            }).then((res)=>{
                if(res.data.status=='ok'){
                    this.buildchart(res.data.lists[0].data)
                    this.buildTable(res.data.lists[0].data,res.data.lists[0].name,res.data.lists[0].elect_each_all)
                }
            })
        },
        buildTable(list,name,total){
            let dataList = [{}];
            // let sum = 0;

            let j = 0
            list.forEach(ele=>{
                j++,
                dataList[0][j] = ele.value
                // sum+=ele.value
            })
            dataList[0].total = total
            dataList[0].name = name
            let i = 0
            let span = list.map(ele=>{
                i++;
                return {
                    title :ele.update_time,
                    key:i,
                     width:110,
                }
            })
            let cols=[{
                title:"机构",
                key:"name",
                 width:120,
                 fixed:"left"
            },{
                title:"PUE均值",
                key:"total",
                width:120,
                 fixed:"left"
            },...span]
            this.cols = cols
            this.dataList = dataList
        },
        buildchart(list){
            var color = this.$thime=='thime3'?"#4285f3":"#000"
            color = this.$thime=='thime4'?"#24936e":color
            let data = list.map(ele=>{
                return ele.value
            })
            let span = list.map(ele=>{
                return ele.update_time
            })
                 var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/chart/line"); //线
            require("echarts/lib/chart/bar"); //线
            var thime = this.$thime=='thime3'?"light":"default"
        var myChart = echarts.init(document.getElementById("echart_nhzl"),thime);


        let option = {
            tooltip: {
                trigger: 'axis',

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
                data: span,
                axisTick: {
                        alignWithLabel: true,
                        lineStyle:{
                            color
                        }
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:color
                        }
                    }
          
            }],
            yAxis: [{
                type: 'value',
                 nameTextStyle:{
                        color,
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:color
                        }
                    },splitLine:{
                        lineStyle:{
                            color:'#666'
                        }
                    }
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
                data: data,
                type: 'line',
                smooth: true
            }]
        };
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
    padding: 15px 30px;
    background: #fff;
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

.xjcs-city-time {
    margin-left: 180px;
}
</style>

