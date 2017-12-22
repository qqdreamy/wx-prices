// pages/price_list/PriceList.js
const AV = require('../../libs/av-weapp-min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 弹出loading
    wx.showLoading({
      title: '正在加载中',
    })
    var query = new AV.Query('PriceList');
    query.equalTo("user", AV.Object.createWithoutData('_User', AV.User.current().id));
    query.limit(10);
    query.descending('createdAt');
    query.find().then(results=> {
      this.setData({
        priceLists:results
      })
      // 隐藏正在loading
      wx.hideLoading()
    }, function (error) {
      // 错误
    });
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