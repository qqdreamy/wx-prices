//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    grids: [
      { name: "天地盖", imageUrl: "../../assets/box.png", url:"../TopBox/baojia"},
      { name: "手提袋", imageUrl: "../../assets/bag.png", url: "../bag/bag"} ,
      { name: "彩盒", imageUrl: "../../assets/colorbox.png", url: "../ColorBox/DrawerBox"} 
    ],
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  primary:function(){
    //wx.navigateTo({
      //url: '../TopBox/baojia',
    //})
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
