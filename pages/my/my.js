// pages/my/my.js

// 获取应用事例
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null
  },
  // @呼叫电话
  callPhone:function(e){
    wx.makePhoneCall({
      phoneNumber: '18008620099' 
    })
  },
  // @go门市地址
  goOffice:function(e){
    wx.openLocation({
      longitude: Number(114.249900),
      latitude: Number(30.625470),
      name: "德成包装(门市)",
      address: "湖北省武汉市东西湖区莱特市场15栋B06"
    })
  },
  // @地图显示工厂地址
  goFactory:function(e){
    wx.openLocation({
      longitude: Number(114.286990),
      latitude: Number(30.673020),
      name: "德成包装(工厂)",
      address: "武汉市东西湖区银潭路8号正兴工业园"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      //icon:base64.icon20
      icon: "../../assets/phone.png"
    });
    //调用应用实例的方法获取全局数据
    console.log(app.globalData.userInfo);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }else{
      //console.log(loginReadyCallback);
      // 防止进入该页面时appjs获取服务端数据还未成功加入callback
      app.loginReadyCallback = res => {
        this.setData({
          userInfo: res.toJSON(),
          hasUserInfo: true
        })
      }
      /*wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })*/
    }
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