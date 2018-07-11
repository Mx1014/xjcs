<template>
<div class="map-view">
    <div class="xjcs-c-content">
        <div>
            <div class="hjxx-info">
                <div class="cjcs-e-info">
                   <span class="iconfont icon-dingwei"></span>&nbsp;&nbsp;{{info.city_name}}
                </div>
                <div class="cjcs-e-pm">
                    <span class="iconfont icon-kongqizhiliang"></span> &nbsp;{{info.now.air_quality.city.pm25}} {{info.now.air_quality.city.quality}}
                </div>
                <div class="cjcs-e-wd">
                    <span class="wd-count">{{info.now.temperature}}<sup style="top:-1em">。</sup></span>
                    <span class="wd-info"><span class="iconfont icon-tubiaozhizuomobanyihuifu-"> &nbsp;</span>{{info.now.text}} </span>
                    <span class="wd-info"><span class="iconfont icon-shui"> &nbsp;</span>湿度{{info.now.humidity}}%</span>
                    <span class="wd-info"><span class="iconfont icon-fengli"> &nbsp;</span>北风{{info.now.wind_scale}}级</span>
                </div>
            </div>
        </div>
        <div>
            <div id="echart_nhdbfx" class="echart_nhdbfx"></div>
            <div id="echart_nhdbfx2" class="echart_nhdbfx"></div>
            <div id="echart_nhdbfx3" class="echart_nhdbfx"></div>

        </div>
    </div>
</div>
</template>

<script>
import menuData from "@/config/menuData";

export default {
    data() {
        return {
            menuData,
            info: {
                now: {
                    air_quality: {
                        city: {}
                    }
                }
            },
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
        getData() {
            this.$http.get("/Index/envir_information").then(res => {
                if (res.data.status == "OK") {
                    this.info = res.data.weather[0]
                    let data = this.info.scienlist
                    let list = []
                    let humidity = []
                    let pm25 = []
                    let category = []
                    data.forEach(ele => {
                        list.push(
                            [ele.open, ele.close, ele.low, ele.high]
                        )
                        category.push(
                            ele.date
                        )
                        humidity.push(
                            ele.humidity
                        )
                        pm25.push(
                            ele.pmtwo
                        )
                    })
                    this.buildchart(category, list)
                    this.buildchart2(category, pm25)
                    this.buildchart3(category, humidity)

                }
            })
        },
        buildchart(category, list) {
            console.log(category, list)

            var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/chart/candlestick"); //线

 var color = this.$thime=='thime3'?"#4285f3":"#000"
  color = this.$thime=='thime4'?"#24936e":color
            var myChart = echarts.init(document.getElementById("echart_nhdbfx"));


            var upColor = '#f28a24';
            let option = {
                title: {
                    text: '天气趋势图',
                    left: 10,
                    top:5,
                     textStyle:{
                        color,
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },formatter: function (params) {
                        console.log(params[0].data)
                        return "气温"+"<br>"+"最低"+params[0].data[1]+"<br/>"+"最高"+params[0].data[2]
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%'
                },
                xAxis: {
                    type: 'category',
                    data: category,
                    axisTick: {
                        alignWithLabel: true,
                        lineStyle:{
                            color
                        }
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:color
                        }
                    }
                },
                yAxis: {
                    name:"温度 ℃",
                    show: true,
                    nameTextStyle:{
                        color,
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:color
                        }
                    }
                },
                series: [{
                        name: '气温',
                        type: 'candlestick',
                        data: list,
                        barWidth: 10,
                        itemStyle: {
                            normal: {
                                color: upColor,
                                color0: upColor,
                                borderColor: upColor,
                                borderColor0: upColor
                            }
                        }
                    }

                ]
            };
            myChart.setOption(option);
        },
        buildchart2( category,list) {

var color = this.$thime=='thime3'?"#4285f3":"#000"
 color = this.$thime=='thime4'?"#24936e":color
            var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/chart/line"); //线
            require("echarts/lib/chart/bar"); //线

            var thime = this.$thime=='thime3'?"light":"default"
            var myChart = echarts.init(document.getElementById("echart_nhdbfx2"),thime);


            let option = {
                title: {
                    text: 'pm2.5',
                    left: 10,
                    top:5,
                    textStyle:{
                        color,
                    },
                },
                tooltip: {

                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%'
                },
                toolbox: {
                    left:"90%",
                show: true,
                feature: {
                    magicType: {
                    type: ["line", "bar"]
                    }
                }
                },
                xAxis: {
                    type: 'category',
                    data: category,
                    axisTick: {
                        alignWithLabel: true,
                        lineStyle:{
                            color
                        }
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:color
                        }
                    }
                },
                yAxis: {
                    name:"pm2.5（μg/m3）",
                    show: true,
                    nameTextStyle:{
                        color,
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:color
                        }
                    }
                },
                series: [{
                        name: 'pm2.5',
                        type: 'line',
                        data: list,
                        barWidth: 10,
                        smooth:true
                    }

                ]
            };
            myChart.setOption(option);
        },
       buildchart3( category,list) {

           var color = this.$thime=='thime3'?"#4285f3":"#000"
            color = this.$thime=='thime4'?"#24936e":color
            var echarts = require('echarts/lib/echarts');
            require('echarts/lib/component/tooltip');
            require('echarts/lib/component/toolbox');
            require('echarts/lib/component/title');
            require("echarts/lib/component/grid");
            require("echarts/lib/component/dataZoom");
            require("echarts/lib/chart/line"); //线

            var thime = this.$thime=='thime3'?"light":"default"
            var myChart = echarts.init(document.getElementById("echart_nhdbfx3"),thime);


            let option = {
                title: {
                    text: '湿度',
                    left: 10,
                    top:5,
                     textStyle:{
                        color,
                    },
                },
                tooltip: {

                },
                toolbox: {
                    left:"90%",
                show: true,
                feature: {
                    magicType: {
                    type: ["line", "bar"]
                    }
                }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%'
                },
                xAxis: {
                    type: 'category',
                    data: category,
                    axisTick: {
                        alignWithLabel: true,
                        lineStyle:{
                            color
                        }
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:color
                        }
                    }
                },
                yAxis: {
                    name:"湿度(%rh)",
                    show: true,
                    nameTextStyle:{
                        color,
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:color
                        }
                    }
                },
                series: [{
                        name: '湿度',
                        type: 'line',
                        data: list,
                        barWidth: 10,
                        smooth:true
                    }

                ]
            };
            myChart.setOption(option);
        }
    },


    mounted() {
        this.$Spin.hide()
        this.getData()






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

.xjcs-c-action {
    padding: 15px 30px
}

.xjcs-city-title {
    color: #000;
    font-size: 1.2em;
    font-weight: bold;
}

.xjcs-city-type {
    margin-left: 80px;
}

.xjcs-city-time span:nth-child(1),
.xjcs-city-type span:nth-child(1) {
    border-left: 1px solid #ddd
}

.xjcs-city-time span,
.xjcs-city-type span {
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    display: inline-block;
    padding: 10px 25px;
    cursor: pointer;
}

.hjxx-info {
    font-size: 16px;
    width: 100%;
    height: 200px;
    background: url("../assets/env.jpg");
    color: #fff;
    box-sizing: border-box;
    padding: 20px 50px;
    margin-bottom: 20px;
}

.cjcs-e-pm {
    margin-top: 15px;
}

.xjcs-city-time {
    margin-left: 180px;
}

.cjcs-e-wd {
    margin-top: 10px;
}

.wd-count {
    font-size: 66px;
    margin-right: 20px;
}

.wd-info {
    margin-right: 80px;
}
</style>

