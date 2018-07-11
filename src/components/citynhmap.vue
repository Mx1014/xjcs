<template>
<div class="nhpm-echart">
  <span class="echart-npmp-map" id="echart-npmp"></span>
  <span class="npmp-data">
        <div class="nhmap-c-data" :class="{actived:type==1}">
            <div class="nhmap-c-data-title"><span style="font-size:20px" class="iconfont icon-shandian" @click="changeType(1)"></span>建筑能耗-电耗数据</div>
            <table class="nhmap-c-table">
                <tr><th>时间</th><th>能耗种类</th><th>能耗数据</th></tr>
                <tr><td>今日</td><td>电耗</td><td>{{info.dangTianData_power||0}}kwh</td></tr>
                <tr><td>昨天</td><td>电耗</td><td>{{info.zuoTianData_power||0}}kwh</td></tr>
                <tr><td>前天</td><td>电耗</td><td>{{info.qianTianData_power||0}}kwh</td></tr>
                <tr><td>本月</td><td>电耗</td><td>{{info.benYueData_power||0}}kwh</td></tr>
                <tr><td>上月</td><td>电耗</td><td>{{info.shangYueData_power||0}}kwh</td></tr>
                <tr><td>今年</td><td>电耗</td><td>{{info.benNianData_power||0}}kwh</td></tr>
                <tr><td>上线至今</td><td>电耗</td><td>{{info.quanBuData_power||0}}kwh</td></tr>
            </table>
        </div>
        <div class="nhmap-c-data" :class="{actived:type==2}">
            <div class="nhmap-c-data-title"><span style="font-size:20px"   class="iconfont icon-shui" @click="changeType(2)"></span>建筑能耗-水耗数据</div>
            <table class="nhmap-c-table">
                <tr><th>时间</th><th>能耗种类</th><th>能耗数据</th></tr>
                <tr><td>今日</td><td>水耗</td><td>{{info.dangTianData_wather||0}}t</td></tr>
                <tr><td>昨天</td><td>水耗</td><td>{{info.zuoTianData_wather||0}}t</td></tr>
                <tr><td>前天</td><td>水耗</td><td>{{info.qianTianData_wather||0}}t</td></tr>
                <tr><td>本月</td><td>水耗</td><td>{{info.benYueData_wather||0}}t</td></tr>
                <tr><td>上月</td><td>水耗</td><td>{{info.shangYueData_wather||0}}t</td></tr>
                <tr><td>今年</td><td>水耗</td><td>{{info.dangTianData_wather||0}}t</td></tr>
                <tr><td>上线至今</td><td>水耗</td><td>{{info.quanBuData_wather||0}}t</td></tr>
            </table>
        </div>
        <br/>
        <div class="nhmap-c-data" :class="{actived:type==3}">
            <div class="nhmap-c-data-title"><span class="iconfont icon-qiyou_gasoline" @click="changeType(3)"></span>建筑能耗-气耗数据</div>
            <table class="nhmap-c-table">
                <tr><th>时间</th><th>能耗种类</th><th>能耗数据</th></tr>
                <tr><td>今日</td><td>气耗</td><td>{{info.benNianData_power1||0}}m³</td></tr>
                <tr><td>昨天</td><td>气耗</td><td>{{info.benNianData_power1||0}}m³</td></tr>
                <tr><td>前天</td><td>气耗</td><td>{{info.benNianData_power1||0}}m³</td></tr>
                <tr><td>本月</td><td>气耗</td><td>{{info.benNianData_power1||0}}m³</td></tr>
                <tr><td>上月</td><td>气耗</td><td>{{info.benNianData_power1||0}}m³</td></tr>
                <tr><td>今年</td><td>气耗</td><td>{{info.benNianData_power1||0}}m³</td></tr>
                <tr><td>上线至今</td><td>气耗</td><td>{{info.benNianData_power1||0}}m³</td></tr>
            </table>
        </div>
        <div class="nhmap-c-data" :class="{actived:type==4}">
            <div class="nhmap-c-data-title"><span class="iconfont icon-qiyou_gasoline" @click="changeType(4)"></span>建筑能耗-油耗数据</div>
            <table class="nhmap-c-table">
                <tr><th>时间</th><th>能耗种类</th><th>能耗数据</th></tr>
                <tr><td>今日</td><td>油耗</td><td>{{info.benNianData_power1||0}}L</td></tr>
                <tr><td>昨天</td><td>油耗</td><td>{{info.benNianData_power1||0}}L</td></tr>
                <tr><td>前天</td><td>油耗</td><td>{{info.benNianData_power1||0}}L</td></tr>
                <tr><td>本月</td><td>油耗</td><td>{{info.benNianData_power1||0}}L</td></tr>
                <tr><td>上月</td><td>油耗</td><td>{{info.benNianData_power1||0}}L</td></tr>
                <tr><td>今年</td><td>油耗</td><td>{{info.benNianData_power1||0}}L</td></tr>
                <tr><td>上线至今</td><td>油耗</td><td>{{info.benNianData_power1||0}}L</td></tr>
            </table>
        </div>
    </span>
