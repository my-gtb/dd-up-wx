import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1:'',
    value2:''
  },
  onLoad (e) {

  },
  handleChange(field, value) {
    this.setData({
      [field]: value
    })
  },
  handleChange1({ detail }) {
    this.handleChange('value1', detail.detail.value)
  },
  handleChange2({ detail }) {
    this.handleChange('value2', detail.detail.value)
  },
  formSubmit(e) {
    var phoneNum = this.data.value1;
    var content = this.data.value2;
    var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (!reg.test(phoneNum)) {
      wx.showToast({
        title: '号码不合法',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    if(content == ''){
      wx.showToast({
        title: '内容不为空',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    let customerId = getApp().globalData.customerId;

    let data = {
      "customerId":customerId,
      "telephone":phoneNum,
      "content":content
    }
    request({url:"/feedback/addFeedback",data:data,method:"post"}).then(res=>{
      if (res.success){
        wx.showToast({
          title: '提交成功',
          success: function () {
            setTimeout(function () {
              //要延时执行的代码
              wx.switchTab({
                url: '../my/index'
              })
            }, 1500)
          }
        });
        
      }else{
        wx.showToast({
          title: '提交失败',
          icon: 'loading',
          duration: 1500
        });
        return false;
      }
    })
  }
})