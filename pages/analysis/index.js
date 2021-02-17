import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    s: ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. ', 'D. ', 'I. '],
    questionInfo:{},
    result:{},
    disabled:true,
    actionVisible:false,
    index:0,
    isShowParse: true,
    groupName: "",
  },

  onLoad (options) {
    var code = options.code
    var groupId = options.groupId
    request({url:`/customer-question-log/getQuestionLog/${code}/${groupId}`})
    .then(res => {
      var groupName = res.data.groupName
      var total = res.data.result.total
      var right = res.data.result.rightCount
      var wrong = total - right
      var persent = parseFloat(right/total * 100).toFixed(2)
      this.setData({
        result: res.data.result.list,
        right: right,
        wrong: wrong,
        persent: persent,
        total: total,
        groupName:groupName
      })
      this.setThisData(this.data.index)
    })
  },

  setThisData(i){
    console.log(i)
    const r = this.data.result
    let options = r[i].options;
    let chooseIds = r[i].chooseIds;
    const answer = []
    var current = "";
    var currentD = [];
    console.log(r)
    options.forEach(item => {
      item.isChecked = false;
      if(chooseIds != null && chooseIds.indexOf(item.id) >= 0){
        item.isChecked = true;
      }
    });
    this.setData({
      current: current,
      currentD: currentD,
      questionInfo: r[i],
      answer: answer,
    })
    console.log(this.data.current)
  },
  handlePageChange({ detail }){
    const action = detail.type;
    const r = this.data.result
    
    
    if (action === 'next') {
      if(this.data.index >= (r.length-1)){
        console.log(this.data.index)
        return;
      }
      this.setThisData((this.data.index +1));
      this.setData({
        index: (this.data.index + 1),
      })
    } else {
      this.setThisData((this.data.index - 1));
      this.setData({
        index: (this.data.index - 1),
      })
    }
  },
  //弹出统计下拉层
  handleOpen() {
    this.setData({
      actionVisible: true
    })
  },
  //关闭统计下拉层
  actionCancel() {
    this.setData({
      actionVisible: false
    })
  },
  dump(e){
    console.log(e)
    var index = e.currentTarget.dataset.index
    this.setThisData(index)
    this.setData({
      index:index,
      actionVisible: false
    })
  },
})