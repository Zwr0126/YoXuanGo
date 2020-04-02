// pages/pay/index.js
/**
 * 1 页面加载的时候
 *  1 从缓存中获取购物车数据渲染到页面
 *    这些数据 checked = true
 * 2 微信支付
 *   1 哪些人 哪些账号 可以实现微信支付
 *     1 企业账号
 *     2 企业账号的小程序后台中 必须给开发者 添加上白名单
 *       1 一个 appid 同时绑定多个开发者
 *       2 这些开发者就可以共用这个appid和它的开发权限
 * 3 点击支付按钮
 *   1 判断缓存中有没有 token
 *   2 没有 跳转到授权页面 获取token
 *   3 有token
 *   4 创建订单 获取订单编号
 *   5 已经完成了微信支付（个人账号无法实现 需要使用企业账号）
 *   6 手动删除缓存中 已被选中了的商品
 *   7 删除后的购物车数据 填充回缓存
 *   8 跳转页面
 */


import { showToast, requestPayment } from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { request } from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 1 获取本地缓存中的收货地址
    const address = wx.getStorageSync('address')
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || []
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked)

    // 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    })
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    })
  },

  // 点击支付
  async handleOrderPay () {
    try {
      // 1 判断缓存中是否有token
      // 因为我的开发账号是私人的 只有企业账号才能完成支付 所以下面的步骤都无法正常实现 不能完成完整的订单支付
      const token = wx.getStorageSync('token')
      // 2 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        })
        return
      } else {
        // console.log('已经存在token')
        // 3 创建订单
        // const header = { Authorization: token }
        const order_price = this.data.totalPrice
        const consignee_addr = this.data.address.all = this.data.totalPrice
        const cart = this.data.cart
        let goods = []
        cart.forEach(v => goods.push({
          goods_id: v.goods_id,
          goods_number: v.goods_num,
          goods_price: v.goods_price
        }))
        const orderParams = { order_price, consignee_addr, goods }
        // 4 准备发送请求 创建订单 获取订单编号
        const { order_number } = await request({
          url: '/my/orders/create',
          method: 'POST',
          data: orderParams
        })
        // 输出了null 本来应该拿到订单编号 order_number 的
        // 后续接口也无法继续触发
        console.log(order_number)
        // 5 发起预支付接口请求 
        const { pay } = await request({
          url: '/my/orders/req_unifiedorder',
          method: 'POST',
          data: { order_number }
        })
        // 6 发起微信支付
        await requestPayment(pay)
        // 7 查询后台 订单状态
        const res = await request({
          url: '/my/orders/chkOrder',
          method: 'POST',
          data: { order_number }
        })
        await showToast({title: '支付成功'})
      }
      // 以上代码逻辑是正确的，但是并不能实现触发支付功能
      // 从一开始获取不到token 到之后不能支付 获取Order_number 都不能触发接口运行 所以此处不执行try
      // 支付成功 跳转到订单页面
      // 8 要手动删除缓存中 已经支付的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart)
      // 8 支付成功 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      })
    } catch(err) {
      console.log(err)
      // 执行catch
      await showToast({ title: '支付失败！！！为测试接下来的页面跳转，故在支付失败时也触发跳转至订单页面' })
      // 本来不能跳转，但是为了模拟实现功能，只能在这里跳转了
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/order/index'
        })
      }, 2000)
    }
  }
})