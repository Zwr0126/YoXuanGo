// 同时发送异步请求代码的次数
let ajaxTimes = 0
export const request = (params) => {
  // 判断 url 中是否带有 /my/ 有则戴上 header token
  // let header = {...params.header}  可以先解构原来的 header 在修改添加新的
  let header = {...params.header}
  if (params.url.includes('/my/')) {
    header['Authorization'] = wx.getStorageSync('token')
  }

  ajaxTimes++

  // 显示加载中效果
  wx.showLoading({
    title: '加载中',
    mask: true
  })

  // 定义公共的url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (res) => {
        resolve(res.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      complete:() => {
        ajaxTimes--
        if (ajaxTimes === 0) {
          wx.hideLoading()
        }
      }
    })
  })
}