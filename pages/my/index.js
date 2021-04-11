const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:"",
    nickName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    var that = this
    let avatarUrl = app.globalData.avatarUrl;
    let nickName = app.globalData.nickName;
    that.setData({
      avatarUrl:avatarUrl,
      nickName:nickName
    })
  },
  onShareAppMessage(){
    return {
      title: '答题酷',
      path: '/pages/index/index',
      imageUrl:'/images/logo.png'
    }
  },
  about() {
    wx.showModal({
      title: '关于',
      content: '本程序后端API接口使用SpringBoot构建，API地址格式：http://api.ddup.cn:8010/service/xxx/xxx',
      showCancel: false
    })
  }
})