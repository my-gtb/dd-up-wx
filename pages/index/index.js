const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl:"",
  },
  onLoad(e) {
    var that = this;
    wx.showLoading({
      title: "加载中",
      })
    setTimeout(function(e) {
      wx.hideLoading()
      let avatarUrl = app.globalData.avatarUrl;
      console.log("avatarUrl");
      console.log(avatarUrl);
      if(avatarUrl != "" && avatarUrl != null){
        that.setData({
          avatarUrl:avatarUrl
        })
      }
    }, 1000)
  },
  bindgetuserinfo() {
    var that = this;
    wx.getUserInfo({
      success(res) {
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
    
  },
  goSign() {
    wx.reLaunch({
      url: '/pages/select/index',
    })
  }
})