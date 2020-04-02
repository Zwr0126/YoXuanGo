// pages/order/index.js
/**
 * 1 页面被打开的时候 onShow
 *   0 onShow 不存在 options参数
 *   0.5 判断缓存中有没有token 没有就跳转至授权页面 有就继续
 *   1 获取url上的参数type
 *   2 根据 type 决定标签页激活状态
 *   2 根据 type 去发送请求获取订单数据
 *   3 渲染页面
 * 2 点击不同的标题 重新发送请求来获取和渲染数据
 */
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { id: 0, value: '全部', isActive: true },
      { id: 1, value: '待付款', isActive: false },
      { id: 2, value: '待发货', isActive: false },
      { id: 3, value: '退款/退货', isActive: false }
    ],
    orders: []
  },

  onShow () {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }
    // 1 获取当前小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages()
    // 2 数组中缩印最大的页面就是当前页面
    let currentPage = pages[pages.length - 1]
    const { type } = currentPage.options
    this.getOrders(type)
    this.changeTitleByIndex(type - 1)
  },

  // 获取全部订单列表
  async getOrders(type) {
    const res = await request({
      url: '/my/orders/all',
      data: { type }
    })
    this.setData({
      orders: res.orders
    })
  },

  // 根据标题索引激活选中标题数组
  changeTitleByIndex (index) {
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({ tabs })
  },

  // 点击切换标签页
  handelTabsItemChange (e) {
    const { index } = e.detail
    this.changeTitleByIndex(index)
    this.getOrders(index + 1)
  }
})