// pages/bindPhone/bind.js
const AV = require('../../libs/av-weapp-min.js');

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    phone:null
  },
  // @手机号码
  bindPhone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  // @发送验证码,并进入下一步验证
  nextCode:function(){
    // 弹出loading
    wx.showLoading({
      title: '正在发送中',
      mask:true
    })
    // 验证手机号码格式
    let phReg = /^1[34578]\d{9}$/; //手机号正则校验
    if (this.data.phone == ""){
      wx.showToast({
        title: '请填写手机号',
        icon: 'success'
      })
    } else if (!phReg.test(this.data.phone)){
      wx.showToast({
        title: '手机号码有误',
        icon: 'success'
      })
    }else{
      // 小程序登录
      let user = AV.User.current();
      //AV.User.loginWithWeapp().then(user => {
      // 设置并保存手机号,系统自动发送验证短信
      user.setMobilePhoneNumber(this.data.phone);
      user.save().then(user=>{
        // 隐藏loading提示
        wx.hideLoading();
        wx.redirectTo({
          url: 'phoneCode?phone=' + this.data.phone
        })
      }).catch(error => {
        wx.hideLoading();
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hasUserInfo: true,
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})