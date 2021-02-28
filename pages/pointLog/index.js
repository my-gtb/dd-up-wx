import { request } from "../../request/index.js";

Page({
  data: {
    loading:true,
    balance:0,
    current:1,
    limit:8,
    pointLogs:[],
    scrollHeight:0,
  },

  onLoad (options) {
    let customerId = getApp().globalData.customerId;
    let current = this.data.current;
    let limit = this.data.limit;
    request({url:`/point-log/getPointLogs/${current}/${limit}/${customerId}`})
      .then(res => {
        console.log(res);
          this.setData({
            pointLogs: res.data.list,
            balance:res.data.points
          })
      })

    var that = this;

    let screenHeight = wx.getSystemInfoSync().windowHeight  //获取屏幕高度
    let query = wx.createSelectorQuery().in(that);
    query.select(".header").boundingClientRect();
    query.select(".log-title").boundingClientRect();

    query.exec(r => {
      let h1 = r[0].height;
      let h2 = r[1].height;

      let scrollHeight = screenHeight - h1 - h2 - 30;

      that.setData({
        scrollHeight: scrollHeight,
      })
    })
  },

  lower() {
    var currentPage = this.data.current + 1;
    this.setData({
      current:currentPage
    })
    let customerId = getApp().globalData.customerId;
    let current = this.data.current;
    let limit = this.data.limit;
    request({url:`/point-log/getPointLogs/${currentPage}/${limit}/${customerId}`})
      .then(res => {
        let list = res.data.list;
        this.setData({
          pointLogs:[...this.data.pointLogs,...list]
        })
      })
  }
})