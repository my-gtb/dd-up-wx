import { request } from "../../request/index.js";
const { $Message } = require('../../dist/base/index');
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "错题本",
        isActive: true
      }, {
        id: 1,
        value: "收藏题目",
        isActive: false
      }
    ],
    totalWrongCount:0,
    todayWrongCount:0,
    collectionCount:0,
    wrongCountList:[],
    collectionCountList:[],
    scrollHeight1:0,
    scrollHeight2:0,
    visible1:false,
    visible2:false,
    action:[
      {
        name: '否'
      },
      {
        name: '是',
        color: '#2db7f5',
        loading: false
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;

    let screenHeight = wx.getSystemInfoSync().windowHeight  //获取屏幕高度
    let query = wx.createSelectorQuery().in(that);
    query.select(".item-img").boundingClientRect();
    query.select(".confirm-btn").boundingClientRect();
    query.select(".today-wrong").boundingClientRect();

    query.exec(r => {
      let h1 = r[0].height;
      let h2 = r[1].height;
      let h3 = r[2].height;

      let scrollHeight1 = screenHeight - h1 - h2 - h3 - h2 - 10;
      let scrollHeight2 = screenHeight - h1 - h2 - h2 - h3;

      that.setData({
        scrollHeight1: scrollHeight1,
        scrollHeight2: scrollHeight2
      })
    })

    this.getQuestionCount();
  },

  getQuestionCount(){
    let customerId = getApp().globalData.customerId;

    //获取错题数
    let data1 = {
      "customerId":customerId,
      "isWrong":true
    }

    request({url:"/customer-wrong/getCustomerQuestionCount",data:data1,method:'post'})
      .then(res => {
        this.setData({
          totalWrongCount:res.data.map.totalCount,
          todayWrongCount:res.data.map.todayCount,
          wrongCountList:res.data.map.countMap,
        })
      })

    //获取收藏题数
    let data2 = {
      "customerId":customerId,
      "isCollection":true
    }

    request({url:"/customer-wrong/getCustomerQuestionCount",data:data2,method:'post'})
      .then(res => {
        this.setData({
          collectionCount:res.data.map.totalCount,
          collectionCountList:res.data.map.countMap,
        })
      })
  },

  handleTabsItemChange(e) {
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  //获取所有错题
  getQuestionWrong(){
    wx.navigateTo({
      url: "/pages/wrongOrCollect/index?isWrong=true"
    })
  },
  //获取今日错题
  getDailyWrong(){
    let startTime = new Date().toLocaleDateString();
    let startTimeStamp = new Date(startTime).getTime() / 1000;
    let endTimeStamp = startTimeStamp + 24 * 60 * 60;
    console.log("startTimeStamp "+startTimeStamp);
    console.log("endTimeStamp "+endTimeStamp);

    wx.navigateTo({
      url: "/pages/wrongOrCollect/index?isWrong=true&startTime="+startTimeStamp+"&endTime="+endTimeStamp
    })
  },
  //按组获取错题
  getGroupQuestionWrong(e){
    let groupId = e.currentTarget.dataset.groupId;
    wx.navigateTo({
      url: "/pages/wrongOrCollect/index?isWrong=true&groupId="+groupId
    })
  },
  //获取收藏题
  getQuestionCollection(){
    wx.navigateTo({
      url: "/pages/wrongOrCollect/index?isCollection=true"
    })
  },
  //按组获取收藏题
  getGroupQuestionCollection(e){
    let groupId = e.currentTarget.dataset.groupId;
    wx.navigateTo({
      url: "/pages/wrongOrCollect/index?isCollection=true&groupId="+groupId
    })
  },
  //清空错题
  clearWrong(){
    this.setData({
      visible1:true
    })
  },
  //清空收藏题
  clearCollection(){
    this.setData({
      visible2:true
    })
  },

  checkClearWrong({ detail }){
    //取消
    this.setData({
        visible1: false,
    });
    if (detail.index != 0) {
      let customerId = getApp().globalData.customerId;
      request({url:`/customer-wrong/clearCustomerQuestion/${customerId}/true`})
      .then(res => {
        console.log(res);
        this.getQuestionCount()
      })
      $Message({
        content: '错题已清空',
        duration: 3,
        type: 'success'
      });
      return;
    } 
  },
  checkClearCollection({ detail }){
      //取消
      this.setData({
        visible2: false,
      });
    if (detail.index != 0) {
      let customerId = getApp().globalData.customerId;
      request({url:`/customer-wrong/clearCustomerQuestion/${customerId}/false`})
      .then(res => {
        console.log(res);
        this.getQuestionCount()
      })
      $Message({
        content: '收藏题已清空',
        duration: 3,
        type: 'success'
      });
      return;
    }
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
  },

})