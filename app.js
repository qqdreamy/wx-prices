const AV = require('./libs/av-weapp-min.js');
const config = require('./config');
// LeanCloud 应用的 ID 和 Key
// 替换为自己的appId与appKey
AV.init({
  appId: config.leancloud.appId,
  appKey: config.leancloud.appKey,
});
//app.js
App({
  onLaunch: function () {
    //wx.showLoading({
    //  title: '正在加载中',
    //  mask:true
    //})
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 调用leancloud登录接口
    AV.User.loginWithWeapp().then(user => {
      this.globalData.userInfo = user.toJSON();
      console.log(this.globalData.userInfo);
      // 测试
      if (this.loginReadyCallback) {
        this.loginReadyCallback(user);
      }
    }).catch(console.error);
    // 已授权则直接获取用户信息
    /*wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData.userInfo);
            }
          })
        }
      }
    })*/
  },
  getUserInfo: function (cb) {

  },
  globalData: {
    userInfo: null
  }
})