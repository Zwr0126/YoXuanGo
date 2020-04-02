// pages/goods_list/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { id: 0, value: '综合', isActive: true },
      { id: 1, value: '销量', isActive: false },
      { id: 2, value: '价格', isActive: false }
    ],
    goodsList: []
  },
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.QueryParams.cid = options.cid || ''
    this.QueryParams.query = options.query || ''
    this.getGoodsList()
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.QueryParams })
    // console.log(res)
    const total = res.total
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    // console.log(this.totalPages)
    this.setData({
      // 拼接的数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    // 关闭下拉刷新效果
    wx.stopPullDownRefresh()
  },

  // 标题的切换点击事件
  handelTabsItemChange (e) {
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },

  /**
   * 1 用户上滑页面 滚动条触底 开始加载下一页数据
   *  1 找到滚动条触底事件
   *  2 判断还有没有下一页数据
   *    1 获取到数据的总页数
   *        总条数 = Math.ceil( 总条数 / 页容量pagesize)
   *    2 获取到当前的页码
   *    3 判断当前的页面是否大于等于总页数
   *      若大于 则没有 反之亦然
   *  3 假如没有下一页数据 弹出一个提示
   *  4 假如还有下一页数据 加载下一页数据
   *    1 当前页码 ++
   *    2 重新发送请求
   *    3 数据请求回来 要对data中的数组进行拼接不是全部替换！！！
   * 2 下拉刷新
   *   1 触发下拉刷新事件
   *   2 重置数据数组
   *   3 重置页码为1
   *   4 重新发送请求
   *   5 数据请求回来了 手动关闭下拉加载效果
   */

  // 上滑加载下一页事件
  onReachBottom () {
    // console.log('我到底啦')
    if (this.QueryParams.pagenum >= this.totalPages) {
     wx-wx.showToast({title: '没有下一页数据啦~'})
    } else {
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },

  // 触发下拉刷新事件
  onPullDownRefresh () {
    // console.log(123)
    this.QueryParams.pagenum = 1
    this.setData({
      goodsList: []
    })
    this.getGoodsList()
  }
})