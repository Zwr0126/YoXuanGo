// pages/search/index.js
/**
 * 1 输入框绑定 值改变事件 input事件
 *   1 获取输入框的值
 *   2 合法性判断
 *   3 检验通过 把输入框的值 发送到后台
 *   4 返回数据打印到页面上
 * 2 防抖 定时器 节流
 *   0 防抖 一般用于输入框 防止重复输入重复发送请求
 *   1 节流 一般是用在页面下拉或上拉
 *   1 定义全局定时器TimeId
 */
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    isFocus: false,
    inpValue: ''
  },
  TimeId: -1,

  // 输入框的值改变事件
  handleInput (e) {
    // console.log(e)
    // 1 获取输入框的值
    const { value } = e.detail
    if (!value.trim()) {
      this.setData({
        isFocus: false,
        goods: []
      })
      // 值不合法
      return
    }
    // 3 准备发送请求获取数据
    this.setData({ isFocus: true })
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.search(value)
    }, 1000)
  },

  // 获取搜索数据
  async search (query) {
    // console.log(query)
    const res = await request({
      url: '/goods/search',
      data: {
        query: query
      }
    })
    // console.log(this.data.isFocus)
    if (this.data.isFocus === true) {
      this.setData({
        goods: res.goods
      })
    }
  },

  // 点击取消 清除数据
  handleCancel () {
    this.setData({
      inpValue: '',
      isFocus: false,
      goods: []
    })
  }
})