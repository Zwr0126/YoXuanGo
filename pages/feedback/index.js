// pages/feedback/index.js
/**
 * 1 点击 “+” 按钮
 *   1 调用小程序内置的 选择图片 api
 *   2 获取到图片路径数组
 *   3 把页面路径存到data的变量中
 *   4 页面就可以根据 图片数组 进行循环显示 自定义组件
 * 2 点击 自定义图片 组件
 *   1 获取被点击的元素索引
 *   2 获取 data 中的图片数组
 *   3 根据索引 数组中删除对应的元素
 *   4 把数组重新设置回data中
 * 3 点击 “提交” 按钮
 *   1 获取文本域内容
 *   2 对这些内容做合法性验证
 *   3 验证通过 把用户选择的图片 上传到图片服务器 返回图片的外网链接
 *     1 遍历图片数组
 *     2 挨个上传
 *     3 上传成功 自己再来维护一个图片数组 存放的就是图片上传后 外网的链接
 *   4 文本域 和 外网图片的路径 一起提交到服务器 （目前没接口，只做前端模拟，不会发送请求到后台）
 *   5 清空当前页面
 *   6 返回上一页
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { id: 0, value: '体验问题', isActive: true },
      { id: 1, value: '商品、商家投诉', isActive: false }
    ],
    chooseImgs: [],
    textVal: ''
  },
  // 外网的图片路径数组
  UploadImgs: [],

  // “提交”按钮点击事件
  hendleFormSubmit () {
    // 1 获取文本域内容
    const { textVal, chooseImgs } = this.data
    // 2 合法性验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      })
      return
    }
    // 3 准备上传图片到专门的图片服务器
    // 上传文件的 api 不支持 多个文件上传
    // 遍历数组 挨个上传
    // 显示正在等待的图标
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })
    // 判断有没有需要上传的图片数组
    if (chooseImgs.length !== 0) {
      // 图片上传目前无法完整实现
      chooseImgs.forEach((v, i) => {
        // UploadImgs
        wx.uploadFile({
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          // 此处路径有问题 导致上传不能成功
          filePath: v,
          name: 'file',
          formData: {},
          success: (res) => {
            console.log(res)
            // 正常输出应该做以下操作
            /**
             * let url = JSON.parse(res.data).url
             * this.UploadImgs.push(url)
             * // 所有的图片都上传完毕才触发
             * if (i === chooseImgs.length - 1) {
             *  wx.hideLoading()
             *  console.log('把文本内容和图片数组 提交到后台中')
             * // 提交都成功了
             * // 重置页面
             * this.setData({
             *  textVal: '',
             * chooseImgs: []
             * })
             * // 返回上一个页面
             * wx.navigateBack({
             * delta:  1})
             * }
             */
          }
        })
      })
    } else {
      console.log('只是提交了文本')
    }
    setTimeout(() => {
      wx.hideLoading()
      wx.navigateBack({
        delta: 1
      })
    }, 2000)
  },

  // 文本域的输入事件
  handleTextInput (e) {
    this.setData({
      textVal: e.detail.value
    })
  },

  // 点击自定义图片
  handleRemoveImg(e) {
    const { index } = e.currentTarget.dataset
    console.log(index)
    let { chooseImgs } = this.data
    chooseImgs.splice(index, 1)
    this.setData({ chooseImgs })
  },

  // 点击 “+” 选择图片事件
  handleChooseImg () {
    // 2 调用内置的选择图片api
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log(res)
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
        })
      }
    })
  },

  // 点击切换标签
  handleTabsItemChange (e) {
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({ tabs })
  }
})