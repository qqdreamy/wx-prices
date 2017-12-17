// pages/baojia/baojiaMsg.js

const js_CountPrice = require('../../libs/CountPrice.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:'',
    priceList:{}
  },
  //返回
  navigateBack:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  // @保存至报价单
  savePriceList:function(){
    console.log(this.data.priceList);
    // 弹出loading
    wx.showLoading({
      title: '报价保存中',
    })
    // 保存报价单
    js_CountPrice.savePriceList(this.data.priceList.name, this.data.priceList.size, this.data.priceList.quantitys,this.data.priceList.technology, this.data.price).then(value=>{
      // 隐藏loading 弹出提示进入报价列表
      wx.hideLoading();
      wx.showModal({
        title: '保存成功',
        content: '您可以在我的报价列表中查看',
        confirmText:'去看看',
        cancelText:'继续报价',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/my'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      price: options.price,
      priceList: JSON.parse(options.priceList)
    })
    console.log(this.data.priceList);
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