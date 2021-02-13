import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupType:{},
  },
  totalPages:1,

  onLoad: function (options) {
    let groupType = getApp().globalData.groupType;
    this.setData({
      groupType:groupType
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
      url: '/pages/answerInfo/index?customerId=6'
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
    }
})