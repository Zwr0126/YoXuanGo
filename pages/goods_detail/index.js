// pages/goods_detail/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.goods_id)
    const { goods_id } = options
    this.getGoodsDetail(goods_id)
  },

  // 获取商品详情数据
  async getGoodsDetail (goods_id) {
    const goodsObj = await request({ url: '/goods/detail', data: { goods_id } })
    this.GoodsInfo = goodsObj
    // console.log(goodsObj)
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        pics: goodsObj.pics,
        // iPhone部分手机 不识别 webp图片格式
        // 最好找后台修改
        // 临时自己修改 确保后台存在 1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg')
      }
    })
  },
  // 点击轮播图放大预览
  /**
   * 1 给轮播图绑定点击事件
   * 2 调用小程序api previewImage
   */
  handelPreviewImage (e) {
    // console.log(123)
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls,
    })
  },

  // 点击 加入购物车
  /**
   * 1 先绑定点击事件
   * 2 获取缓存中的购物车数据 数组格式
   * 3 先判断 当前的商品是否存在与购物车
   * 4 已存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充会缓存中
   * 5 不存在与购物车的数组中 直接给购物车数组添加一个新元素 新元素要带上数量属性 num 重新把购物车数组 填充会缓存中
   * 6 弹出提示
   */
  handleCartAdd () {
    // 获取缓存中的购物车数组
    const cart = wx.getStorageSync('cart') || []
    // 判断商品对象是否存在与购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      // 3 不存在 第一次添加
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 4 已经存在购物车数据 执行 num++
      cart[index].num++
    }
    // 5 把购物车重新填重回缓存中
    wx.setStorageSync('cart', cart)
    // 6 弹窗提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true,
    })
  }
})