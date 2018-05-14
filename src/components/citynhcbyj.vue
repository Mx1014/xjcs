<template>
  <div class="map-view">
      <div class="nh-date">
          时间周期: <DatePicker v-model="model" @on-change="change" type="daterange" split-panels placeholder="选择开始结束时间" style="width: 200px"></DatePicker>
      </div>
      <Table :columns="cols" :data="dataList"></Table>
  </div>
</template>
<script>
    export default {
        data(){
            return {
                model:[],
                //model:[],
                cols:[{
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
                }],
                dataList:[]
            }
        },
        methods:{
            change(){
                this.getData()
            },
            getData(){
                this.$http.get("Public/get_energy_energy_excess",{
                    params:{
                        start_time:this.model[0]?this.model[0].format("yyyy-MM-dd"):"",
                        end_time:this.model[1]?this.model[1].format("yyyy-MM-dd"):"",
                    }
                }).then(res=>{
                    if(res.data.status = "ok"){
                        this.dataList = res.data.lists
                    }
                    
                })
            },
        },
        mounted(){
            this.$Spin.hide()
            this.getData()
        }
    }
</script>
<style>
.nh-date{
    margin-bottom: 20px;
    overflow: hidden;
    background: #fff;
    padding: 10px 20px;
}
</style>

