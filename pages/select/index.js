import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupType:{},
    dailyQuestionId:0,
    dailyQuestionName:"",
    isVisible:false,
    loginPoints:0,
    action:[
      {
        name: '确定',
        color: '#2db7f5',
        loading: false
      }
    ],
  },
  totalPages:1,

  onLoad: function (options) {
    var app = getApp().globalData;
    let groupType = app.groupType;
    let customerId = app.customerId;
    let timestamp = this.getTimestamp();
    let data = {
      "customerId":customerId,
      "signTime":timestamp
    }
    console.log(data);
    request({url: "/customer/getSignIn",data:data,method:'post'})
      .then(res => {
        console.log("res = ")
        console.log(res)
        if(res.success){
          getApp().globalData.isSignIn = true;
          this.setData({
            groupType:groupType,
            isVisible:true,
            loginPoints:res.data.result.durationDays
          })
        }
        this.setData({
          dailyQuestionId:res.data.result.questionId,
          dailyQuestionName:res.data.result.questionName
        })
      })
    this.setData({
      groupType:groupType,
    })
  },

  zhuanxianglx(){
    wx.navigateTo({
      url: '/pages/groupList/index?groupType='+this.data.groupType.TYPE_CATALOG
    })

  },
  shunxu(){
    wx.navigateTo({
      url: '/pages/answer/index?groupType='+this.data.groupType.TYPE_COMMON
    })
  },
  fangzhen(){
    wx.navigateTo({
      url: '/pages/groupList/index?groupType='+this.data.groupType.TYPE_SIMULATION
    })
  },
  vipzt(){
    wx.navigateTo({
      url: '/pages/groupList/index?groupType='+this.data.groupType.TYPE_VIP
    })
  },
  cuotsouc(){
    wx.navigateTo({
      url: '/pages/userQuestion/index'
    })
  },

  dailyQuestion(){
    wx.navigateTo({
      url: '/pages/dailyQuestion/index?questionId='+this.data.dailyQuestionId
    })
  },

  handleSignIn(){
    this.setData({
      isVisible:false
    })
  },

  onReachBottom(){
      if(this.data.currentPage >= this.totalPages){
        wx.showToast({ title: '没有下一页数据' });
          
      }else{
        this.data.currentPage++;
        this.getList();
      }
    },
  onPullDownRefresh(){
    this.setData({
      goodsList:[]
    })
    this.data.currentPage = 1;
    this.getList();
  },
  getTimestamp() {
    let formatDate = new Date().toLocaleDateString();
    return new Date(formatDate).getTime() / 1000;
  }
})