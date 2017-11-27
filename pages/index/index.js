//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  primary:function(){
    wx.navigateTo({
      url: '../baojia/baojia',
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
