import { request } from "../../request/index.js";
const { $Message } = require('../../dist/base/index');
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
    index: 1, //第几题
    isShowParse: true,
    questionErr: 0,//错题个数
    questionOk: 0,// 正确个数
    type:0,
    current: '', //单选选中的答案
    currentD: [], //多选选中的答案
    percentage: 0,
    isDisabled:false,//选中不可选
    isShowParse:false, //显示解析
    isWrong:true,
    isCollection:false,
  },

  onLoad (options) {
    let customerId = getApp().globalData.customerId;
    var groupId = options.groupId == undefined ? null : options.groupId;
    var isWrong = options.isWrong == undefined ? null : options.isWrong;
    var isCollection = options.isCollection == undefined ? null : options.isCollection;
    var startTime = options.startTime == undefined ? null : options.startTime;
    var endTime = options.endTime == undefined ? null : options.endTime;
    let data = {
      "customerId":customerId,
      "groupId":groupId,
      "isWrong":isWrong,
      "isCollection":isCollection,
      "startTime":startTime,
      "endTime":endTime,
    }
    this.setData({
      isWrong: options.isWrong != undefined
    })
    var questionIds = [];
    request({url: `/customer-wrong/getCollectionQuestionId/${customerId}`})
      .then(res => {
         questionIds = res.data.questionIds;
      })
    request({url:"/customer-wrong/getWrongOrCollection",data:data,method:'post'})
    .then(res => {
      var total = res.data.total
      var list = res.data.questionList
      list.forEach(item => {
          item.isCollection = false;
          if(questionIds.indexOf(item.id) >= 0){
            item.isCollection = true;
          }
        })
      this.setData({
        result: list,
        total: total
      })
      this.setThisData(0)
    if(this.data.questionInfo.isCollection){
      this.setData({
        isCollection: true,
      })
    }
    if(options.isCollection != undefined){
      this.setData({
        isCollection: true,
      })
    }
    })

  },

  //设置当前题目
  setThisData(i) {
    const r = this.data.result

    this.setData({
      questionInfo: r[i],
      type: r[i].typeId
    })
  },

    //统计答题
  statistical() {
    if ((this.data.questionErr + this.data.questionOk) == this.data.result.length){
      return
    }
    var options = this.data.result[this.data.index - 1].options;
    //记录选择的答案
    if (this.data.type == 1) {
      //单选
      var choose = this.data.current;
      this.data.result[this.data.index - 1].chooses = [choose];

      for(let i = 0; i< options.length;i++){
        if(choose == options[i].id){
          this.data.result[this.data.index - 1].optionNames = [this.data.s[i]+options[i].text];
          break;
        }
      }
    } else {
      //多选
      var choose = this.data.currentD;
      this.data.result[this.data.index - 1].chooses = choose;
      let optionNames = [];
      for(let i = 0; i < options.length;i++){
        for(let j = 0;j < choose.length;j++){
          if(choose[j] == options[i].id){
            optionNames.push(this.data.s[i]+options[i].text);
            continue;
          }
        }
      }
      this.data.result[this.data.index - 1].optionNames = optionNames
    }
    let questionErr = this.data.questionErr  //错题个数
    let questionOk = this.data.questionOk  //错题个数
    let questionInfo = this.data.questionInfo
    let result = this.data.result
    let index = this.data.index
    let keyIds = result[index-1].keyIds

    let keyNames = [];
    for(let i = 0;i < options.length;i++){
      for(let j = 0;j < keyIds.length;j++){
        if(keyIds[j] == options[i].id){
          keyNames.push(this.data.s[i]+options[i].text);
          continue;
        }
      }
    }
    result[index-1].keyNames = keyNames;

    if (questionInfo.isOk === 1) {
      questionOk = questionOk + 1
      result[index - 1].judge = 1
    }else{
      questionErr = questionErr + 1
      result[index - 1].judge = 0
    }

    //计算百分比
    let percentage = questionOk / (index) * 100
    percentage = percentage.toFixed(2)

    this.setData({
      result: result,
      questionOk: questionOk,
      questionErr: questionErr,
      percentage: percentage,
    })
  },

  radioChange({detail = {}}){
    var val = detail.value;
    var options = this.data.result[this.data.index-1].options;
    let questionInfo = this.data.questionInfo
    options.forEach(item => {
      item.isChecked = false;
      if(item.id == val){
        item.isChecked = true;
        if(item.isKey) {
          questionInfo.isOk = 1
        } else {
          questionInfo.isOk = 0
        }
      }
    });
    this.setData({
      questionInfo: questionInfo,
      current: val,
      isChecked: true,
    });
  },
  checkboxChange(e){
    var vals = e.detail.value;
    var question = this.data.result[this.data.index-1];
    let questionInfo = this.data.questionInfo
    question.options.forEach(item => {
      item.isChecked = false;
      if(vals.indexOf(item.id+"") >= 0){
        item.isChecked = true;
      }
    });

    if(vals.sort().toString() == question.keyIds.toString()) {
      questionInfo.isOk = 1
    } else {
      questionInfo.isOk = 0
    }

    this.setData({
      questionInfo: questionInfo,
      currentD: vals,
      isChecked: true,
    });
  },

  //翻页
  handlePageChange(e) {
    const action = e.detail.type;
    //上下一题
    if (action === 'next') {
      var r = this.data.result;

      const isChecked = this.data.isChecked;
      const isDisabled = this.data.isDisabled;
      const questionInfo = this.data.questionInfo;

      if (!isDisabled && !isChecked) {
        wx.showToast({
          title: '请选择答案',
          duration: 1500,
          image: '/images/warning.png'
        })
        return;
      }

      let i = this.data.index;
      if(this.data.total == i){
        this.setData({
          isShowParse: true,
        });
        this.statistical()
        $Message({
          content: '题目已答完',
          duration: 3,
          type: 'warning'
        });
        return;
      }

      if (!isDisabled) {
        this.statistical()
      }


      let canShowParse = true;
      if(this.data.isShowTime){
        canShowParse = false;
      }
      
      this.setThisData(i);

      let canDisabled = false;
      let flag = r[i].options[0].isChecked;
      
      if(flag != undefined){
        canDisabled = true;
      }

      if(this.data.isStopCountDown){
        canDisabled = true;
      }

      if(r[i-1].isCollection != this.data.isCollection){
        r[i-1].isCollection = this.data.isCollection
        this.setData({
          result:r
        })
      }
      this.setData({
        index: i + 1,
        isDisabled:canDisabled,
        isChecked:false,
        isShowParse:canShowParse,
        isCollection:r[i].isCollection
      });

      if (this.data.isDisabled == false) {
        canShowParse = false
      }
      this.setData({
        isShowParse:canShowParse,
      });
      
    } else if (action === 'prev') {
      var i = this.data.index - 2;
      this.statistical()
      this.setThisData(i);
      var r = this.data.result;

      this.setData({
        index: this.data.index - 1,
        isDisabled:true,
        isShowParse: !this.data.isShowTime,
        isCollection:r[i].isCollection
      });
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
    var index = e.currentTarget.dataset.index
    this.setThisData(index)
    this.setData({
      index:index,
      actionVisible: false
    })
  },
  //移除错题
  removeWrong(){
    let result = this.data.result;
    let i = this.data.index;
    let isWrong = this.data.isWrong;

    let customerId = getApp().globalData.customerId;
    let data = {
      "customerId":customerId,
      "questionId":result[i-1].id,
      "isWrong":isWrong ? false : null,
      "isCollection": !isWrong ? false : null,
    };
    request({url: "/question/saveQuestionWrong",data:data,method:'post'})
    .then(res => {
      console.log(res)
    })
    result.splice(i-1,1);
    let e = {
      "detail":{
        "type":"next"
      }
    }

    this.setData({
      result:result,
      total:this.data.total-1,
      isChecked:true,
    })
    this.handlePageChange(e);

    $Message({
      content: '该错题已移出错题本',
      duration: 3,
      type: 'success'
    });
    return;
  },
  //收藏或不收藏
  changeCollection(){
    let result = this.data.result;
    let i = this.data.index;
    let isWrong = this.data.isWrong;

    let customerId = getApp().globalData.customerId;
    var isCollection = this.data.isCollection;
    let data = {
      "customerId":customerId,
      "questionId":result[i-1].id,
      "isCollection": !isCollection,
    };
    request({url: "/question/saveQuestionWrong",data:data,method:'post'})
    .then(res => {
      console.log(res)
    })
    if(!isWrong){
      result.splice(i-1,1);
      let e = {
        "detail":{
          "type":"next"
        }
      }
      this.setData({
        result:result,
        total:this.data.total-1,
        isChecked:true,
      })
      this.handlePageChange(e);
    }else{
      this.setData({
        isCollection:!isCollection,
      })
    }
    

    if(isWrong){
      $Message({
          content: '题目已收藏',
          duration: 3,
          type: 'success'
        });
        return;
    }
    return;
  }
})