<template>
  <div class="map-view nhdy">
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
                            <Option  :value="3" >油</Option>
                            <Option  :value="4" >气</Option>
                        </Select>
                    </FormItem></Col>
                    <Col span="8">
                <FormItem :label-width="120" label="能耗值:">
                        <Input v-model="energy_value" style="width:200px" placeholder="请输入">
                            
                        </Input>
                    </FormItem></Col>
                     <Col span="8">
                     <FormItem :label-width="120" label=" ">
                     <Button @click="save">保存</Button>
                     </FormItem>
                    </Col>
            </Row>
            
            </Form>
      </div>
      <Table :columns="cols" :data="dataList"></Table>
      <Modal v-model="modal1" :width='980' @on-ok="saveEdit">
           <Form >
             <Row>
                <Col span="24">
                 <FormItem :label-width="120" label="机构:">
                   <span :width="200" readonly v-model="editItem.emp_name">{{editItem.emp_name}}</span>
                   </FormItem>
                </Col>

            </Row>
            <Row>
                <Col span="8">
                    <FormItem :label-width="120" label="时间周期:">
                        <Select v-model="editItem.time_type" style="width:200px">
                            <Option v-for="item in dateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                 <Col span="8">
                <FormItem :label-width="120" label="能源类型:">
                        <Select v-model="editItem.energy_type" style="width:200px">
                            <Option  :value="1" >电</Option>
                            <Option  :value="2" >水</Option>
                            <Option  :value="3" >油</Option>
                            <Option  :value="4" >气</Option>
                        </Select>
                    </FormItem></Col>
                    <Col span="8">
                <FormItem :label-width="120" label="能耗值:">
                        <Input v-model="editItem.energy_value" style="width:200px" placeholder="请输入">
                            
                        </Input>
                    </FormItem></Col>
            </Row>
            
            </Form>
      </Modal>
  </div>
</template>
<script>
    export default {
        data(){
            return {
                modal1:false,
                emp_code:[],
	            energy_value:"",
                editItem:{
                    energy_time_type_name:"",
                    emp_name:"",
                    emp_code:"",
                    time_type:"",
                    energy_value:"",
                    energy_type:"",
                },
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
                },{
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        width: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.edit(params.row)
                                        }
                                    }
                                }, ' 编辑 '),
                                h('span', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.del(params.row)
                                        }
                                    }
                                }, ' 删除 ')
                            ]);
                        }
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
        edit(item){
            this.editItem = {
                ...item,
                energy_type:parseInt(item.energy_type),
                time_type:{"月":1,"季度":2,"半年":3,"年":4}[item.energy_time_type_name]
            }
            this.modal1 = true
            console.log(item)
        },
        saveEdit(){
            let id = this.editItem.id
            let emp_code=this.editItem.emp_code
	            let energy_value = this.editItem.energy_value
                let  time_type= this.editItem.time_type
                let  energy_type= this.editItem.energy_type
            this.$http.post("Public/edit_energy_quota",{
                id,
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
        del(item){
            let id = item.id
            this.$http.post("Public/del_energy_quota_find",{
                id,
            }).then(res=>{
                if(res.data.status=="ok"){
                    this.$Message.success("删除成功")
                     this.getData()
                }else{
                     this.$Message.error(res.data.msg)
                    
                }
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
    overflow:visible;
}
.map-view.nhdy{
    overflow:visible;
}
</style>

