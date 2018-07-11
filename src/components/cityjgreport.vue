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
                       <li    @click="energy_type = 1;getData()"  :class="{actived:energy_type == 1}">电耗</li>
                        <li   @click="energy_type = 2;getData()" :class="{actived:energy_type == 2}">水耗</li>
                                    <li    @click="energy_type = 3;getData()"  :class="{actived:energy_type == 3}">气耗</li>
                        <li   @click="energy_type = 4;getData()" :class="{actived:energy_type == 4}">油耗</li>
                   </ul>
               </div>
               <div class="xjcs-report-month">
                   <ul>
                       <li  @click="selmonth = item;getData()"  :class="{actived:selmonth == null}">全年</li>
                        <li @click="selmonth = item;getData()" :class="{actived:selmonth == item}" v-for="item in selyear.monthList" :key="item.title">{{item.title}}月</li>
                   </ul>
                 
               </div>
          </div>
        <div>
            <Table :columns="cols" :data="dataList"></Table>
             <div class="export-data">
                     <a :href="exporturl" target="_blank">导出数据</a>
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
            menuData,
            treeList:[],
            selyear:{},
            cols:[{
                title:"机构名称",
                key:"name"
            },{
                title:"总计",
                key:"total_count"
            }],
            dataList:[],
            energy_type:1,
            selmonth:null,
            datetList:[],
            selIds:[],
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
        buildMonthList(){
				var date = new Date()
				var year = date.getFullYear()
				var month = date.getMonth()+1
				var nDate = new Date(year+"/"+month+"/"+"01")
				var minDate = new Date("2017/01/01")
				var tDate = minDate
				var list = []
				while(tDate<=nDate){
                    var tYear = tDate.getFullYear()
                    let item = list.find(ele=>{
                        return ele.title == tYear
                    })
                    let obj = {
                        title:tYear,
                        monthList:[]
                    }
                    if(!item){
                        list.push(obj)
                        item = obj
                    }
                    
					var tMonth = tDate.getMonth()+1
					item.monthList.push({
						title:tMonth,
					})
					if(tMonth>=12){
						tDate = new Date((tYear+1)+"/01/"+"01")
					}else{
						tDate = new Date(tYear+"/"+(tMonth+1)+"/"+"01")
					}
					
				}
				console.log(JSON.stringify(list))
				return list
				
			},
        getData(){
            let contrasts = this.selIds.join(",")
            let energy_type = this.energy_type
            let month = this.selyear.title
            let selmonth = (this.selmonth||{}).title||""
            if(selmonth){
                if(selmonth<10){
                    selmonth= "-0"+selmonth
                }else{
                     selmonth= "-"+selmonth
                }
            }

            month+=selmonth
            this.$http.get("Index/institutional_report",{
                params:{
                    contrasts,
                    energy_type,
                    month,
                }
            }).then((res)=>{
                if(res.data.status=='ok'){
                                     if(this.energy_type == 3||this.energy_type == 4){
                        res.data = []
                    }
                    this.buildTable(res.data.lists)
                }
            }).catch(e=>{
                this.dataList=[]
            })
        },
         getOrigin(){
            this.$http.get("/Empor/employTree").then(res=>{
                this.treeList = this.buildTree(res.data.lists)
                 this.$nextTick(()=>{
                        var nodes = this.$refs.tree.getCheckedNodes()
                        console.log(nodes,1111)
                        this.selIds =nodes.map(ele=>{
                            return ele.value
                        })
                        this.getData()
                    })
                //this.getData()
            }).catch(e=>{
                console.log(e)
            })
        },
        buildTree(list){
            let rList = []

            var _buildChildren = (list,lv)=>{
                if(!list){
                    return []
                }
                let rlist = []
                list.forEach(ele=>{
                    rlist.push({
                        title:ele.city,
                        value:ele.cityid,
                        expand:true,
                        checked:lv==4,
                        disableCheckbox:lv!=4,
                        children:_buildChildren(ele.regList||ele.empList,lv+1)
                    })
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
        checkchange(e){
            this.selIds = e.map(ele=>{
                return ele.value
            })
            this.getData()
        },
        buildTable(list){
            this.cols = [{
                title:"机构名称",
                minWidth:120,
                fixed:"left",
                key:"name"
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
                    total_count:ele.total_count+{"1":"kwh","2":"t","3":"m³","4":"L"}[this.energy_type]
                }
                ele.value = ele.value||[]
                let key = 1
                ele.value.forEach(cele=>{
                    obj[key] = (cele.origvalue||0)+{"1":"kwh","2":"t","3":"m³","4":"L"}[this.energy_type]
                    if(!flag){
                        this.cols.push({
                            title:cele.collectime,
                            minWidth:120,
                            key:key
                        })
                    }
                   
                    key++
                })
                flag = true
                rlist.push(obj)

                
            })

            this.dataList =rlist
            this.$nextTick(()=>{
                this.cols = [...this.cols,{
                title:"总计",
                minWidth:120,
                key:"total_count"
            }]
            })
            
        }
        
    },

    computed:{
        exporturl(){
                         let contrasts = this.selIds.join(",")
            let energy_type = this.energy_type
            let month = this.selyear.title
            let selmonth = (this.selmonth||{}).title||""
            if(selmonth){
                if(selmonth<10){
                    selmonth= "-0"+selmonth
                }else{
                     selmonth= "-"+selmonth
                }
            }

            month+=selmonth
           return `/Index/institutional_report?import=outexcel&contrasts=${contrasts}&energy_type=${energy_type}&month=${month}`
        }
    },
    mounted() {
        this.$Spin.hide()
        this.datetList = this.buildMonthList()
        this.selyear = this.datetList[ this.datetList.length-1]
        this.getOrigin()
        
        
    }
};
</script>

<style scoped>
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
}
.xjcs-report-yaer ul.e-type li:nth-child(1){
    margin-left: 150px;
}
.xjcs-report-yaer ul li {
    float: left;
    padding: 10px 35px;
    list-style: none;
    border: 1px solid #ddd;
    margin-left: -1px;
    margin: 0;
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
}

.xjcs-report-month ul li:nth-child(1) {
    border-right: none
}

.xjcs-report-month ul li.actived {
    background: #f28a24;
    color: #fff;
}
</style>

