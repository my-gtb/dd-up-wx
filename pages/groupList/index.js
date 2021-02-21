import { request } from "../../request/index.js";
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionGroupList:[],
    currentPage:1,
    pagesize:6,
    groupType:0,
    url:"",
    visible:false,
    isSign:false,
    costPoints:0,
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
    console.log(options);
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
    if(this.data.groupType == getApp().globalData.groupType.TYPE_SIMULATION){
      this.setData({
        visible:true,
        costPoints:event.currentTarget.dataset.costPoints
      })
      return;
    }
    var groupId=event.currentTarget.dataset['groupId'];
    var time=event.currentTarget.dataset['time'];
    wx.navigateTo({
      url: "/pages/answer/index?groupId="+groupId+"&time="+time+"&groupType="+this.data.groupType
    })
  },
  checkPoint({ detail }){
    if (detail.index != 0) {
      let customerId = getApp().globalData.customerId;
      let isUnlock = false;
      $Message({
        content: '已解锁',
        duration: 3,
        type: 'success'
      });
    } 
    this.setData({
      visible:false,
    })
  }
})