<template>
<div class="map-view mapview-report">
    <div class="xjcs-c-aside">
        <div>
            <Tree ref="tree" :data="treeList" show-checkbox @on-check-change="checkchange"></Tree>
        </div>
    </div>
    <div class="xjcs-c-content">
        <div class="xjcs-report-sel">
            <div class="xjcs-report-yaer">
                <ul>
                    <li @click="selyear = item;getData()" :class="{actived:selyear == item}" v-for="item in datetList" :key="item.title">{{item.title}}年</li>
                </ul>
                <ul class="e-type">
                    <li @click="energy_type = 1;getData()" :class="{actived:energy_type == 1}">电耗</li>
                    <li @click="energy_type = 2;getData()" :class="{actived:energy_type == 2}">水耗</li>
                    <li @click="energy_type = 3;getData()" :class="{actived:energy_type == 3}">气耗</li>
                    <li @click="energy_type = 4;getData()" :class="{actived:energy_type == 4}">油耗</li>
                </ul>
            </div>
            <div class="xjcs-report-month">
                <ul>
                    <li @click="selmonth = item;getData()" :class="{actived:selmonth == null}">全年</li>
                    <li @click="selmonth = item;getData()" :class="{actived:selmonth == item}" v-for="item in selyear.monthList" :key="item.title">{{item.title}}月</li>
                </ul>

            </div>
        </div>
        <div>
            <div id="echart_nhdbfx" class="echart_nhdbfx"></div>
             <div>
                <Table :columns="cols" :row-class-name="rowClassName" :data="dataList"></Table>
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
             dataList:[
                    
                ],
            cols:[],
            menuData,
            treeList: [],
            selyear: {},
            energy_type: 1,
            selmonth: null,
            datetList: [],
            selIds: [],
            dateList: [{
                label: "逐月",
                value: 1
            }]
        };
    },
    methods: {
        checkboxClick(e) {
            e.stopPropagation();
        },
        buildMonthList() {
            var date = new Date()
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var nDate = new Date(year + "/" + month + "/" + "01")
            var minDate = new Date("2017/01/01")
            var tDate = minDate
            var list = []
            while (tDate <= nDate) {
                var tYear = tDate.getFullYear()
                let item = list.find(ele => {
                    return ele.title == tYear
                })
                let obj = {
                    title: tYear,
                    monthList: []
                }
                if (!item) {
                    list.push(obj)
                    item = obj
                }

                var tMonth = tDate.getMonth() + 1
                item.monthList.push({
                    title: tMonth,
                })
                if (tMonth >= 12) {
                    tDate = new Date((tYear + 1) + "/01/" + "01")
                } else {
                    tDate = new Date(tYear + "/" + (tMonth + 1) + "/" + "01")
                }

            }
            console.log(JSON.stringify(list))
            return list

        },
        rowClassName (row, index) {
                if (index === 0) {
                    return 'table-info-row';
                }
                return '';
            },
        getData() {
            let contrasts = this.selIds.join(",")
            let energy_type = this.energy_type
            let month = this.selyear.title
            let selmonth = (this.selmonth || {}).title || ""
            if (selmonth) {
                if (selmonth < 10) {
                    selmonth = "-0" + selmonth
                } else {
                    selmonth = "-" + selmonth
                }
            }

            month += selmonth
            this.$http.get("/Index/city_energy_data", {
                params: {
                    contrasts,
                    energy_type,
                    month,
                }
            }).then((res) => {
                if (res.data.status == 'ok') {
                    if (this.energy_type == 3 || this.energy_type == 4) {
                        res.data = {
                            "status": "ok",
                            "areaList": [{
                                "contrast": "450001",
                                "name": "\u53f3\u6c5f\u533a",
                                "origvalue": 0
                            }, {
                                "contrast": "450002",
                                "name": "\u9756\u897f\u5e02",
                                "origvalue": 0
                            }, {
                                "contrast": "450003",
                                "name": "\u7530\u9633\u53bf",
                                "origvalue": 0
                            }],
                            "originList": [{
                                "contrast": "envir",
                                "name": "\u7530\u9633\u516c\u5b89\u5c40",
                                "cityid": "450003",
                                "origvalue": 0,
                                "parentName": "\u7530\u9633\u53bf"
                            }, {
                                "contrast": "security",
                                "name": "\u7530\u9633\u4eba\u6c11\u6cd5\u9662",
                                "cityid": "450003",
                                "origvalue": 0,
                                "parentName": "\u7530\u9633\u53bf"
                            }],
                            "bulist": [
                                {
            "origvalue":"0",
            "f_build_type":"hospital",
            "name":"医院"
        },
        {
            "origvalue":"0",
            "f_build_type":"office",
            "name":"办公楼"
        },
        {
            "origvalue":"0",
            "f_build_type":"school",
            "name":"学校"
        }
                            ],
                            "msg": "\u83b7\u53d6\u6210\u529f",
                            "month": "2018-03",
                            "energy_name": "\u6c34"
                        }
                    }
                    this.buildchart(res.data)
                    var total = this.buildTotal(res.data);
                    this.buildTable(res.data.areaList,total)
                }
            }).catch(e=>{
                this.buildchart({

                })
                this.dataList = []
            })
        },
        buildTotal(data){
            let list = data.areaList||[]
            var obj = {}
            var allSum = 0
            if(list.length>0){
                let len = (list[0].value||[]).length||0;
                for(let i = 1;i<=len;i++){
                    let sum = 0
                    list.forEach(ele=>{
                        if(i==1){
                            allSum+=(parseFloat(ele.origvalue*100)||0)
                        }
                        sum+= (parseFloat((ele.value[i-1]||{}).value)*100)||0
                    })
                    obj[i] = (sum/100.00)+{"1":"kwh","2":"t","3":"m³","4":"L"}[this.energy_type]
                }

            }
            return {
                name:data.cityname,
                ...obj,
                total_count:(allSum/100.00)+{"1":"kwh","2":"t","3":"m³","4":"L"}[this.energy_type]
            }
        },
         buildTable(list,total){
            this.cols = [{
                title:"名称",
                minWidth:120,
                fixed:"left",
                key:"name",
                className:"cols-name"
            }];
            if(!list){
                 this.dataList =[]
                 return
            }
            let rlist = []
            let flag = false
            list.forEach(ele=>{
                let obj = {
                    name:ele.name,
                    total_count:ele.origvalue+{"1":"kwh","2":"t","3":"m³","4":"L"}[this.energy_type]
                }
                ele.value = ele.value||[]
                let key = 1
                ele.value.forEach(cele=>{
                    obj[key] = (cele.value||0)+{"1":"kwh","2":"t","3":"m³","4":"L"}[this.energy_type]
                    if(!flag){
                        this.cols.push({
                            title:cele.update_time,
                            minWidth:120,
                            key:key
                        })
                    }
                   
                    key++
                })
                flag = true
                rlist.push(obj)

                
            })
            
            this.dataList =[total,...rlist]
            this.$nextTick(()=>{
                this.cols = [...this.cols,{
                title:"总计",
                minWidth:120,
                key:"total_count"
            }]
            })
            
        },
        getOrigin() {
            this.$http.get("/Empor/employTree").then(res => {
                this.treeList = this.buildTree(res.data.lists)
                this.$nextTick(() => {
                    var nodes = this.$refs.tree.getCheckedNodes()
                    console.log(nodes, 1111)
                    this.selIds = nodes.map(ele => {
                        return ele.value
                    })
                    this.getData()
                })
                //this.getData()
            }).catch(e => {
                console.log(e)
            })
        },
        buildTree(list) {
            let rList = []

            var _buildChildren = (list, lv) => {
                if (!list) {
                    return []
                }
                let rlist = []
                list.forEach(ele => {
                    rlist.push({
                        title: ele.city,
                        value: ele.cityid,
                        expand: true,
                        checked: lv == 3,
                        disableCheckbox: lv != 3,
                        children: _buildChildren(ele.regList, lv + 1)
                    })
                })
                return rlist
            }
            list.forEach(ele => {
                rList.push({
                    title: ele.city,
                    value: ele.cityid,
                    expand: true,
                    disableCheckbox: true,
                    children: _buildChildren(ele.cityList, 2)
                })
            })



            return rList
        },
        checkchange(e) {
            this.selIds = e.map(ele => {
                return ele.value
            })
            this.getData()
        },
        buildchart(data) {
            let areaData = (data.areaList||[]).map(ele => {
                return {
                    name: ele.name,
                    value: ele.origvalue
                }
            })
            let areaSpan = (data.areaList||[]).map(ele => {
                return ele.name
            })
            data.bulist = data.bulist || []
            let roseData = data.bulist.map(ele => {
                return {
                    name: ele.name,
                    value: ele.origvalue
                }
            })
            let roseSpan = data.bulist.map(ele => {
                return ele.name
            })
data.originList=data.originList||[]
            let circelData = data.originList.map(ele => {
                return {
                    name: ele.name,
                    value: ele.origvalue
                }
            })
            let circelSpan = data.originList.map(ele => {
                return ele.name
            })
            var color = this.$thime=='thime3'?"#ddd":"#000"
            color = this.$thime=='thime4'?"#ddd":color
            var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/legend');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/chart/pie"); //线
            var thime = this.$thime=='thime3'?"light":"default"
            var myChart = echarts.init(document.getElementById("echart_nhdbfx"),thime);


            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter:(params)=> {
                        return `<span style="background:${params.color};width:12px;height:12px;display:inline-block;border-radius:50%;vertical-align: middle;"></span>${params.name}<br>
                        &nbsp;&nbsp;&nbsp;${params.value}`+{"1":"kwh","2":"t","3":"m³","4":"L"}[this.energy_type];
                    }
                    
                },
                legend: [{
                    orient: 'vertical',
                    x: 'left',
                    data: circelSpan,
                    textStyle:{
                        color
                    }
                }, {
                    orient: 'vertical',
                    x: 640,
                    x: 640,
                    data: roseSpan,
                    textStyle:{
                        color
                    }
                }],
                grid: [{
                    top: 50,
                    width: '50%',
                    bottom: '0',
                    left: 10,
                    containLabel: true
                }, {
                    top: '55%',
                    width: '50%',
                    bottom: 0,
                    left: 10,
                    containLabel: true
                }],
                series: [{
                        name: '',
                        type: 'pie',
                        // color:["#ffac4a","#62cd6c","#7ef1ab","#ffda55","#f86f99","#9d5de6","#7da4e7"],
                        radius: ['50%', '65%'],
                        center: ['40%', '50%'],
                        startAngle: 0,
                        label: {
                            normal: {
                                formatter: '{b|{b}}\n{d}%   ',
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
                        data: circelData
                    },
                    {
                        name: '',
                        type: 'pie',
                        color: ["#ffac4a", "#62cd6c", "#7ef1ab", "#ffda55", "#f86f99", "#9d5de6", "#7da4e7"],
                        radius: '46%',
                        center: ['40%', '50%'],
                        avoidLabelOverlap: true,
                        tooltip: {
                    trigger: 'item',
                    formatter:(params)=> {
                        return `<span style="background:${params.color};width:12px;height:12px;display:inline-block;border-radius:50%;vertical-align: middle;"></span>${params.name}<br>
                        &nbsp;&nbsp;&nbsp;${params.value}`+{"1":"kwh","2":"t","3":"m³","4":"L"}[this.energy_type];
                    },
                    
                },
                        startAngle: 0,
                        label: {
                            normal: {
                                formatter: '{b}\n{d}%   ',
                                position: 'inner',
                                verticalAlign: 'top',
                                align: 'left',
                                color:'#333',
                                lineHeight: 24,
                                fontSize: 8,
                            },
                            rich: {}
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: areaData
                    },
                    {
                        name: '',
                        type: 'pie',
                        radius: ['20%', '35%'],
                        center: ['85%', '50%'],
                        roseType: 'area',
                        label: {
                            normal: {
                                formatter: '{b|{b}}\n{d}%   ',
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
                        data: roseData
                    }
                ]
            };
            myChart.setOption(option);
        }
    },

computed:{
    exporturl(){
              let contrasts = this.selIds.join(",")
            let energy_type = this.energy_type
            let month = this.selyear.title
            let selmonth = (this.selmonth || {}).title || ""
            if (selmonth) {
                if (selmonth < 10) {
                    selmonth = "-0" + selmonth
                } else {
                    selmonth = "-" + selmonth
                }
            }

            month += selmonth
           return `/Index/city_energy_data?import=outexcel&contrasts=${contrasts}&energy_type=${energy_type}&month=${month}`
        }
},
    mounted() {
        this.$Spin.hide()
        this.datetList = this.buildMonthList()
        this.selyear = this.datetList[this.datetList.length - 1]
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

.mapview-report {
    background: #fff;
}

.xjcs-report-sel {
    overflow: hidden;
    padding: 20px 0;
}

.xjcs-report-yaer {
    overflow: hidden;
    cursor: pointer;
}

.xjcs-report-yaer ul.e-type li:nth-child(1) {
    margin-left: 150px;
}

.xjcs-report-yaer ul li {
    float: left;
    padding: 10px 35px;
    list-style: none;
    border: 1px solid #ddd;
    margin-left: -1px;
    margin: 0;
    cursor: pointer;
}

.xjcs-report-yaer ul li:nth-child(1) {
    border-right: none
}

.xjcs-report-yaer ul li.actived {
    background: #f28a24;
    color: #fff;
}

.xjcs-report-month ul {
    margin-top: 20px;
    background: #f2f6fa;
    padding: 10px 0;
    height: 50px;
    clear: both;
}

.xjcs-report-month ul li {
    float: left;
    list-style: none;
    margin: 0 10px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: center;
    border-radius: 100%;
    cursor: pointer;
}

.xjcs-report-month ul li:nth-child(1) {
    border-right: none
}

.xjcs-report-month ul li.actived {
    background: #f28a24;
    color: #fff;
}
</style>
<style>

.table-info-row{
    font-size:1.2em;
}
.table-info-row::after{
    font-family: Ionicons;    
   content:"\F104";
   font-size:1em;
   position:absolute;
   top:13px;
   left:5px;
}
.table-info-row .cols-name .ivu-table-cell{
    text-align:left;
}
.cols-name .ivu-table-cell{
    text-align:center;
}
</style>

