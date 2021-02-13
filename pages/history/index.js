Page({
  data: {
    loading:true,
    total:0,
    score:0,
    average:0,
    rightNum:0,
    errorNum:0,
    code:0,
    groupId:0
  },

  onLoad (options) {
    var questionOk = options.questionOk;
    var total = options.total;
    var code = options.code;
    console.log("options");
    console.log(options);

    this.setData({
      groupId: options.groupId,
      code: code,
      total: total*5,
      score: questionOk*5,
      rightNum: questionOk,
      errorNum: total-questionOk,
      questions: getApp().globalData.questions,
    })
  },
  back(){
    wx.reLaunch({
      url: '/pages/select/index',
    })
  },
  analysis(){
    wx.navigateTo({
      url: "/pages/analysis/index?code="+this.data.code+"&groupId="+this.data.groupId,
    })
  }
})