<template>
<div class="nhpm-echart">
  <span class="echart-npmp-map" id="echart-npmp"></span>
  <span class="npmp-data">
        <div class="nhmap-c-data">
            <div class="nhmap-c-data-title">建筑能耗-电耗数据</div>
            <table class="nhmap-c-table">
                <tr><th>时间</th><th>能耗种类</th><th>能耗数据</th></tr>
                <tr><td>今日</td><td>电耗</td><td>{{info.dangTianData_power}}</td></tr>
                <tr><td>昨天</td><td>电耗</td><td>{{info.zuoTianData_power}}</td></tr>
                <tr><td>前天</td><td>电耗</td><td>{{info.qianTianData_power}}</td></tr>
                <tr><td>本月</td><td>电耗</td><td>{{info.benYueData_power}}</td></tr>
                <tr><td>上月</td><td>电耗</td><td>{{info.shangYueData_power}}</td></tr>
                <tr><td>今年</td><td>电耗</td><td>{{info.benNianData_power}}</td></tr>
                <tr><td>全部</td><td>电耗</td><td>{{info.quanBuData_power}}</td></tr>
            </table>
        </div>
        <div class="nhmap-c-data">
            <div class="nhmap-c-data-title">建筑能耗-水耗数据</div>
            <table class="nhmap-c-table">
                <tr><th>时间</th><th>能耗种类</th><th>能耗数据</th></tr>
                <tr><td>今日</td><td>水耗</td><td>{{info.dangTianData_wather}}</td></tr>
                <tr><td>昨天</td><td>水耗</td><td>{{info.zuoTianData_wather}}</td></tr>
                <tr><td>前天</td><td>水耗</td><td>{{info.qianTianData_wather}}</td></tr>
                <tr><td>本月</td><td>水耗</td><td>{{info.benYueData_wather}}</td></tr>
                <tr><td>上月</td><td>水耗</td><td>{{info.shangYueData_wather}}</td></tr>
                <tr><td>今年</td><td>水耗</td><td>{{info.dangTianData_wather}}</td></tr>
                <tr><td>全部</td><td>水耗</td><td>{{info.quanBuData_wather}}</td></tr>
            </table>
        </div>
        <br/>
        <div class="nhmap-c-data">
            <div class="nhmap-c-data-title">建筑能耗-气耗数据</div>
            <table class="nhmap-c-table">
                <tr><th>时间</th><th>能耗种类</th><th>能耗数据</th></tr>
                <tr><td>今日</td><td>气耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>今日</td><td>气耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>今日</td><td>气耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>今日</td><td>气耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>今日</td><td>气耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>今日</td><td>气耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>今日</td><td>气耗</td><td>{{info.benNianData_power1}}</td></tr>
            </table>
        </div>
        <div class="nhmap-c-data">
            <div class="nhmap-c-data-title">建筑能耗-油耗数据</div>
            <table class="nhmap-c-table">
                <tr><th>时间</th><th>能耗种类</th><th>能耗数据</th></tr>
                <tr><td>今日</td><td>油耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>昨天</td><td>油耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>前天</td><td>油耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>本月</td><td>油耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>上月</td><td>油耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>今年</td><td>油耗</td><td>{{info.benNianData_power1}}</td></tr>
                <tr><td>全部</td><td>油耗</td><td>{{info.benNianData_power1}}</td></tr>
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
      info:{},
      msg: ""
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
          this.builderChart(list)
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
    builderChart(data) {




            var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/component/geo");// 地理
            require("echarts/map/js/china");
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

      let option = {
        
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return params.name 
          }
        },
        brush: {
          toolbox: ['rect', 'polygon'],
          throttleType:'debounce'

        },
        geo: {
         
          map: "china",
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: "#003f55",
              borderColor: "#005565"
            },
            emphasis: {
              areaColor: "#2a333d"
            }
          }
        },
        series: [{
          name: "pm2.5",
          type: "scatter",
          coordinateSystem: "geo",
          color: "#ffee26",
          data: data,
          symbolSize: 12,
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
</style>
