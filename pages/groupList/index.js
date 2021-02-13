import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionGroupList:[],
    currentPage:1,
    pagesize:6,
    groupType:0,
    url:""
  },
  totalPages:1,

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.groupType = options.groupType;
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
    var groupId=event.currentTarget.dataset['groupid'];
    var time=event.currentTarget.dataset['time'];
    wx.navigateTo({
      url: "/pages/answer/index?groupId="+groupId+"&time="+time+"&groupType="+this.data.groupType
    })
  },
})