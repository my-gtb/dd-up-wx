import { request } from "../../request/index.js";
const { $Message } = require('../../dist/base/index');
Page({

  data: {
    result: {}, //题目
    total: 0, //题目总总数
    groupId:'',//套题id
    questionInfo:{},
    percent: 0, //进度条百分比
    time: 45, //时间
    countdown: '', //倒计时
    s: ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. ', 'D. ', 'I. '],
    index: 1, //第几题
    current: '', //单选选中的答案
    currentD: [], //多选选中的答案
    type: '', //题目类型 1:单选 2:多选
    actionVisible: false, //弹出层
    questionErr: 0,//错题个数
    questionOk: 0,// 正确个数
    percentage: 0,
    visible1:false,
    visible2:false,
    isDisabled:false,//选中不可选
    isChecked:false,  //是否选中
    isShowTime:false, //显示倒计时
    isShowParse:false, //显示解析
    totalSecond:0, //倒计时秒数
    isStopCountDown:false, //停止倒计时
    isShowSubmit:true,  //是否显示提交按钮
    isCollection:false,
    isRealQuestion:false,
    groupType:0,
    action1:[
      {
        name: '取消'
      },
      {
        name: '确定',
        color: '#2db7f5',
        loading: false
      }
    ],
    action2:[
      {
        name: '确定',
        color: '#2db7f5',
        loading: false
      }
    ]
  },

  onLoad(e) {
    var groupId = e.groupId != undefined ? e.groupId : 0;
    var groupType = e.groupType;
    if(groupType == 1){
      this.setData({
        isDisabled: true,
        isRealQuestion:true,
      })
    }
    this.setData({
      groupId: groupId,
      isShowSubmit: groupId != 0,
      groupType:groupType
    })

    let url = "/question/getQuestionList/"+groupId;
    if(groupType == getApp().globalData.groupType.TYPE_COMMON){
      url = "/question/getListByGroupTypeId/"+groupType;
    }
    this.fromBegin(url);

    this.handelQuestionCollection();
    let showTimeArray = [getApp().globalData.groupType.TYPE_VIP,getApp().globalData.groupType.TYPE_SIMULATION];

    if( showTimeArray.indexOf(groupType) >= 0){
      var min = e.time;
      this.setData({
        isShowTime:true,
        totalSecond:parseInt(min) * 60
      })
      this.setCountDown();
    }
  },

  //页面加载时处理收藏题目
  handelQuestionCollection(){
    let customerId = getApp().globalData.customerId;
    request({url: `/customer-wrong/getCollectionQuestionId/${customerId}`})
      .then(res => {
        let questionIds = res.data.questionIds;
        console.log(questionIds);
        let questions = this.data.result
        questions.forEach(item => {
          item.isCollection = false;
          if(questionIds != [] && questionIds.indexOf(item.id) >= 0){
            item.isCollection = true;
          }
        })

        this.setData({
          result:questions,
          isCollection:this.data.questionInfo.isCollection
        })
      })
  },

  /* 秒级倒计时 */
  setCountDown() {
    var that = this;
    let second = this.data.totalSecond;
    // 渲染倒计时时钟
    this.setData({
      countdown:this.dateFormat(second),
    });

    if(this.data.isStopCountDown){
      return ;
    }

    if (second <= 0) {
      this.setData({
        countdown:"时间到",
        totalSecond:0,
        isStopCountDown:true
      });
      // timeout则跳出递归
      return ;
    }
    second -= 1;
    this.setData({
      totalSecond:second
    });
    setTimeout(function(){that.setCountDown()}, 1000);
  },

  //重头开始答题
  fromBegin(url){
    var s = this.data.s;
    request({url: url})
    .then(res => {
      let list = res.data.questionList;
      list.forEach(item => {
        let key = [];
        let keyIds = item.keyIds;
        let options = item.options;
        if(item.typeId != 3){
          for(let i = 0;i < options.length;i++){
            if(keyIds.indexOf(options[i].id) >= 0){
              key.push(s[i]+options[i].text)
            }
          }
        }else{
          key = options[0].customData
        }
        item.keyNames = key;
      })
      this.setData({
        result:list,
        total:res.data.total
      })
      this.setThisData(0)
    })
  },
  //设置当前题目
  setThisData(i) {
    const that = this;
    const r = this.data.result
    if (r.length == 0) {
      wx.redirectTo({
        url: '/pages/answerErr/index',
      })
      return
    }

    that.setData({
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

    //进度条
    let percent = this.data.index / this.data.total
    percent = (percent * 100).toFixed(2);
    percent = percent < 1 ? 1 : percent

    this.setData({
      result: result,
      questionOk: questionOk,
      questionErr: questionErr,
      percentage: percentage,
      percent: percent
    })
  },
  radioChange({detail = {}}){
    var val = detail.value;
    var options = this.data.result[this.data.index-1].options;
    let questionInfo = this.data.questionInfo;
    let currentAnswer = "";
    let idx = 0;
    let s = this.data.s;
    options.forEach(item => {
      item.isChecked = false;
      if(item.id == val){
        item.isChecked = true;
        currentAnswer = s[idx]+item.text;
        if(item.isKey) {
          questionInfo.isOk = 1
        } else {
          questionInfo.isOk = 0
        }
      }
      idx++;
    });
    if(this.data.groupType == 3 || this.data.groupType == 4){
      this.statistical();
      questionInfo.optionNames = [currentAnswer];
      this.setData({
        isShowParse:true,
        isDisabled:true,
      })
    }
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

  handleCheckboxAnswer(){
    let questionInfo = this.data.questionInfo;
    let s = this.data.s;
    let currentD = this.data.currentD;
    let names = [];
    let idx = 0;
    questionInfo.options.forEach(item => {
      if(currentD.indexOf(item.id+"") >= 0){
        names.push(s[idx]+item.text);
      }
      idx++;
    });
    this.statistical();
    questionInfo.optionNames = names;
    this.setData({
      isShowParse:true,
      isDisabled:true,
      questionInfo:questionInfo
    })
  },

  //翻页
  handlePageChange({ detail }) {
    const action = detail.type;
    //上下一题
    if (action === 'next') {
      const r = this.data.result;

      const isChecked = this.data.isChecked;
      const isDisabled = this.data.isDisabled;
      const questionInfo = this.data.questionInfo;
      const i = this.data.index;
      if(this.data.isRealQuestion){
        if(i >= r.length){
          return;
        }
        this.setThisData(i);
        this.setData({
          index: i + 1,
          isDisabled:true,
          isChecked:true,
          isCollection:r[i].isCollection
        })
        return
      }
      if (!isDisabled && !isChecked) {
        wx.showToast({
          title: '请选择答案',
          duration: 1500,
          image: '/images/warning.png'
        })
        return;
      }

      
      if (i == r.length) {
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
        let isOk = this.data.questionInfo.isOk;
        let customerId = getApp().globalData.customerId;
        let data = {
          "customerId":customerId,
          "questionId":r[i].id,
          "groupId":questionInfo.groupId,
          "isWrong":true
        };
        if(!isOk){
          request({url: "/question/saveQuestionWrong",data:data,method:'post'})
          .then(res => {
            console.log(res)
          })
        }
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
        isShowParse:canShowParse
      });
    } else if (action === 'prev') {
      var i = this.data.index - 2;

      this.setThisData(i);
      const r = this.data.result;

      this.setData({
        index: this.data.index - 1,
        isDisabled:true,
        isShowParse: !this.data.isShowTime,
        isCollection:r[i].isCollection
      });
    }
  },

  //收藏/取消收藏题目
  changeCollection(){
    let isCollection = this.data.isCollection;
    let questionInfo = this.data.questionInfo;
    questionInfo.isCollection = !isCollection;
    this.setData({
      isCollection:!isCollection,
      questionInfo:questionInfo
    })

    let customerId = getApp().globalData.customerId;
        let data = {
          "customerId":customerId,
          "questionId":questionInfo.id,
          "groupId":questionInfo.groupId,
          "isCollection":this.data.isCollection
        };
        request({url: "/question/saveQuestionWrong",data:data,method:'post'})
        .then(res => {
          console.log(res)
        })
    if(questionInfo.isCollection){
      $Message({
          content: '题目已收藏',
          duration: 3,
          type: 'success'
        });
        return;
    }
  },

  //交卷处理
  submit(){
    this.setData({
      loading:true,
      visible1:false
    })
    var result = this.data.result
    var questionOk = this.data.questionOk
    let customerId = getApp().globalData.customerId;
    let submitData = [];
    let code = Math.round(new Date().getTime()/1000);

    code = code + "-"+customerId;
    for(let i = 0;i < result.length;i++){
      if(result[i].chooses == undefined){
        break;
      }
      let map = {
        "code":code,
        "customerId":customerId,
        "questionId":result[i].id,
        "optionIds": JSON.stringify(result[i].chooses),
        "isOk":result[i].isOk,
      };
      submitData.push(map);
    }

    request({url:"/customer-question-log/saveQuestionLog",data:JSON.stringify(submitData),method:'post'})
      .then(res =>{
        console.log(res);
      })

      if(this.data.isShowSubmit){
        getApp().globalData.questions = result
        wx.reLaunch({
          url: '../history/index?questionOk='+questionOk+"&total="+result.length+"&code="+code+"&groupId="+this.data.groupId
        })
      }
  },
  //保存对话框
  handleSaveOpen(){
    this.setData({
      visible4: true,
    })
  },
  //交卷对话框
  handleSubmitOpen(){
    if(this.data.questionInfo.isOk != undefined){
      this.statistical()
    }
    this.setData({
      visible1:true,
      isStopCountDown: true
    })
  },
  //交卷按钮
  checkSubmit({ detail }){
    //取消
    if (detail.index === 0) {
      this.setData({
        visible1: false,
        isStopCountDown: false
      });
      this.setCountDown();
    } else{
      this.setData({
        isStopCountDown: true
      });
      //交卷
      this.submit();
    }
  },
  handleSubmit(){
    this.submit();
  },
  //时间到对话框
  handleClick1(){
    this.setData({
      visible2: true
    });
  },
  //弹出统计下拉层
  handleOpen(){
    this.setData({
      actionVisible:true
    })
  },
  //关闭统计下拉层
  actionCancel(){
    this.setData({
      actionVisible:false
    })
  },

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
dateFormat(second) {
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = this.fillZeroPrefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = this.fillZeroPrefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;

  return hr + ":" + min + ":" + sec;
},

// 位数不足补零
fillZeroPrefix(num) {
  return num < 10 ? "0" + num : num
},

/**
  * 生命周期函数--监听页面卸载
  */
onUnload: function () {
  this.setData({
      isStopCountDown: true
  });
},
})