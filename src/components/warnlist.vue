<template>
<div>
    <div>
        <span class="btn-claerall">
            <span @click="remove()" style="font-size:14px;margin-right:20px;"><Icon type="trash-a" style="font-size:16px" ></Icon> 清除所有警报</span> 
            </span>    
    </div>
    <div class="warn-title">
        <h3>设备报警 <div   style="margin-left:10px;color:#666;float:right;">
             <a :href="`/Public/getWaringList?import=outexcel`" style="font-size:14px;margin-right:20px;"><Icon type="archive" style="font-size:16px" ></Icon> 导出数据</a> 
            <span @click="hide=!hide" style="font-size:14px;margin-right:20px;"><Icon v-if="!hide" type="chevron-down" style="font-size:16px" ></Icon><Icon v-if="hide" type="chevron-up" style="font-size:16px" ></Icon></span> 
            <span @click="getData()"><Icon style="font-size:16px" type="refresh" ></Icon></span></div></h3>
    </div>
    <Table :columns="cols" :data="dataList" :loading="loadding" v-show="!hide"></Table>
    <div class="warn-page" v-show="!hide">
        <Page :total="total" show-elevator :page-size="20" @on-change="change"></Page>
    </div>

    <div class="warn-title" >
        <h3>能耗超标报警 <div   style="margin-left:10px;color:#666;float:right;">
            <!-- <span @click="remove()" style="font-size:14px;margin-right:20px;">
                <Icon type="trash-a" style="font-size:16px" ></Icon> 清除所有警报</span>  -->
                <a :href="`/Public/get_energy_energy_excess?import=outexcel`" style="font-size:14px;margin-right:20px;"><Icon type="archive" style="font-size:16px" ></Icon> 导出数据</a> 
                  <span @click="hide2=!hide2" style="font-size:14px;margin-right:20px;"><Icon v-if="!hide2" type="chevron-down" style="font-size:16px" ></Icon><Icon v-if="hide2" type="chevron-up" style="font-size:16px" ></Icon></span> 
                <span @click="getData2()"><Icon style="font-size:16px" type="refresh" ></Icon></span></div></h3>
    </div>
 <!-- <div class="nh-date">
          时间周期: <DatePicker v-model="model" @on-change="change" type="daterange" split-panels placeholder="选择开始结束时间" style="width: 200px"></DatePicker>
      </div> -->
      <Table :columns="cols2" :data="dataList2" :loading="loadding2"  v-show="!hide2"></Table>
      <div class="warn-page" v-show="!hide2">
        <Page :total="total2" show-elevator :page-size="20" @on-change="change2"></Page>
    </div>
 <div class="warn-page">
    </div>
     <div class="warn-title">
        <h3>通讯报警 
            <div   style="margin-left:10px;color:#666;float:right;">
                <!-- <span @click="remove()" style="font-size:14px;margin-right:20px;"><Icon type="trash-a" style="font-size:16px" ></Icon> 清除所有警报</span>  -->
                <a :href="`/Public/getWaringList?import=outexcel&waring_type=4`" style="font-size:14px;margin-right:20px;"><Icon type="archive" style="font-size:16px" ></Icon> 导出数据</a> 
              <span @click="hide3=!hide3" style="font-size:14px;margin-right:20px;"><Icon v-if="!hide3" type="chevron-down" style="font-size:16px" ></Icon><Icon v-if="hide3" type="chevron-up" style="font-size:16px" ></Icon></span> 
            <span @click="getData3()"><Icon style="font-size:16px" type="refresh" ></Icon></span></div></h3>
    </div>
    <Table :columns="cols" :data="dataList3" :loading="loadding3" v-show="!hide3"></Table>
    <div class="warn-page" v-show="!hide3">
        <Page :total="total3" show-elevator :page-size="20" @on-change="change3"></Page>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            hide:false,
            page: 1,
            total: 100,
            loadding:false,

           
            cols: [{
                    title: '序号',
                    key: 'id',
                },
                {
                    title: '发生时间',
                    key: 'f_collecttime',
                }, {
                    title: '位置说明',
                    key: 'f_address',
                }, {
                    title: '详细说明',
                    key: 'error_code',
                }, {
                    title: '设备ID和名称',
                    key: 'meter_name',
                },{
                        title: '操作',
                        key: 'action',
                        width: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.remove(params.row.id)
                                        }
                                    }
                                }, '清除警报')
                            ]);
                        }
                    }
            ],
            dataList: [],
             page2: 1,
             hide2:false,
            total2: 100,
            loadding2:false,
            dataList2:[],
             page3: 1,
            total3: 100,
            hide3:false,
            loadding3:false,
            dataList3:[],
            cols2:[{
                    title:"机构名称",
                    key:"emp_name"
                },{
                    title:"能耗类型",
                    key:"energy_type_name"
                },
                {
                    title:"时间周期",
                    key:"energy_time_type_name"
                },{
                    title:"能耗值",
                    key:"energy_value"
                },{
                    title:"时间",
                    key:"date_time"
                },{
                        title: '操作',
                        key: 'action',
                        width: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.remove2(params.row)
                                        }
                                    }
                                }, '清除警报')
                            ]);
                        }
                    }],
        }

    },
    methods: {
        change(e) {
            this.page = e
            this.getData()
        },
        change2(e) {
            this.page = e
            this.getData2()
        },
        change3(e) {
            this.page = e
            this.getData3()
        },
        getData() {
            this.loadding = true
            let page = this.page
            this.$http.get("Public/getWaringList", {
                params: {
                    page,
                }
            }).then(res => {
                setTimeout(()=>{
                    this.loadding = false
                },1000)
                
                this.dataList = res.data.lists
                this.total = res.data.count
            }).catch(e=>{
                this.loadding = false
            })
        },
        getData2(){
            this.loadding2 = true
            let page = this.page
                this.$http.get("Public/get_energy_energy_excess",{
                    params:{
                        page,
                        // start_time:this.model[0]?this.model[0].format("yyyy-MM-dd"):"",
                        // end_time:this.model[1]?this.model[1].format("yyyy-MM-dd"):"",
                    }
                }).then(res=>{
                    this.loadding2 = false
                    if(res.data.status = "ok"){
                        this.dataList2 = res.data.lists
                        this.total2 = res.data.count
                    }
                    
                })
                .catch(e=>{
                this.loadding2 = false
            })
            },
        getData3() {
            this.loadding3 = true
            let page = this.page3
            this.$http.get("Public/getWaringList", {
                params: {
                    page,
                    waring_type:4
                }
            }).then(res => {
                setTimeout(()=>{
                    this.loadding3 = false
                },1000)
                
                this.dataList3 = res.data.lists
                this.total3 = res.data.count
            }).catch(e=>{
                this.loadding3 = false
            })
        },
        remove(id){
            let str = id?"ID为"+id+"的":"所有"
            this.$Modal.confirm({
                    title: '警告',
                    content: '<p>是否确认删除'+str+'警报？</p>',
                    onOk: () => {
                       this.clear(id)
                    },
                    onCancel: () => {
                        
                    }
                });
        },
        remove2(item){
            let str = ` ${item.emp_name} 在 ${item.date_time} 能耗值为 ${item.energy_value} 的 ${item.energy_type_name}耗`
            this.$Modal.confirm({
                    title: '警告',
                    content: '<p>是否确认删除'+str+'警报？</p>',
                    onOk: () => {
                      this.$http.get("Public/handle_excess",{params:{
                            id:item.id
                        }}).then(res=>{
                            this.$Message.success('清除警报成功');
                            this.page2 = 1
                            this.getData2()
                        })
                    },
                    onCancel: () => {
                        
                    }
                });
        },
        clear(id){
            this.$http.get("Public/handle_waring",{params:{
                id:id
            }}).then(res=>{
                this.$Message.success('清除警报成功');
                this.page = 1
                this.getData()
            })
        }
    },
    mounted() {
        this.$Spin.hide()
        this.getData()
        this.getData2()
        this.getData3()

    }
}
</script>

<style>
.warn-title{
    margin-top:10px;
    background: #efefef;
    padding: 10px 10px;
}
.btn-claerall{
    padding:5px 20px;
    display:inline-block;
    border:1px solid #ddd;
}
.warn-page {
    text-align: center;
    margin: 10px 0 30px;
}
#app .warn-title h3 a{
    color:#333;
}
</style>
