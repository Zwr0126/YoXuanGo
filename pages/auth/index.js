// pages/auth/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { login } from '../../utils/asyncWx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  // 获取用户信息
  async handleGetUserInfo (e) {
    try {
      // 1 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail
      // 2 获取小程序登录成功后的code
      const { code } = await login()
      const loginParams = { encryptedData, rawData, iv, signature, code }
      // console.log(loginParams)
      const res = await request({
        url: '/users/wxlogin',
        data: loginParams,
        method: 'POST'
      })
      // 不是企业账号 不能做支付功能 所以接口就不返回token了
      console.log(res)
      const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
      wx.setStorageSync('token', token)
      wx.navigateBack({
        delta: 1
      })
    } catch (err) {
      console.log(err)
    }
  }
})