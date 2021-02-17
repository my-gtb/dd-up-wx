import { request } from "../../request/index.js";
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let customerId = getApp().globalData.customerId;
    console.log("customerId = " + customerId);
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

      let scrollHeight1 = screenHeight - h1 - h2 - h3 - h2;
      let scrollHeight2 = screenHeight - h1 - h2 - h2 - h3;
      console.log("screenHeight = " + screenHeight);
      console.log("h2 = " + h2);
      console.log("scrollHeight1 = " + scrollHeight1);
      console.log("scrollHeight2 = " + scrollHeight2);
      that.setData({
        scrollHeight1: scrollHeight1,
        scrollHeight2: scrollHeight2
      })
    })


    //获取错题数
    let data1 = {
      "customerId":customerId,
      "isWrong":true
    }

    request({url:"/customer-wrong/getCustomerQuestionCount",data:data1,method:'post'})
      .then(res => {
        console.log(res);
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
        console.log(res);
        this.setData({
          collectionCount:res.data.map.totalCount,
          collectionCountList:res.data.map.countMap,
        })
      })
  },

  handleTabsItemChange(e) {
    const { index } = e.detail;
    console.log(index);
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  //获取所有错题
  getQuestionWrong(){

  },
  //获取今日错题
  getDailyWrong(){

  },
  //按组获取错题
  getGroupQuestionWrong(e){
    console.log(e);
  },
  //获取收藏题
  getQuestionCollection(){

  },
  //清空错题
  clearQuestionWrong(){

  },
  //清空收藏题
  clearQuestionCollection(){

  },

  //滚动触底
  scrolltolower(){
    console.log("11111111111111");
  }

})