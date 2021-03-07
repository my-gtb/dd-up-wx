// pages/start/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },
  onLoad(e) {
    var that = this;
    wx.getUserInfo({
      success(res) {
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
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