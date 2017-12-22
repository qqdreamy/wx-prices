// pages/bindPhone/phoneCode.js
const AV = require('../../libs/av-weapp-min.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    code: null,
    time:60,
    againSend:false,
    downTime:true
  },
  // @绑定验证码
  bindcode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 验证手机验证码
  verifyCode: function () {
    let us = AV.User.current();
    AV.User.verifyMobilePhone(this.data.code).then(()=> {
      // 验证成功
      wx.showToast({
        title: '验证成功',
        icon: 'success',
        mask:true,
        success:()=>{
          // 跳转页面
          wx.switchTab({
            url: '../my/my',
          })
          // 更新全局变量
          app.globalData.userInfo.mobilePhoneVerified=true;
        },
        duration: 1000
      })
    }, function (err) {
      //验证失败
      console.log(err);
    });
  },
  // @重新发送验证码
  sendCode:function(){
    // 弹出loading
    wx.showLoading({
      title: '正在发送中',
    })
    let user=app.globalData.userInfo;
    AV.User.requestMobilePhoneVerify(user.mobilePhoneNumber).then(() => {
      // 成功成功
      wx.hideLoading();
      this.downTime();
      //console.log('成功');
    }).catch(error => {
      wx.hideLoading();
      console.log(error);
    })
  },
  // 验证码倒计时
  downTime:function(){
    this.setData({
      downTime: true,
      againSend: false,
      time:60
    });
    setInterval(() => {
      if (this.data.time == 0) {
        this.setData({
          downTime: false,
          againSend: true
        });
        return
      }
      this.setData({
        time: this.data.time - 1
      })
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone
    })
    this.downTime();
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