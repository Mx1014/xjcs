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
      <div class="xjcs-c-content">
          <div class="xjcs-c-form">
                <Form >
            <Row>
                <Col span="8">
                          <FormItem :label-width="120" label="时间周期:">
                        <DatePicker @on-ok="getData()" type="daterange" v-model="date" confirm :options="options2" placeholder="选择时间" style="width: 200px"></DatePicker>
                    </FormItem>

                </Col>
                
                 <Col span="8">
                <FormItem :label-width="120" label="能源类型:" >
                        <Select v-model="energy_type" style="width:200px"  @on-change="getData()">
                          <Option  :value="1" >电耗</Option>
                            <Option  :value="2" >水耗</Option>
                             <Option  :value="3" >气耗</Option>
                            <Option  :value="4" >油耗</Option>
                        </Select>
                    </FormItem></Col>
                    <Col span="8">
                     <FormItem :label-width="120" label="统计方式:" >
                        <Select v-model="selete_type" style="width:200px"  @on-change="getData()">
                          <Option  :value="1" >总耗能</Option>
                            <Option  :value="2" >人均耗能</Option>
                             <Option  :value="3" >单位面积耗能</Option>
                        </Select>
                    </FormItem></Col>
                   
            </Row>
            </Form>
          </div>
        <div>
            <!-- <div id="echart_nhzl" class="echart_nhpmfx"></div> -->
            <div>
                <Table :columns="cols" :data="dataList"></Table>
                   <div class="export-data">
                     <a :href="exporturl" target="_blank">导出数据</a>
                </div>
            </div>
        </div>
      </div>
             <div class="xjcs-c-right">
        <div id="echart-nhzl-2" class="echart-nhzl-22"></div>
      </div>
  </div>
</template>

<script>
import menuData from "@/config/menuData";

export default {
    data() {
        return {
            menuData,
            sellevel:1,
            energy_type:1,
            selete_type:1,
            date:[new Date(),new Date()],
            ids:[],
            time_type:1,
            cols:[],
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
            treeList:[],
                       
                dataList:[
                    
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
            }]
        };
    },
    computed:{
      
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
            let selete_type   = this.selete_type  
            let energy_type = this.energy_type
            let quota_type = "1"
            let contrasts  = this.ids.join(',')
            let level  = this.sellevel
            this.$http.get("Index/ranking_analysis_data",{
                params:{
                    time_type,
                    start_time,
                    end_time,
                    statis_type,
                    energy_type,
                    selete_type,
                    quota_type,
                    contrasts,
                    level
                }
            }).then(res=>{
                if(res.data.status=="ok")
                // this.buildchart(res.data.lists)
                (res.data.lists||[]).sort((a,b)=>{
                    return parseFloat(b.origvalue)-parseFloat(a.origvalue)
                })
                this.buildchart2([...res.data.lists])
                this.buildTable(res.data.lists)
            }).catch(e=>{
                this.buildchart2([])
                this.buildTable([])
            })
        },
         checkchange(e){
            this.ids = e.map(ele=>{
                return ele.value
            })
            this.getData()
        },
        buildTable(data){

            let name = '总耗能'
            if(this.selete_type==2){
                name = '人均耗能'
            }
             if(this.selete_type==3){
                name = '单位面积耗能'
            }
            this.cols= [{
                        title: '排名',
                        key: 'index'
                    },
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: name,
                        key: 'value'
                    }
                ]
            let index = 0
            
            let list = data.map((ele)=>{
                return {
                    index:++index,
                    name:ele.name,
                    value:(ele.origvalue||0)+{"1":"kwh","2":"t","3":"m³","4":"L"}[this.energy_type]+{1:"",2:"/人",3:"/㎡"}[this.selete_type]
                }
            })
            console.log(list,1488878)
            
            this.dataList = list
        },
        buildchart(data){

            let span = data.map(ele=>{
                return ele.name
            })
            let cdata = data.map(ele=>{
                return ele.origvalue
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
            title: {
                
            },
            toolbox: {
                    show: true,
                    feature: {

                        magicType: {
                            type: ['line', 'bar']
                        },

                    }
                },
            tooltip: {},
            
            xAxis: {
                data: span
            },
            yAxis: {
                 name:{"1":"电耗(kwh)","2":"水耗(t)","3":"气耗(m³)","4":"油耗(L)"}[this.energy_type]+{1:"",2:"/人",3:"/㎡"}[this.selete_type],
            },
            series: [
                {
                 name: "能耗",
                type: "bar",
                barWidth:15,
                color:"#3394f2",
                itemStyle:{

                },
                data: cdata
                }
            ]
            };
                myChart.setOption(option);
            },
            buildchart2(data){
                let num = 5
                if(data.length>num){
                    data = data.splice(0,num)
                }
                else{
                    num = data.length
                }
            let span = data.map(ele=>{
                return ele.name
            })
            let cdata = data.map(ele=>{
                return ele.origvalue
            })
            var color = this.$thime=='thime3'?"#ddd":"#000"
                        color = this.$thime=='thime4'?"#ddd":color
               var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/chart/line"); //线
            require("echarts/lib/chart/bar"); //线
          
                var myChart = echarts.init(document.getElementById("echart-nhzl-2"));


                let option = {
                    left:15,
            title: {
                text: "耗能top"+num,
                textStyle:{
                        color,
                    },
            },
            toolbox: {
                    left:'80%',
                    right:20,
                    show: true,
                    feature: {

                        magicType: {
                            type: ['line', 'bar']
                        },

                    }
                },
            tooltip: {},
            grid:{
                left:60
            },
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
            yAxis: {
                name:{"1":"电耗(kwh","2":"水耗(t","3":"气耗(m³","4":"油耗(L"}[this.energy_type]+{1:"",2:"/人",3:"/㎡"}[this.selete_type]+")",
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
            series: [
                {
                left:15,
                name: "能耗",
                type: "bar",
                barWidth:15,
                itemStyle:{

                },
                data: cdata
                }
            ]
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
        },
        exporturl(){
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
            let selete_type   = this.selete_type  
            let energy_type = this.energy_type
            let quota_type = "1"
            let contrasts  = this.ids.join(',')
            let level  = this.sellevel
           return `/Index/ranking_analysis_data?import=outexcel&start_time=${start_time}&end_time=${end_time}&statis_type=${statis_type}&selete_type=${selete_type}&energy_type=${energy_type}&quota_type=${quota_type}&contrasts=${contrasts}&level=${level}&time_type=${time_type}`
        }
    },
    mounted() {
        this.$Spin.hide()
        this.getOrigin()
    }
};
</script>

<style>
.echart-nhzl-22{
    width: 300;
    height: 280px;
    background: #fff;
}
.echart_nhpmfx {
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

