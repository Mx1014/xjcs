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
                    <FormItem :label-width="120" label="时间周期:">
                        <Select v-model="time_type" style="width:200px" @on-change="getData">
                            <Option v-for="item in dateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="8">
                <FormItem :label-width="120" label="时间区间:">

                            <DatePicker @on-change="getData" v-model="start_time" :type="dttype" placeholder="Select date" style="width: 200px"></DatePicker>

                    </FormItem></Col>
                <Col span="8">
                </Col>
            </Row>
            <Row>
                 <Col span="8">
                <FormItem :label-width="120" label="">
                        <!-- <Select v-model="energy_type" style="width:200px" @on-change="getData">
                            <Option  :value="1" >电耗</Option>
                            <Option  :value="2" >水耗</Option>
                        </Select> -->
                    </FormItem></Col>
                     <Col span="8">
                <FormItem :label-width="120" label="">

                            <DatePicker v-model="end_time" :type="dttype" placeholder="Select date" style="width: 200px" @on-change="getData"></DatePicker>

                    </FormItem></Col>
            </Row>
            </Form>
           
        </div>
         <div class='xjcs-c-action'>
                <span class="xjcs-city-title">能耗曲线</span>
                <!-- <span class="xjcs-city-type"><span>电能</span><span>水能</span></span>
                <span class="xjcs-city-time"><span>今日</span><span>本月</span><span>今年</span></span>     -->
            </div>
        <div>
            <div id="echart_nhzl" class="echart_nhzl"></div>
            <div>
                <Table :columns="cols" :data="dataList"></Table>
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
            }]
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
                    if(index==0&&lv==4){
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
            if(this.time_type == 3){
                return date.format("yyyy")+"-01-01 00:00:00"
            }
            if(this.time_type == 2){
                return date.format("yyyy-MM")+"-01 00:00:00"
            }
            if(this.time_type == 1){
                 return date.format("yyyy-MM-dd")+" 00:00:00"
            }

        },
         getEndDate(date){
            if(this.time_type == 3){
                return date.format("yyyy")+"-12-31 23:59:59"
            }
            if(this.time_type == 2){
                let end = new Date(date.getFullYear(),date.getMonth()+1,0).getDate()
                return date.format("yyyy-MM")+"-"+end+" 23:59:59"
            }
            if(this.time_type == 1){
                 return date.format("yyyy-MM-dd")+" 23:59:59"
            }
        },
         getData(){
            let emp_code = this.selnode.value
            let time_type = this.time_type
            let start_time = this.getStartDate(this.start_time)
            let end_time = this.getEndDate(this.end_time)
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
                    this.buildTable(res.data.lists[0].data,res.data.lists[0].name)
                }
            })
        },
        buildTable(list,name){
            let dataList = [{}];
            let sum = 0;

            let j = 0
            list.forEach(ele=>{
                j++,
                dataList[0][j] = ele.value
                sum+=ele.value
            })
            dataList[0].total = sum.toFixed(2);
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
            },{
                title:"分类合计",
                key:"total",
                width:120,
            },...span]
            this.cols = cols
            this.dataList = dataList
        },
        buildchart(list){

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
        var myChart = echarts.init(document.getElementById("echart_nhzl"));


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
                    alignWithLabel: true
                }
            }],
            yAxis: [{
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