</div>
</template>

<script>

export default {
  name: "demo1",
  data() {
    return {
      type:1,
      info:{},
      msg: "",
      mapdata:{},
    };
  },
  methods: {
    getData() {
      this.$http.get("/Index/city_map_data").then(res => {
        if (res.data.status == "OK") {

          let list = []
          for (let i in res.data.lists) {
            let item = res.data.lists[i]
            list.push({
              name: item.city,
              value: [parseFloat(item.long), parseFloat(item.lat)],
              item,
            })
          }
          this.mapdata = list
          this.getInfo(list.map(ele=>{
            return ele.item.cityid
          }))
          this.builderChart()
        }
      }).catch(e => {

      })
    },
    getInfo(ids){
      if(ids.length>0)
      this.$http.get("/Index/city_energy_map_data",{params:{cityid:ids.join(",")}}).then(res => {
        if (res.data.status == "ok") {
            console.log(res)
            this.info = res.data
        }
      }).catch(e => {

      })
    },
    changeType(type){
      this.type = type
      this.builderChart()
    },
    builderChart() {
            var name = "电耗"
            var str = "powertotal"
            if(this.type == 1){
              str = "powertotal"
              name = "电耗"
            }else if(this.type == 2){
              str = "wathertotal"
              name = "水耗"
            }else if(this.type == 3){
              str = "gastotal"
              name = "气耗"
            }else if(this.type == 4){
              str = "oiltotal"
              name = "油耗"
            }
            var data = this.mapdata.map(ele=>{
              return {
                ...ele,
                value:[...ele.value,ele.item[str]]
              }
            })


            var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
require("echarts/lib/component/visualMap");
            
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/component/geo");// 地理

            require("echarts/map/js/province/guangxi.js");
      let myChart = echarts.init(document.getElementById("echart-npmp"));
      
      myChart.on('brushselected', (params)=> {
        var indexs = ((params.batch[0] || []).selected[0] || []).dataIndex
        let ids = []
        for (let i in indexs) {
          let index = indexs[i]
          ids.push(data[index].item.cityid)
        }
        this.getInfo(ids)


      });
      myChart.on('click', (params)=> {
          console.log(params)
          if(params.componentSubType == "scatter"){
            var id = params.data.item.cityid
            this.getInfo([id])
          }

      });

      var max = Math.max.apply(null,data.map(ele=>{return parseInt(ele.value[2])||0}))||1;
      let option = {
        visualMap: {
            min: 0,
            max: max,
            text:['高','低'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['lightskyblue','yellow', 'orangered']
            },
            textStyle:{
              color:'#fff'
            }
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return  `${name}<br>${params.name}:${params.value[2]}`
          }
        },

        brush: {
          toolbox: ['rect', 'polygon'],
          throttleType:'debounce'

        },
        geo: {
         
          map: "广西",
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: this.$thime=='thime3'?"#151d4e":"#003f55",
              borderColor: "#005565"
            },
            emphasis: {
              areaColor: this.$thime=='thime3'?"#4285f3":"#2a333d"
            }
          }
        },
        series: [{
          name:name,
          type: "scatter",
          coordinateSystem: "geo",
          color: "#ffee26",
          data: data,
          symbolSize: function (val) {
                var rv = val[2] / 400;
                if(rv >18){
                  rv = 18
                } 
                if(rv<3){
                  return 3
                }
                return rv
            },
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            emphasis: {
              borderColor: "rgba(255,0,0,.1)",
              borderWidth: 3
            }
          }
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },
  mounted() {
    this.$Spin.hide()
    this.getData()






  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nhpm-echart {
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
 
}

.echart-npmp-map {
  display: inline-block;
  vertical-align: top;
  width: 1000px;
  height: 700px;
  background: #033447;
}

.npmp-data {
  vertical-align: top;
  display: inline-block;
  width: 650px;
  min-height: 700px;
  margin-left: 10px;
}

.nhmap-c-data {
  display: inline-block;
  width: 310px;
  box-sizing: border-box;
  margin-bottom: 20px;
  margin-right: 10px;
}

.nhmap-c-data-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}
.nhmap-c-data-title .iconfont{
  font-size: 30px;
    vertical-align: middle;
}
.nhmap-c-data table {
  border-color: #ddd;
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  width: 100%;
  background: #fff;
  font-size: 14px;
  color: #333;
  border-collapse: collapse;
}

.nhmap-c-data table th,
.nhmap-c-data table td {
  border-radius: 5px;
  font-size: 14px;
  color: #333;
  padding: 8px 0px;
  padding-left: 18px;
}

.nhmap-c-data table th {
  border-bottom: 1px solid #ddd;
  text-align: left;
}
.actived .iconfont{
  color:#f28a24;
}
</style>
