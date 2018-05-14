<template>
  <div class="map-view">
      <div class="nh-date">
         <Form >
             <Row>
                <Col span="8">
                    <FormItem :label-width="120" label="机构:">
                        <Cascader style="width:400px" :data="data" v-model="emp_code" trigger="hover"></Cascader>
                    </FormItem>
                </Col>

            </Row>
            <Row>
                <Col span="8">
                    <FormItem :label-width="120" label="时间周期:">
                        <Select v-model="time_type" style="width:200px">
                            <Option v-for="item in dateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                 <Col span="8">
                <FormItem :label-width="120" label="能源类型:">
                        <Select v-model="energy_type" style="width:200px">
                            <Option  :value="1" >电</Option>
                            <Option  :value="2" >水</Option>
                        </Select>
                    </FormItem></Col>
                    <Col span="8">
                <FormItem :label-width="120" label="能耗值:">
                        <Input v-model="energy_value" style="width:200px" placeholder="请输入">
                            
                        </Input>
                    </FormItem></Col>
                     <Col span="8">
                     <FormItem :label-width="120" label=":">
                     <Button @click="save">保存</Button>
                     </FormItem>
                    </Col>
            </Row>
            
            </Form>
      </div>
      <Table :columns="cols" :data="dataList"></Table>
  </div>
</template>
<script>
    export default {
        data(){
            return {

                emp_code:[],
	            energy_value:"",

                loaded:false,
                 value: [],
                 data: [],
                 time_type:1,
                 energy_type:1,
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
                dataList:[],
                dateList: [{
                label: "月",
                value: 1
            },{
                label: "季度",
                value: 2
            },{
                label: "半年",
                value: 3
            },{
                label: "年",
                value: 4
            }]
            }
        },
       
        methods:{
            change(){
                this.getData()
            },
            getData(){
                this.$http.get("Public/get_energy_quota_list").then(res=>{
                    if(res.data.status = "ok"){
                        this.dataList = res.data.lists
                    }
                    
                })
            },
             getOrigin(){
             let url = "/Empor/employTree"
            this.$http.get(url).then(res=>{
   
                this.data = this.buildTree(res.data.lists)

                console.log(this.data,111)
            }).catch(e=>{
                console.log(e)
            })
        },
        save(){
                let emp_code=this.emp_code[3]
	            let energy_value = this.energy_value
                let  time_type= this.time_type
                let  energy_type= this.energy_type
            this.$http.post("Public/add_energy_energy_quota",{
                emp_code,
                energy_value,
                time_type,
                energy_type
            }).then(res=>{
                if(res.data.status=="ok"){
                    this.$Message.success("设置成功")
                     this.getData()
                }else{
                     this.$Message.error(res.data.msg)
                    
                }
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
                    rlist.push({
                        label:ele.city,
                        value:ele.cityid,
                        children:_buildChildren(clist,level+1)
                    })
                })
                return rlist
            }
            list.forEach(ele=>{
                rList.push({
                    label:ele.city,
                    value:ele.cityid,
                    children:_buildChildren(ele.cityList,2)
                })
            })
            
            

            return rList
        },
        },
        mounted(){
            this.$Spin.hide()
            this.getData()
            this.getOrigin()
        }
    }
</script>
<style>
.nh-date{
    margin-bottom: 20px;
    background: #fff;
    padding: 10px 20px;
}
</style>

