// pages/bindPhone/phoneCode.js
const AV = require('../../libs/av-weapp-min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    code: null
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
    AV.User.verifyMobilePhone(this.data.code).then(function () {
      // 验证成功
      wx.redirectTo({
        url: '../my/my'
      })
    }, function (err) {
      //验证失败
      console.log(err);
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone
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