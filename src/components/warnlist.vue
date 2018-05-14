<template>
<div>
    <div class="warn-title">
        <h3>警报列表 <div   style="margin-left:10px;color:#666;float:right;"><span @click="remove()" style="font-size:14px;margin-right:20px;"><Icon type="trash-a" style="font-size:16px" ></Icon> 清除所有警报</span> <span @click="getData()"><Icon style="font-size:16px" type="refresh" ></Icon></span></div></h3>
    </div>
    <Table :columns="cols" :data="dataList" :loading="loadding"></Table>
    <div class="warn-page">
        <Page :total="total" show-elevator :page-size="20" @on-change="change"></Page>
    </div>

</div>
</template>

<script>
export default {
    data() {
        return {
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
            dataList: []
        }

    },
    methods: {
        change(e) {
            this.page = e
            this.getData()
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

    }
}
</script>

<style>
.warn-title{
    background: #efefef;
    padding: 10px 10px;
}
.warn-page {
    text-align: center;
    margin-top: 30px;
}
</style>
