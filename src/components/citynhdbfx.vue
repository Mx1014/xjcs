<template>
<div class="map-view">
    <div class="xjcs-c-aside nhfx">
        <div class="xjcs-c-title">
            选择级别:<select v-model="sellevel" @change="sellevelChange">
                <option value="1">区</option>
                <option value="2">机构</option>
                 <option value="3">建筑</option>
            </select>
        </div>
        <div>
             <Tree ref="tree" :data="treeList" show-checkbox @on-check-change="checkchange">></Tree>
          </div>
      </div>
      <div class="xjcs-c-content" style="width:1200px">
          <div class="xjcs-c-form">
                <Form >
            <Row>
                <Col span="8">
                    <FormItem :label-width="120" label="时间周期:">
                        <DatePicker @on-ok="getData()" type="daterange" v-model="date" confirm :options="options2" placeholder="选择时间" style="width: 200px"></DatePicker>
                    </FormItem>
                </Col>
                 <Col span="8">
                <FormItem :label-width="120" label="能源类型:">
                        <Select v-model="energy_type" style="width:200px"  @on-change="getData()">
                            <Option  :value="1" >电耗</Option>
                            <Option  :value="2" >水耗</Option>
                             <Option  :value="3" >气耗</Option>
                            <Option  :value="4" >油耗</Option>
                        </Select>
                    </FormItem></Col>
            </Row>
            </Form>
          </div>
        <div>
            <div id="echart_nhdbfx" class="echart_nhdbfx"></div>

            <!-- <div>
                <Table :columns="cols" :data="dataList"></Table>
            </div> -->
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
            menuData,
            sellevel:1,
            date:[new Date(),new Date()],
            energy_type:1,
            ids:[],
            time_type:3,
            treeList:[],
                        cols:[
                    {
                        title: '类别',
                        key: 'name'
                    },
                    {
                        title: '分类合计',
                        key: 'age'
                    },
                    {
                        title: '01.00',
                        key: 'address'
                    },
                    {
                        title: '02.00',
                        key: 'address1'
                    },
                    {
                        title: '03.00',
                        key: 'address2'
                    },
                    {
                        title: '04.00',
                        key: 'address3'
                    },
                    {
                        title: '05.00',
                        key: 'address4'
                    }
                ],
                dataList:[
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ],
            dateList: [{
                label: "年",
                value: 1
            },{
                label: "月",
                value: 2
            },{
                label: "日",
                value: 3
            },{
                label: "时",
                value: 4
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
                }
        };
    },
    methods: {
        sellevelChange(){
            this.getOrigin()
        },
         getOrigin(){
             let url = "/Empor/employTree"
             if(this.sellevel == 1){
                 url = "/Empor/regionTree"
             }

             if(this.sellevel == 3){
                 url = "Empor/getBuildList"
             }
             

            this.$http.get(url).then(res=>{
                if(this.sellevel == 1)
                    this.treeList = this.buildTree(res.data.regionList)
                else
                    this.treeList = this.buildTree(res.data.lists)
                    this.$nextTick(()=>{
                         var nodes = this.$refs.tree.getCheckedNodes()
                        console.log(nodes,1111)
                        this.ids =nodes.map(ele=>{
                            return ele.value
                        })
                        this.getData()
                    })
                
            }).catch(e=>{
                console.log(e)
            })
        },
        buildTree(list){
            if(!list){
                return []
            }
            let rList = []

            var _buildChildren = (list,level)=>{
                if(!list){
                    return []
                }
                let rlist = []
                list.forEach(ele=>{
                    let clist = ele.regList
                    if(level==3){
                        clist = ele.empList
                    }
                    if(level == 4){
                        clist = ele.buildList
                    }
                    console.log(level,parseInt(this.sellevel)+2)
                    rlist.push({
                        title:ele.city,
                        value:ele.cityid,
                        expand:true,
                        checked:level==parseInt(this.sellevel)+2,
                        disableCheckbox:level!=parseInt(this.sellevel)+2,
                        children:_buildChildren(clist,level+1)
                    })
                })
                return rlist
            }
            list.forEach(ele=>{
                rList.push({
                    title:ele.city,
                    value:ele.cityid,
                    disableCheckbox:true,
                    expand:true,
                    children:_buildChildren(ele.cityList,2)
                })
            })
            
            

            return rList
        },
        checkboxClick(e) {
            e.stopPropagation();
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
            let time_type = 3
            if(times>day&&times<=day*30){
                time_type = 2
            }
            if(times>30*day){
                time_type = 1
            }
            let start_time = this.getStartDate(this.date[0])
            let end_time = this.getEndDate(this.date[1])
            let statis_type = "1"
            let energy_type = this.energy_type
            let quota_type = "1"
            let contrasts  = this.ids.join(',')
            let level  = this.sellevel

            this.$http.get("Index/comparative_analysis_data",{
                params:{
                    time_type,
                    start_time,
                    end_time,
                    statis_type,
                    energy_type,
                    quota_type,
                    contrasts,
                    level
                }
            }).then(res=>{
                if(res.data.status=="ok"){
                    this.buildchart(res.data.lists,time_type)
                }
                
            }).catch(e=>{
                this.buildchart([],0)
            })
        },
         checkchange(e){
            this.ids = e.map(ele=>{
                return ele.value
            })
            this.getData()
        },
        buildchart(data,time_type){
            let span = getSpan(time_type)
            
            function getSpan(time_type){
                let list = []
                if(time_type == 1){

                    for(let i = 1;i<=12;i++){
                        list.push(i+"月")
                    }
                    
                } 

                if(time_type == 2){

                    for(let i = 1;i<=31;i++){
                        list.push(i+"日")
                    }
                    
                } 

                if(time_type == 3){

                    for(let i = 0;i<=23;i++){
                        list.push((i>9?i:'0'+i)+":00")
                    }
                    
                } 
                return list
            }
            let cdata = data.map(ele=>{
                return {
                    name:ele.name,
                    value:ele.totalValue
                }
            })
            let cspan = data.map(ele=>{
                return 
                    name:ele.name

   
            })
             var color = this.$thime=='thime3'?"#4285f3":"#000"
             color = this.$thime=='thime4'?"#24936e":color
                   var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
            require("echarts/lib/component/legend");
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/chart/line"); //线
            require("echarts/lib/chart/bar"); //线
               require("echarts/lib/chart/pie"); //线
        var thime = this.$thime=='thime3'?"light":"default"
        var myChart = echarts.init(document.getElementById("echart_nhdbfx"),thime);
        myChart.clear()
        console.log(data,1110100)
        let series = []
        series = data.map(ele=>{
            return {
                name:ele.name,
                stack: '能耗',
                type: "bar",
                barWidth: "50%",
                itemStyle: {

                },

                data: (ele.origlist||[]).map(item=>{
                    return item.origvalue
                })
            }
        })
        series.push(
{
            name:'面积模式',
            type:'pie',
            radius : [30, 110],
            center : ['80%', '50%'],
            roseType : 'area',
            
            label: {
                        normal: {
                            formatter: '{b|{b}：}\n{d}%  ',
                            borderColor: '#aaa',
                            borderWidth: 0,
                            rich: {
                            
                                b: {
                                    fontSize: 12,
                                    lineHeight: 16
                                }
        
                            }
                        }
                    },
            data:cdata
        }
        )
         console.log(series,1110101)
        let option = {
            tooltip: {
                    trigger: 'item',
                    formatter:(params)=> {
                        console.log(params)
                        return `<span style="background:${params.color};width:12px;height:12px;display:inline-block;border-radius:50%;vertical-align: middle;"></span>${(params.componentSubType=='bar'?params.seriesName+" ":" ")+ params.name}<br>
                        &nbsp;&nbsp;&nbsp;${params.value}`+{"1":"kwh","2":"t","3":"m³","4":"L"}[this.energy_type];
                    }
                    
                },
            legend: [{
                data:cspan,
                textStyle:{
                            color:color
                        }
            },{
                data:cspan,
                textStyle:{
                            color:color
                        }
            }],
            xAxis: {
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
            },
            dataZoom: [{
                type: "slider",
                width: '30%',
                show: true,
                start: 0,
                end: 34,
                zoomLock: true,
                left: '30%',
                top: '95%'
            }],
            yAxis: {
                  name:{"1":"电耗(kwh)","2":"水耗(t)","3":"气耗(m³)","4":"油耗(L)"}[this.energy_type],
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
                    },
                     splitLine:{
                        lineStyle:{
                            color:'#666'
                        }
                    }
            },
            toolbox: {
                left:'58%',
                    show: true,
                    feature: {

                        magicType: {
                            type: ['line', 'bar']
                        },

                    }
                },
            grid: [{
                top: 50,
                width: '60%',
                left: 10,
                containLabel: true
            }, {
                top: '50%',
                width: '30%',
                bottom: 0,
                left: 10,
                containLabel: true
            }],
            series:series,
        };
        myChart.setOption(option);
        }
        
    },

    computed:{
        dttype(){
            if(this.time_type==1){
                return "year"
            }
            if(this.time_type==2){
                return "month"
            }
            if(this.time_type==3){
                return "date"
            }
            if(this.time_type==4){
                return "datetime"
            }
        }
    },
    mounted() {
        this.$Spin.hide()
        this.getOrigin()
    }
};
</script>

<style>
.echart_nhdbfx {
    width: 100%;
    height: 380px;
    background: #fff;
    margin-bottom: 20px;
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

.xjcs-city-time {
    margin-left: 180px;
}
</style>

