export default [
  {
    title: "能耗地图",
    icon: "icon-ditu",
    manager:2,
        name:"cityenergymap",
        url: "/cityenergymap",
  },
  {
    title: "能耗计量",
    icon: "icon-zonglan",
    children:[{
        title: "能耗总览",
        manager:2,
        name:"cityenergyoverview",
        icon: "",
        url: "/cityenergyoverview",
    },
    {
      title: "区域能耗",
      name:"areaenergyoverview",
      icon: "",
      url: "/areaenergyoverview",
  },{
    title: "机构能耗",
    name:"originenergyoverview",
    icon: "",
    url: "/originenergyoverview",
},{
  title: "分项能耗",
  name:"typeenergyoverview",
  icon: "",
  url: "/typeenergyoverview",
}]
  },
  {
    title: "能耗分析",
    icon: "icon-fenxi",
    children:[{
        title: "排名分析",
         name:"rankinganalysis",
        icon: "",
        url: "/rankinganalysis",
    },{
      title: "对比分析",
       name:"contrastanalysis",
      icon: "",
      url: "/contrastanalysis",
  }]
  },
  {
    title: "能耗报表",
    icon: "icon-shujubaobiao",
    children:[{
        title: "区域能耗报表",
         name:"cityreport",
        icon: "",
        url: "/cityreport",
    },{
      title: "机构报表",
       name:"originreport",
      icon: "",
      url: "/originreport",
  },{
    title: "远程抄表",
     name:"remotereport",
    icon: "",
    url: "/remotereport",
},{
  title: "分项报表",
   name:"subitemreport",
  icon: "",
  url: "/subitemreport",
}]
  },
  {
    title: "能耗考核",
    icon: "icon-kaohe",
    children:[{
        title: "能耗PUE",
         name:"energypue",
        icon: "",
        url: "/energypue",
    },
    {
    title: "能耗定额设置",
     name:"energyquotasetting",
    icon: "",
    url: "/energyquotasetting",
}
// ,{
//   title: "能耗超标预警",
//    name:"energywarning",
//   icon: "",
//   url: "/energywarning",
// }
]
  },
  {
    title: "环境信息",
    icon: "icon-huanjingxinxi",
    manager:2,
         name:"environmentinfo",

        url: "/environmentinfo",
  },
  {
    title: "机构信息",
    icon: "icon-jianzhu",

         name:"buildinginfo",
        url: "/buildinginfo",
  },
  {
    title: "系统管理",
    icon: "icon-shezhi",
    children:[{
        title: "系统配置",
         name:"systemconfig",
        icon: "",
        manager:2,
        url: "/systemconfig",
    },
    {
      title: "人员管理",
       name:"usermanager",
      icon: "",
      manager:2,
      url: "/usernamager",
  },
    {
      title: "警报列表",
       name:"warnlist",
      icon: "",
      url: "/warnlist",
  }
  ]
  },
  

]
