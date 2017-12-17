const AV = require('./libs/av-weapp-min.js');
// LeanCloud 应用的 ID 和 Key
AV.init({
  appId: 'cjtOItWI6rsyCzjvJCh9iSMH-gzGzoHsz',
  appKey: '5uIGW67Gq2wbEnLaD7IlVUHu',
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
      // 测试
      if (this.loginReadyCallback) {
        this.loginReadyCallback(user);
        console.log(1);
      }  
     // wx.hideLoading();
    }).catch(console.error);
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  getUserInfo: function (cb) {

  },
  globalData: {
    userInfo: null
  }
})