<template>
<div class="map-view">
    <div class="xjcs-c-aside">
        <div>
            <Tree :data="treeList" @on-select-change="selectchange"></Tree>
        </div>
    </div>
    <div class="xjcs-c-content">
        <div id="allmap" class="map"></div>
    </div>
    <div class="xjcs-c-right">
        <div class="bilid-info">
          

            <div class="build-info-title">
                <h3>{{info.emp_name}}</h3>
            </div>
            <div class="build-info-items">
                <h3>基本信息</h3>
                <div class="content">
                                <span class="content-img">
                <img :src='info.picpath' />
              </span>
                    <span class="content-text" style="">
                        <p style="padding-left:20px">
                            <div>
                                 建筑面积: {{info.built_area   }}㎡
                            </div>
                            <div>
                                用能人数: {{info.energy_use    }}人
                            </div>
                            
                            <div>
                                节能技术应用类型: {{info.techn_type_name    }}
                            </div>
                            <div>
                              建筑类型: {{info.type_name  }}
                            </div>
                            <div>
                                  地址: {{info.proaddress  }}
                            </div>
                        </p>
                    </span>
                </div>
            </div>
           <div class="build-info-items">
                <h3> 建筑简介</h3>
                <div class="content" style="padding-left:15px;line-height:1.6">
                    <p>
                        {{info.probrief}}
                    </p>
                </div>
            </div>
        </div>
    </div>

</div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        content: {}
      },
      treeList: [],
      selnode: {}
    };
  },
  methods: {
    // getBuilds() {
    //   this.$http.get('/Empor/employTree').then(res=>{
    //             if(this.sellevel == 1)
    //                 this.treeList = this.buildTree(res.data.regionList)
    //             else
    //                 this.treeList = this.buildTree(res.data.lists)
    //                 this.$nextTick(()=>{
    //                      var nodes = this.$refs.tree.getCheckedNodes()
    //                     console.log(nodes,1111)
    //                     this.ids =nodes.map(ele=>{
    //                         return ele.value
    //                     })
    //                     this.getData()
    //                 })
                
    //         }).catch(e=>{
    //             console.log(e)
    //         })
    // },
      getBuilds() {
            this.$http.get("/Empor/employTree").then(res => {
                this.treeList = this.buildTree(res.data.lists)
                this.getInfo()
                console.log(this.treeList, 111)
            }).catch(e => {
                console.log(e)
            })
        },
        buildTree(list) {
            let rList = []

            var _buildChildren = (list,lv) => {
                if (!list) {
                    return []
                }
                let rlist = []
                let index= 0
                
                list.forEach(ele => {
                var obj = {
                        title: ele.city,
                        value: ele.cityid,
                        expand: true,
                        disabled:lv!=4,
                        children: _buildChildren(ele.regList || ele.empList,lv+1)
                    }
                    if(index==0&&lv==4&&!this.selnode.value){
                        obj.selected= true
                        this.selnode = obj
                    }
                    rlist.push(obj)
                    index++
                })
                
                return rlist
            }
            list.forEach(ele => {
                rList.push({
                    title: ele.city,
                    value: ele.cityid,
                    expand: true,
                    disabled:true,
                    children: _buildChildren(ele.cityList,2)
                })
            })



            return rList
        },
    loadJScript() {
      if (window.BMap) {
        this.init();
      } else {
        var script = document.createElement("script");
        script.type = "text/javascript";
        window.init = () => {
          this.init();
        };
        script.src =
          "https://api.map.baidu.com/api?v=2.0&ak=UdQGUa0BgiwGEvGs5aQHLCasM5LEEpTO&callback=init";
        document.body.appendChild(script);
      }
    },
    selectchange(e) {
      if (e.length > 0) {
        this.selnode = e[0];
        this.getInfo();
      }
    },
    getInfo() {
      this.$http
        .get("Index/ajax_employ_info", {
          params: {
            emp_code: this.selnode.value
          }
        })
        .then(res => {
          this.info = res.data.info;
          var point = new BMap.Point(this.info.long, this.info.lat);
          this.addMark(point);
         
          this.info = {
            ...res.data.info,
          };
         
        })
        .catch(e => {
          console.log(e);
        });
    },
    init() {
      
      this.map = new BMap.Map("allmap"); // 创建Map实例
      if(this.$thime=='thime3'){
         var mapStyle={  style : "midnight" }  
        this.map.setMapStyle(mapStyle);
      }
     
      var point = new BMap.Point(114.06667, 22.61667); // 创建点坐标
      this.map.centerAndZoom(point, 18);
      this.map.enableScrollWheelZoom();
    },
    addMark(point) {
      let map = this.map;
      var len = map.getOverlays().length;

      for (var i = len; i > 0; i--) {
        map.removeOverlay(map.getOverlays()[i]);
      }

      var marker = new BMap.Marker(point);
      this.map.centerAndZoom(point, 18);
      marker.data = {
        name: 1111,
        age: 1111
      };
      marker.addEventListener("click", e => {
        console.log(e.target.data);
      });
      this.map.addOverlay(marker); // 创建标注
    }
  },
  mounted() {
    this.$Spin.hide()
    this.loadJScript();
    this.getBuilds();
  }
};
</script>

<style>
.map {
  background: #ddd;
  width: 1000px;
  height: 600px;
}

.bilid-info {
  height: 600px;
  margin-left: 20px;
  background: #fff;
  padding: 15px;
}

.bilid-info .build-info-items {
  margin-top: 40px;
  position: relative;
  white-space: normal;
}

.build-info-items h3 {
  position: relative;
  padding-left: 15px;
  margin-bottom: 15px;
}

.build-info-items h3::before {
  content: "";
  width: 5px;
  height: 1.1em;
  position: absolute;
  background: #f20855;
  left: 0;
  top: 2px;
}

.build-info-items .content p {
  margin-bottom: 15px;
}

span.content-img {
  position: absolute;
  right: 0;
  top: 0px;
  display: block;
  width: 133px;
  height: 100px;
}

.content-img img {
  width:133px;
}
.content-text div{
  width:200px
}
</style>


