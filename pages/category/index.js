// pages/category/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [],
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧内容滚动条距离顶部的距离
    scrollTop: 0
  },

  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCates()
    /**
     * 0 web中的本地存储与小程序中本地存储的区别
     *  1 代码方式不一样
     *    web: localStorage.setItem("key", "value")
     *         localStorage.getItem("key")
     *    小程序中: wx:setStorageSync("key", "value")
     *             wx:getStorageSync("key")
     *  2 存的时候 有没有数据类型装换
     *    web: 不管存入的什么类型的数据，组中都会先调用一下 toString()，把数据变成字符串再存进去
     *     小程序: 不存在数据类型转换，存什么类型的数据进去，获取的时候就是什么类型
     * 1 先判断本地存储是否有旧数据
     *   {time: Date.now(), data: [...]}
     * 2 没有就 直接发送请求
     * 3 有旧数据 同时 就数据没有过期 就使用本地旧数据
     */
    // 1 获取本地存储中的数据 （小程序中存在本地存储）
    const Cates = wx.getStorageSync('cates')
    // 2 判断
    if (!Cates) {
      // 不存在 发送请求数据
      this.getCates()
    } else {
      // 有旧的数据 定义过期时间 5min
      if (Date.now() - Cates.time > 1000 * 60 * 5) {
        // 已过期 重新发请求
        this.getCates()
      } else {
        // 未过期 可以使用旧数据
        this.Cates = Cates.data
        // 构造左侧菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name)
        // 构造右侧商品数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  // 获取分类数据
  // getCates () {
  //   request({
  //     url: '/categories'
  //   }).then(res => {
  //     // console.log(res)
  //     this.Cates = res.data.message

  //     // 把接口数据存到本地存储中
  //     wx.setStorageSync('cates', {time: Date.now(), data: this.Cates})
  //     // 构造左侧菜单数据
  //     let leftMenuList = this.Cates.map(v => v.cat_name)
  //     // 构造右侧商品数据
  //     let rightContent = this.Cates[0].children
  //     this.setData({
  //       leftMenuList,
  //       rightContent
  //     })
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // },

  async getCates() {
    const res = await request({ url: '/categories' })
    this.Cates = res
    // 把接口数据存到本地存储中
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
    // 构造左侧菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
    // 构造右侧商品数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 左侧菜单点击事件
  handelItemTap (e) {
    // console.log(e)
    /**
     * 1 获取被点击的标题身上的索引
     * 2 给data中的currentIndex赋值
     * 3 根据不同的索引渲染右侧的商品内容
     */
    let { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      // 从新设置右侧内容的 scroll-view的距离顶部的距离
      scrollTop: 0
    })
  }
})