import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectQuestionMenu:'请选择',
    objectQuestionMenu:{},
    questionGroupList:[],
    currentPage:1,
    pagesize:6
  },
  totalPages:1,

  onLoad: function (options) {
    this.getList();
  },

  getList(){
    var current = this.data.currentPage;
    var limit = this.data.pagesize;
    //获取套题
    request({ 
      url: `/question-group/pageCondition/${current}/${limit}`
    })
    .then(result => {
      var list = result.data.rows;
      const total =result.data.total;
      this.totalPages=Math.ceil(total/this.data.pagesize);
      this.setData({
        questionGroupList:[...this.data.questionGroupList,...list]
      })
    })
    wx.stopPullDownRefresh();
  },

  fenleilx(){
    console.log("00000000000000000000000");
  },
  suijilx(){
    console.log("222222222222222222222");
  },
  shunxuImage(){
    console.log("333333333333333333");
  },
  fangzhenImage(){
    console.log("44444444444444444444");
  },
  vipzt(){
    console.log("55555555555555555555");
  },
  cuotsouc(){
    console.log("666666666666666666666666");
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