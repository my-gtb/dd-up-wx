import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionInfo:{},
    s: ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. ', 'D. ', 'I. '],
    isShowParse:false,
    isShowSubmit:true,
    isVisible:false,
    isVisible2:false,
    typeId:0,
    currentChecked:[],
    isOk:false,
    isDisabled:false,
    tips:"",
    action:[
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
        name: '取消'
      },
      {
        name: '确定',
        color: '#2db7f5',
        loading: false
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let questionId = options.questionId
    request({url: "/question/getQuestionFormById/"+questionId})
      .then(res => {
        console.log(res)
        this.setData({
          questionInfo:res.data.questionForm,
          typeId:res.data.questionForm.typeId
        })
      })
  },

  choiceChange({detail = {}}){
    var val = detail.value;
    this.setData({
      currentChecked: this.data.typeId == 1 ? [val] : val,
    });
  },

  handleSubmitOpen(){
    this.setData({
      isVisible:true
    })
  },

  checkSubmit({ detail }){
    //取消
    if (detail.index === 0) {
      this.setData({
        isVisible: false,
      });
    } else{ //确认
      //交卷
      this.submit();
      let tips = "";
      if(this.data.isOk){
        let pointNum = getApp().globalData.isSignIn ? "，积分 +1":"";
        tips = "恭喜你回答正确"+pointNum;
      }else{
        tips = "抱歉，你的答案是错误的"
        let customerId = getApp().globalData.customerId;
        let data = {
          "customerId":customerId,
          "questionId":this.data.questionInfo.id,
          "isWrong":true,
          "groupId":this.data.questionInfo.groupId,
        };
        request({url: "/question/saveQuestionWrong",data:data,method:'post'})
          .then(res => {
            console.log(res)
          })
      }

      this.setData({
        isVisible: false,
        isDisabled:true,
        isShowParse:true,
        isShowSubmit:false,
        tips:tips
      });
    }
  },

  submit(){
    let currentChecked = this.data.currentChecked;
    let questionInfo = this.data.questionInfo;
    let options = questionInfo.options;
    let chooseNames = [];
    let keyNames = [];
    let submitData = [];
    let isOk = false;
    for(let i = 0;i < options.length;i++){
      currentChecked.forEach(choose => {
        if(options[i].id == parseInt(choose)){
          chooseNames.push(this.data.s[i]+options[i].text)
          if(options[i].isKey){
            isOk = true;
          }else{
            isOk = false;
          }
        }
      })
      if(options[i].isKey){
        keyNames.push(this.data.s[i]+options[i].text)
      }
    }
    let code = Math.round(new Date().getTime()/1000);
    let customerId = getApp().globalData.customerId;
    code = code + "-"+customerId;
    let map = {
      "code":code,
      "customerId":customerId,
      "questionId":questionInfo.id,
      "optionIds": JSON.stringify(currentChecked),
      "isOk":isOk,
    };
    submitData.push(map);

    request({url:"/customer-question-log/saveQuestionLog",data:JSON.stringify(submitData),method:'post'})
      .then(res =>{
        console.log(res);
      })
      
    questionInfo.chooseNames = chooseNames;
    questionInfo.keyNames = keyNames;
    this.setData({
      questionInfo: questionInfo,
      isOk: isOk,
    })
  },
})