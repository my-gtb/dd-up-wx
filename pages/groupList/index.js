import { request } from "../../request/index.js";
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionGroupList:[],
    currentPage:1,
    pagesize:100,
    groupType:0,
    url:"",
    visible:false,
    isSign:false,
    costPoints:0,
    groupId:0,
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
  totalPages:1,

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isSign:getApp().globalData.isSignIn,
      groupType:options.groupType
    })

    this.getList();
  },

  getList(){
    var current = this.data.currentPage;
    var limit = this.data.pagesize;

    //获取套题
    request({
      url: `/question-group/pageCondition/${current}/${limit}/${this.data.groupType}`,
      method:"post"
    })
    .then(result => {
      var list = result.data.rows;
      if(list == null){
        return;
      }

      const total =result.data.total;
      this.totalPages=Math.ceil(total/this.data.pagesize);
      this.setData({
        questionGroupList:[...this.data.questionGroupList,...list]
      })
    })
    wx.stopPullDownRefresh();
  },

  getUrl:function(event){
    var groupId=event.currentTarget.dataset['groupId'];
    var time=event.currentTarget.dataset['time'];
    var costPoints=event.currentTarget.dataset.costPoints;
    var isUnlock = true;
    this.setData({
      time:time,
      groupId:groupId,
      costPoints:costPoints
    })
    if(this.data.groupType == getApp().globalData.groupType.TYPE_SIMULATION){
      let customerId = getApp().globalData.customerId;

      request({url:`/point-log/getHasPointLog/${customerId}/${groupId}`})
      .then(res => {
        if(!res.success){
          isUnlock = false;
          this.setData({
            visible:true,
          })
        }else{
          wx.navigateTo({
            url: "/pages/answer/index?groupId="+groupId+"&time="+time+"&groupType="+this.data.groupType
          })
        }
      })
    }else{
      wx.navigateTo({
        url: "/pages/answer/index?groupId="+groupId+"&time="+time+"&groupType="+this.data.groupType
      })
    }
  },
  checkPoint({ detail }){
    if (detail.index != 0) {
      let customerId = getApp().globalData.customerId;
      let groupId = this.data.groupId;
      let isUnlock = false;

      request({url:`/point-account/unlockQuestionGroup/${customerId}/${groupId}`})
      .then(res => {
        let message = res.data.data.msg;
        let isSuccess = res.data.data.success;
        if(isSuccess){
          wx.navigateTo({
            url: "/pages/answer/index?groupId="+groupId+"&time="+this.data.time+"&groupType="+this.data.groupType
          })
        }else{
          $Message({
            content: message,
            duration: 3,
            type: "warning"
          });
        }
      })      
    } 
    this.setData({
      visible:false,
    })
  }
})