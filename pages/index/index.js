//index.js
// 引入请求的方法
import { request} from '../../request/index.js';
//获取应用实例
Page({
  data: {
    swiperList: [],
    getCateList: [],
    floorList: []
  },
  
  onLoad: function (options) {
    // 1 发送异步请求获取轮播图数据
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   methods: 'GET',
    //   success: (res) => {
    //     // console.log(res)
    //     this.setData({
    //       swiperList: res
    //     })
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // })
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },

  // 获取轮播图数据
  getSwiperList () {
    request({
      url: '/home/swiperdata'
    }).then(res => {
      // console.log(res)
      this.setData({
        swiperList: res
      })
    }).catch(err => {
      console.log(err)
    })
  },

  // 获取分类导航数据
  getCateList () {
    request({
      url: '/home/catitems'
    }).then(res => {
      // console.log(res)
      this.setData({
        cateList: res
      })
      // console.log(this.data.cateList)
    }).catch(err => {
      console.log(err)
    })
  },

  // 获取楼层数据
  getFloorList() {
    request({
      url: '/home/floordata'
    }).then(res => {
      // console.log(res)
      this.setData({
        floorList: res
      })
      // console.log(this.data.floorList)
    }).catch(err => {
      console.log(err)
    })
  }
})
