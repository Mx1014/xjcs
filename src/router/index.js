import Vue from 'vue'
import Router from 'vue-router'

const citynhmap = () => import('@/components/citynhmap');
const citynhzl = () => import('@/components/citynhzl');
const areanhzl = () => import('@/components/areanhzl');
const originnhzl = () => import('@/components/originnhzl');
const typenhzl = () => import('@/components/typenhzl');

const citynhpmfx = () => import('@/components/citynhpmfx');
const citynhdbfx = () => import('@/components/citynhdbfx');
const citynhreport = () => import('@/components/citynhreport');
const cityjgreport = () => import('@/components/cityjgreport');
const remotereport = () => import('@/components/remotereport');
const subitemreport = () => import('@/components/subitemreport');

const cityhjxx = () => import('@/components/cityhjxx');
const citynhpue = () => import('@/components/citynhpue');
const cityjzinfo = () => import('@/components/cityjzinfo');
const citynhcbyj = () => import('@/components/citynhcbyj');
const citynhdysetting = () => import('@/components/citynhdysetting');
const systemconfig = () => import('@/components/systemconfig');
const warnlist = () => import('@/components/warnlist');

Vue.use(Router)

export default new Router({
  routes: [
    
    {
      path: '/cityenergymap',
      name: 'cityenergymap',
      component: citynhmap,
      meta:{
        mindex:1
      }
    },
    {
      path: '/cityenergyoverview',
      name: 'cityenergyoverview',
      component: citynhzl,
      meta:{
        mindex:2
      }
    },
    {
      path: '/areaenergyoverview',
      name: 'areaenergyoverview',
      component: areanhzl,
      meta:{
        mindex:2
      }
    },
    {
      path: '/originenergyoverview',
      name: 'originenergyoverview',
      component: originnhzl,
      meta:{
        mindex:2
      }
    },
    {
      path: '/typeenergyoverview',
      name: 'typeenergyoverview',
      component: typenhzl,
      meta:{
        mindex:2
      }
    },
    
    {
      path: '/rankinganalysis',
      name: 'rankinganalysis',
      component: citynhpmfx,
      meta:{
        mindex:3
      }
    },
    {
      path: '/contrastanalysis',
      name: 'contrastanalysis',
      component: citynhdbfx,
      meta:{
        mindex:3
      }
    },
    {
      path: '/cityreport',
      name: 'cityreport',
      component: citynhreport,
      meta:{
        mindex:4
      }
    },
    {
      path: '/originreport',
      name: 'originreport',
      component: cityjgreport,
      meta:{
        mindex:4
      }
    },
    {
      path: '/remotereport',
      name: 'remotereport',
      component: remotereport,
      meta:{
        mindex:4
      }
    },
    {
      path: '/subitemreport',
      name: 'subitemreport',
      component: subitemreport,
      meta:{
        mindex:4
      }
    },
    
    {
      path: '/energypue',
      name: 'energypue',
      component: citynhpue,
      meta:{
        mindex:5
      }
    },
    {
      path: '/environmentinfo',
      name: 'environmentinfo',
      component: cityhjxx,
      meta:{
        mindex:6
      }
    },
    {
      path: '/buildinginfo',
      name: 'buildinginfo',
      component: cityjzinfo,
      meta:{
        mindex:7
      }
    },
    {
      path: '/energywarning',
      name: 'energywarning',
      component: citynhcbyj,
      meta:{
        mindex:5
      }
    },
    {
      path: '/energyquotasetting',
      name: 'energyquotasetting',
      component: citynhdysetting,
      meta:{
        mindex:5
      }
    },
    {
      path: '/systemconfig',
      name: 'systemconfig',
      component: systemconfig,
      meta:{
        mindex:6
      }
    },
    {
      path: '/warnlist',
      name: 'warnlist',
      component: warnlist,
      meta:{
        mindex:0
      }
    },
    {
      path: '*',
      redirect:"/cityenergymap"
    },

    
  ]
})
