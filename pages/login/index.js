// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  // 登录
  handleGetUserInfo (e) {
    // console.log(e)
    const { userInfo } = e.detail
    wx.setStorageSync('userinfo', userInfo)
    wx.navigateBack({
      delta: 1
    })
  }
})