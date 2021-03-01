//app.js
import { request } from "./request/index.js";
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var code = "";
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){
          code = res.code;
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res1 => {
        if (res1.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: "zh_CN",
            success: ures2  => {
              
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = ures2 .userInfo
              JSON.stringify(ures2 )
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(ures2 )
              }
              request({ 
                url: "/weixin/getOpenid",
                data:{
                  code: code,
                  encryptedData: ures2.encryptedData,
                  iv: ures2.iv
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                }
              })
              .then(result => {
                this.globalData.customerId = result.data.customerId;
              })
              
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    customerId:null,
    groupType:{
      TYPE_VIP:"1",
      TYPE_SIMULATION:"2",
      TYPE_CATALOG:"3",
      TYPE_COMMON:"4",
    },
    questions:null,
    isSignIn:false,
  },
  
})