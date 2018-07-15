<template>
    <div class="lzs-home" :style="{'font-size':fontSize}" id="myview">
        <div class="goback" @click="$router.go(-1)"><span class="iconfont icon-fanhui"></span>返回</div>
        <div class="lzs-title">{{city}}节能管理平台</div>
        <div class="lzs-left">
             <div class="main-db" id="main-db">

            </div>
            <div class="main-week" id="main-week">

            </div>
            <div class="main-bar" id="main-bar">

            </div>
        </div>
        <div class="lzs-center">
            <div class="main-map" id="main-map">

            </div>
            <div class="main-yb" id="main-yb">

            </div>
        </div>
        <div class="lzs-right">
             <div class="main-pie" id="main-pie1">

            </div>
            <div class="main-pie" id="main-pie2">

            </div>
        </div>
    </div>
</template>
<script>
require("echarts/lib/component/tooltip");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/grid");
require("echarts/lib/component/visualMap");

require("echarts/lib/component/dataZoom");
require("echarts/lib/component/geo"); // 地理
require("echarts/lib/chart/gauge"); //线
require("echarts/lib/chart/scatter"); //线
require("echarts/lib/chart/bar"); //线
require("echarts/lib/chart/line"); //线
require("echarts/lib/chart/pie"); //线
var lzs =  require("@/lib/lzs");
var bss  =  require("@/lib/bss");
export default {
  data(){
    return {
      thimesss:"thime3",
      fontSize:"20px",
      bl:1,
      city:"",
      chart1:null,
      chart2:null,
      chart3:null,
      chart4:null,
      chart5:null,
      chart6:null,
      chart7:null
    }
  },
  methods: {
    getCityName(){
      
      console.log(process.env)
      this.$http.get("/Public/get_public_city_name").then(res=>{
        this.city = res.data.city
        this.initMap();
      })
    },
    initMap() {
      this.$http.get("/energy/getEmploryMap").then(res=>{
        var echarts = require("echarts/lib/echarts");
        
      echarts.registerMap('lzs', lzs);
          echarts.registerMap('bss', bss);
      let sdata = res.data
      let list = [];
      for (let i in sdata.lists) {
        let item = sdata.lists[i];
        list.push({
          name: item.emp_name,
          value: [parseFloat(item.long), parseFloat(item.lat)],
          item
        });
      }

      var name = "电耗";
      var str = "powertotal";
      var data = list.map(ele => {
        return {
          ...ele,
          value: [...ele.value]
        };
      });
      let myChart = echarts.init(document.getElementById("main-map"));
      this.chart1 = myChart
      myChart.clear()

      myChart.on("click", params => {
        console.log(params);
        if (params.componentSubType == "scatter") {
          var id = params.data.item.emp_code;
          //this.getInfo([id]);
        }
      });

      var max =
        Math.max.apply(
          null,
          data.map(ele => {
            return parseInt(ele.value[2]) || 0;
          })
        ) || 1;
      let option = {
        title:{
          text:`${this.city}纳入项目${sdata.pronum||0}个,监测点共计${sdata.tnum||0}个,当前在线${sdata.zxnum||0}个,离线${sdata.lxnum||0}个`,
          left:'center',
          right:'center',
          textStyle:{
            color:"#999",
            textAlign:"center",
            fontSize:24*this.bl

          }
          

        },
  
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            let sitem = params.data.item
            return `${sitem.emp_name} 共含监测点${sitem.tnum||0}个,当前在线${sitem.zxnum||0}个,离线${sitem.lxnum||0}个`;
          }
        },


        geo: {
          map: "lzs",
          roam:true,
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: this.thimesss == "thime3" ? "#151d4e" : "#003f55",
              borderColor: "#005565"
            },
            emphasis: {
              areaColor: this.thimesss == "thime3" ? "#4285f3" : "#2a333d"
            }
          }
        },
        series: [
          {
            name: name,
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
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      })
      
    },
    initYb() {
      this.$http.get("/energy/getquotalist").then(res=>{
        let data = res.data.info
        var echarts = require("echarts/lib/echarts");
         let color =this.thimesss == "thime3" ?"#4285f3":"#333"
      let myChart = echarts.init(document.getElementById("main-yb"),'light');
      this.chart2 = myChart
      myChart.clear()
      let option = {
        tooltip: {
          formatter: "{b} : {c}"
        },
        series: [
          {
            name: "电",
            type: "gauge",
            radius: '50%',
            max:(data.power_quota)||1,
             pointer: {
                width:2
            },
            center: ["10%", "50%"], // 默认全局居中
                      detail : {
                formatter: function (value) {
                    return value
                },
            },
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 10,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
              show:false,
              textStyle:{
                fontSize: 10*this.bl,
              }
            },
            title : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize: 16*this.bl,
                color
            },
            detail:{
              textStyle:{
                fontSize:12*this.bl,
              }
            },
            data: [{ value: data.power_quota-data.power_value ,name:"电"}]
          },
           {
            name: "水",
            type: "gauge",
            radius: '50%',
            max:data.wather_quota||1,
             pointer: {
                width:2
            },
            center: ["36%", "50%"], // 默认全局居中
                      detail : {
                formatter: function (value) {
                    return value
                },
            },
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 10,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            detail:{
              textStyle:{
                fontSize:12*this.bl,
              }
            },
            axisLabel: {
              show:false,
              textStyle:{
                fontSize: 10*this.bl,
              }
            },
            title : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE

                fontSize: 16*this.bl,

                color
            },
            data: [{ value: data.wather_quota-data.wather_value,name:"水"}]
          },
           {
            name: "油",
            type: "gauge",
            radius: '50%',
            max:(data.oil_quota)||1,
             pointer: {
                width:2
            },
            center: ["63%", "50%"], // 默认全局居中
                      detail : {
                formatter: function (value) {
                    return value
                },
            },
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 10,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            detail:{
              textStyle:{
                fontSize:12*this.bl,
              }
            },
            splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
              show:false
            },
            title : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize: 16*this.bl,
                color
            },
            data: [{ value: data.oil_quota-data.oil_value ,name:"油"}]
          },
           {
            name: "汽",
            type: "gauge",
            radius: '50%',
            max:data.gas_quota||1,
             pointer: {
                width:2
            },
            detail:{
              textStyle:{
                fontSize:12*this.bl,
              }
            },
            center: ["90%", "50%"], // 默认全局居中
                      detail : {
                formatter: function (value) {
                    return value
                },
            },
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 10,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
              show:false
            },
            title : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          
       fontSize: 16*this.bl,
                color
            },
            detail:{
              textStyle:{
                fontSize:12*this.bl,
              }
            },
            data: [{ value: data.gas_quota-data.gas_value,name:"汽"}]
          },
        ]
      };
      myChart.setOption(option, true);
      })
      
    },
    initdb() {
      

      this.$http
        .get("/energy/energytemp")
        .then(res => {
          let dhdata = res.data.origlist.map(ele => {
            return parseFloat(ele.origvalue) || 0;
          });
          let span = res.data.origlist.map(ele => {
            return ele.colltime.substr(ele.colltime.indexOf('-')+1);
          });
          let tempdata = res.data.temp_list.map(ele => {
            return parseFloat(ele.high) || 0;
          });
          console.log(dhdata,span,tempdata)
          let color =this.thimesss == "thime3" ?"#ddd":"#333"
          var echarts = require("echarts/lib/echarts");
          let myChart = echarts.init(document.getElementById("main-db"),'light');
          this.chart3 = myChart
          myChart.clear()
          let option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                animation: false
              }
            },
            axisPointer: {
              link: { xAxisIndex: "all" }
            },
            grid: [
              {
                top: 50*this.bl,
                left: 50*this.bl,
                right: 50*this.bl,
                height: "32%"
              },
              {
                left: 50*this.bl,
                right: 50*this.bl,
                top: 220*this.bl,
                height: "32%"
              }
            ],
            xAxis: [
              {
                type: "category",
                boundaryGap: false,
                axisLine: { onZero: true },
                data: span,
                interval:0,
                axisLabel:{
                    show:true,
                    interval:0,
                    textStyle:{
                      fontSize:12*this.bl,
                      color
                    }
                  },
                  splitLine:{
                    lineStyle:{
                      color:'#666'
                    }
                  },
                  axisLine:{
                    lineStyle:{
                      color
                    }
                  }
              },
              {
                gridIndex: 1,
                type: "category",
                boundaryGap: false,
                axisLine: { onZero: true },
                data: span,
                position: "top",
                
                axisLabel:{
                    show:true,
                    interval:0,
                    textStyle:{
                      fontSize:12*this.bl,
                      color
                    }
                  },
                  splitLine:{
                    lineStyle:{
                      color
                    }
                  },
                  axisLine:{
                    lineStyle:{
                      color
                    }
                  }
              }
            ],
            yAxis: [
              {
                name: "电耗(kwh)",
                nameTextStyle:{
                  fontSize:16*this.bl,
                },
                
                type: "value",
                axisLabel:{
                    show:true,
                    interval:0,
                    textStyle:{
                      fontSize:12*this.bl,
                      color
                    }
                  },
                  splitLine:{
                    lineStyle:{
                      color:"#666"
                    }
                  },
                  axisLine:{
                    lineStyle:{
                      color
                    }
                  }
              },
              {
                gridIndex: 1,
                name: "温度( °C)",
                nameTextStyle:{
                  fontSize:16*this.bl,
                },
                type: "value",
                inverse: true,
                max:40,
                axisLabel:{
                    show:true,
                    interval:0,
                    textStyle:{
                      fontSize:12*this.bl,
                      color
                    }
                  },
                  splitLine:{
                    lineStyle:{
                      color:"#666"
                    }
                  },
                  axisLine:{
                    lineStyle:{
                      color
                    }
                  }
              }
            ],
            series: [
              {
                name: "电耗",
                type: "line",
                symbolSize: 8,
                hoverAnimation: false,
                label:{
                  show:true,
                  position:'top',
                  fontSize:12*this.bl
                },
                data: dhdata
              },
              {
                name: "温度",
                type: "line",
                 xAxisIndex: 1,
                yAxisIndex: 1,
                symbolSize: 8,
                hoverAnimation: false,
                data: tempdata,
                label:{
                  show:true,
                  position:'bottom',
                  fontSize:12*this.bl
                },
              }
            ]
          };
          myChart.setOption(option, true);
        })
        .catch(e => {
          console.log(e)
        });
    },
    initweek() {
      this.$http
        .get("/energy/energyweek",{params:{
          energy_type:1
        }}).then(res=>{
          let data = (res.data.lists||[]).map(ele=>{
            return ele.origvalue
          })
           let color =this.thimesss == "thime3" ?"#ddd":"#333"
           var echarts = require("echarts/lib/echarts");
      let myChart = echarts.init(document.getElementById("main-week"),'light');
      this.chart4 = myChart
      myChart.clear()
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
         grid: 
              {
                top: 50*this.bl,
                left: 50*this.bl,
                right: 50*this.bl,
                height: "70%"
              },
 
        legend: {
          // data: ["邮件营销"]
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            axisLabel:{
                    show:true,
                    interval:0,
                    textStyle:{
                      fontSize:12*this.bl,
                      color
                    }
                  },
                  splitLine:{
                    lineStyle:{
                      color
                    }
                  },
                  axisLine:{
                    lineStyle:{
                      color
                    }
                  }
          }
        ],
        yAxis: [
          {
             name: "电耗(kwh)",
             nameTextStyle:{
                  fontSize:16*this.bl,
                },
            type: "value",
            axisLabel:{
                    show:true,
                    interval:0,
                    textStyle:{
                      fontSize:12*this.bl,
                    color
                    }
                  },
                  splitLine:{
                    lineStyle:{
                      color:'#666'
                    }
                  },
                  axisLine:{
                    lineStyle:{
                      color
                    }
                  }
          }
        ],
        series: [
          {
            // name: "邮件营销",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            label:{
                  show:true,
                  position:'top',
                  fontSize:12*this.bl
                },
            data,
          }
          
        ]
      };
      myChart.setOption(option, true);
        })
     
    },
    initBar() {
        this.$http
        .get("/energy/energyanaly").then(res=>{
          let data = (res.data.lists||[]).map(ele=>{
            return ele.origvalue
          })
          let span = (res.data.lists||[]).map(ele=>{
            return ele.emp_name
          })
          let color =this.thimesss == "thime3" ?"#ddd":"#333"
          var echarts = require("echarts/lib/echarts");
              let myChart = echarts.init(document.getElementById("main-bar"),'light');
              this.chart5 = myChart
              myChart.clear()
              let option = {
                 grid: 
              {
                top: 50*this.bl,
                left: 50*this.bl,
                right: 50*this.bl,
                height: "65%"
              },
                tooltip: {
              trigger: "axis",
              axisPointer: {
                animation: false
              }
            },
                xAxis: {
                  type: "category",
                  data: span,
                  axisLabel:{
                    show:true,
                    interval:0,
                    textStyle:{
                      fontSize:12*this.bl,
                    color
                    }
                  },
                  splitLine:{
                    lineStyle:{
                      color
                    }
                  },
                  axisLine:{
                    lineStyle:{
                      color
                    }
                  }
                },
                yAxis: {
                   name: "电耗(kwh)",
                   nameTextStyle:{
                  fontSize:16*this.bl,
                },
                  type: "value",
                   axisLabel:{
                    show:true,
                    interval:0,
                    textStyle:{
                      fontSize:12*this.bl,
                    color
                    }
                  },
                  splitLine:{
                    lineStyle:{
                      color:'#666'
                    }
                  },
                  axisLine:{
                    lineStyle:{
                      color
                    }
                  }
                },
                series: [
                  {
                    data: data,
                    type: "bar",
                    barWidth:'50%',
                    label:{
                  show:true,
                  position:'top',
                  fontSize:12*this.bl,
                },
                  }
                ]
              };
              myChart.setOption(option, true);
        })
      
    },
    initPie() {
      let color =this.thimesss == "thime3" ?"#ddd":"#333"
      this.$http.get("energy/getpoweranalysis",{params:{
        level_type:1
      }}).then(res=>{
        
        let span = (res.data.year_buldlist||[]).map(ele=>{
          return ele.name
        })
        let yeardata = (res.data.year_buldlist||[]).map(ele=>{
          return {
            name:ele.name,
            value:ele.origvalue
          }
        })
        let weekdata = (res.data.week_buldlist||[]).map(ele=>{
          return {
            name:ele.name,
            value:ele.origvalue
          }
        })
        let mondata = (res.data.month_buldlist||[]).map(ele=>{
          return {
            name:ele.name,
            value:ele.origvalue
          }
        })
        var echarts = require("echarts/lib/echarts");
      let myChart = echarts.init(document.getElementById("main-pie1"),'light');
      this.chart6 = myChart
      myChart.clear()
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: span,
          textStyle:{
            color,
            fontSize:16*this.bl
          }
          
        },
        series: [
          {
            name: "周电耗",
            type: "pie",
            selectedMode: "single",
            radius: [0, "30%"],
center:['53%',"50%"],
            label: {
              normal: {
                 fontSize:12*this.bl,
                position: "inner"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: weekdata
          },
          {
            name: "月电耗",
            type: "pie",
            radius: ["40%", "55%"],
            center:['53%',"50%"],
            label: {
              normal: {
                 fontSize:12*this.bl,
                 position: "inner"
              }
            },
            data: mondata
          },
          {
            name: "年电耗",
            type: "pie",
            radius: ["60%", "75%"],
            center:['53%',"50%"],
            label: {
              normal: {
                fontSize:12*this.bl,
                position: "inner"
              }
            },
            data: yeardata
          }
        ]
      };
      myChart.setOption(option, true);
      })
      
    },
    
    initPie2() {
      let color =this.thimesss == "thime3" ?"#ddd":"#333"
      this.$http.get("energy/getbuildanalysis",{params:{
        level_type:1
      }}).then(res=>{
        let span = (res.data.year_buldlist||[]).map(ele=>{
          return ele.name
        })
        let yeardata = (res.data.year_buldlist||[]).map(ele=>{
          return {
            name:ele.name,
            value:ele.origvalue
          }
        })
        let weekdata = (res.data.week_buldlist||[]).map(ele=>{
          return {
            name:ele.name,
            value:ele.origvalue
          }
        })
        let mondata = (res.data.month_buldlist||[]).map(ele=>{
          return {
            name:ele.name,
            value:ele.origvalue
          }
        })
        var echarts = require("echarts/lib/echarts");
      let myChart = echarts.init(document.getElementById("main-pie2"),'light');
      this.chart7 = myChart
      myChart.clear()
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: span,
          textStyle:{
            color,
            fontSize:16*this.bl
          }
        },
        series: [
          {
            name: "周电耗",
            type: "pie",
            selectedMode: "single",
            radius: [0, "30%"],
            center:['53%',"50%"],
            label: {
              normal: {
                 fontSize:12*this.bl,
                position: "inner"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: weekdata
          },
          {
            name: "月电耗",
            type: "pie",
            radius: ["40%", "55%"],
            center:['53%',"50%"],
            label: {
              normal: {
                 fontSize:12*this.bl,
                 position: "inner"
              }
            },
            data: mondata
          },
          {
            name: "年电耗",
            type: "pie",
            radius: ["60%", "75%"],
            center:['53%',"50%"],
            label: {
              normal: {
                fontSize:12*this.bl,
                position: "inner"
              }
            },
            data: yeardata
          }
        ]
      };
      myChart.setOption(option, true);
      })
      
    },
    resize(){
        var w = document.body.offsetWidth
        if(w<1280){
          w = 1280
        }
        if(w>1920){
          w = 1920
        }
        this.bl = w/1920
        this.fontSize = (this.bl * 20)+'px'
        this.$nextTick(()=>{
          // this.chart1.resize()
          //   this.chart2.resize()
          //   this.chart3.resize()
          //   this.chart4.resize()
          //   this.chart5.resize()
          //   this.chart6.resize()
          //   this.chart7.resize()
            this.initMap();
            this.initYb();
            this.initdb();
            this.initweek();
            this.initBar();
            this.initPie();
            this.initPie2();
        })

    }
  },
  created(){
    var w = document.body.offsetWidth
    if(w<1280){
      w = 1280
    }
    if(w>1920){
      w = 1920
    }
    this.bl = w/1920
    this.fontSize = (this.bl * 20)+'px'

    window.addEventListener("resize",()=>{
      location.reload()
    });
  },
  mounted() {
    this.$Spin.hide();
    this.getCityName()
    
    this.initYb();
    this.initdb();
    this.initweek();
    this.initBar();
    this.initPie();
    this.initPie2();
  }
};
</script>
<style lang="scss" scoped>
$lzs-div-bg:rgba(134, 211, 241, 0.05);
.lzs-home{
  white-space: nowrap;
  text-align: center;
  background: linear-gradient(to top right,#161a49, #161a49 , #14498a);
  margin: -1em;
  padding-top:2em; 
  box-sizing: content-box;
  overflow: auto;
}
.lzs-left {
  width: 22.5em;
  
  display: inline-block;

  vertical-align: top;
  margin-right: 1em;
  .main-db {
    height: 19em;

     background: $lzs-div-bg;
     margin-bottom: 0.5em;
  }
  .main-week {
    height: 12.5em;

     background: $lzs-div-bg;
     margin-bottom: 0.5em;
  }
  .main-bar {
    height: 11.5em;
    background: $lzs-div-bg;
  }
}
.lzs-center {
    
  width: 40em;
  display: inline-block;

  vertical-align: top;
  margin-right: 1em;
  .main-map {
    height: 30em;
     
     background: $lzs-div-bg;
     margin-bottom: .5em;
  }
  .main-yb {
    height: 13.5em;

     background: $lzs-div-bg;
  }
}
.lzs-right {
  width: 25em;
  display: inline-block;
  vertical-align: top;
  .main-pie {
    height: 21.75em;
    background: $lzs-div-bg;
    &:nth-child(1){
      margin-bottom: .5em;
    }
  }
}
.goback{
  position: absolute;
  color: #ddd;
  font-size: 0.9em;
  top: 0.5em;
  left: 0.5em;
  cursor: pointer;
  z-index: 999;
}
.lzs-title{
  color: #ddd;
  font-size: 1.8em;
  margin-top: -1em;
  margin-bottom: 1em;
}
</style>