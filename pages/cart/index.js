// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showMdal } from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow () {
    // 1 获取本地缓存中的收货地址
    const address = wx.getStorageSync('address')
    // 1 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || []
    // 1 计算全选
    // every 数组方法 会便利 会接受一个回调函数 每一个回调函数都返回 true 那么 every 方法的返回值为 true
    // 只要有一个回调函数返回false 那么不再执行循环 every 方法返回值为 false
    // 空数组 调用every 返回值为true
    // const allChecked = cart.length ? cart.every((v => v.checked)) : false
    this.setData({
      address
    })
    this.setCart(cart)
  },

  //1 点击收货地址
  /**
   * 1 绑定点击事件
   * 2 调用小程序内置api 获取用户收货地址 wx.chooseAddress
   * 获取用户对小程序所授予的获取地址权限状态 authSetting  scope
   *  1 假设用户点击获取收货地址的提示框【确定】scope 值为 true
   *    直接调用获取收货地址
   *  2 假设用户从来没有调用过收货地址的api 则scope 为 undefine
   *    直接调用获取收货地址
   *  3 假设用户点击获取收货地址的提示框取消】scope 值为 false
   *    1 诱导用户自己打开授权地址页面 当前用户重新给与获取地址权限 wx.openSetting
   *    2 获取收货地址
   *  4 把获取的收货地址 存入到 本地存储中
   */
  async handleChooseAddress() {
    // 1 获取权限状态
    // wx.getSetting({
    //   success: (res) => {
    //     // 2 获取权限状态
    //     const scopeAddress = res.authSetting['scope.address']
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log('result1', result1)
    //         }
    //       })
    //     } else {
    //       // 3用户以前拒绝授予权限 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result) => {
    //           wx.chooseAddress({
    //             success: (result2) => {
    //               console.log('result2', result2)
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })

    try {
      // 1 获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      // 2 判断权限
      if (scopeAddress === false) {
        // 3 诱导用户打开授权页面
        await openSetting()
      }
      // 3 调用获取收货地址
      const address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 4 把地址存入缓存
      wx.setStorageSync('address', address)
    } catch (err) {
      console.log(err)
    }
  },

  // 2 页面加载完毕
  /**
   * 0 onLoad onShow
   * 1 获取本地存储中的地址数据
   * 2 把数据 设置给 data 中的变量
   */

  // 3 onShow
  /**
   *   0 回到商品详情页面 第一次添加商品的时候添加数据  num  checked  
   *   1 获取缓存中的购物车数组
   *   2 把购物车数据填充到data中
   */
  
  // 4 实现全选
  /**
   *   1 onShow 获取缓存中的购物车数组
   *   2 根据购物车中的商品数据 所有的商品的checked = true 则全选被选中
   */

  // 5 总价格和总数量
  /**
   * 1 都需要商品被选中才能计算
   * 2 获取购物车数组
   * 3 遍历
   * 4 判断商品是否被选中
   * 5 总价格 += 商品单价 * 商品数量
   * 6 总数量 += 商品数量
   * 7 把计算好的价格和总数写回 data 中
   */

  // 6 商品的选中功能
  /**
   *  1 绑定change事件
   *  2 获取到被修改的商品对象
   *  3 商品对象的选中状态 取反
   *  4 重新填重回data中和缓存中
   *  5 重新计算 全选 总价格 总数量
   */
  handleItemChange (e) {
    // 1 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id
    // console.log(goods_id)
    // 2 获取购物车数组 
    let { cart } = this.data
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked
    // 5 重新设置购物车数据进data中和缓存中
    this.setCart(cart)
  },

  // 7 全选和反选
  /**
   *  1 全选复选框绑定change事件
   *  2 获取data中的全选变量 allChecked
   *  3 直接取反 allChecked = !allChecked
   *  4 遍历购物车数组 让里面的购物车商品选中状态跟随 allChecked 改变而改变
   *  5 把购物车数组和选中状态重新设置回data和缓存中
   */
  handleItemAllChecked () {
    // 1 获取data中的数据
    let { cart, allChecked } = this.data
    // 2 修改值
    allChecked = !allChecked
    // 3 循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked)
    // 4 把修改后的值设置回data中和缓存中
    this.setCart(cart)
  },

  // 8 商品数量的编辑功能
  /**
   * 1 “+” “-” 绑定同一个点击事件 区分关键在于自定义属性 “+”  “+1”   “-” “-1”
   * 2 传递被点击的商品id
   * 3 获取到data中的购物车数组 来获取需要被修改的商品对象
   * 4 当购物车的数量 = 1 用户点击 “-”
   *   弹出提示 wx.showModal 是否要删除
   *   1 【确定】 直接删除
   *   2 【取消】 什么都不做
   * 4 直接修改商品对象数量 num
   * 5 把cart数组设置回data中和缓存中
   */
  async handleItemNumEdit (e) {
    // 1 获取参数
    const { operation, id } = e.currentTarget.dataset
    // console.log(operation, id)
    // 2 获取购物车数组
    let { cart } = this.data
    // 3 找到需要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 4 判断是否执行删除
    if (cart[index].num === 1 && operation === -1) {
      const res = await  showMdal({content: '您是否要删除？'})
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      // 4 修改数量
      cart[index].num += operation
      // 5 把cart数组写回data和缓存中
      this.setCart(cart)
    }
  },

  // 设置购物车状态 重新计算 全选 总价格 总数量
  setCart (cart) {
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 判断cart是否为空
    allChecked = cart.length != 0 ? allChecked : false
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart)
  }
})