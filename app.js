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
    // 获取网站状态如果没有网络,不进行网络操作
    wx.getNetworkType({
      success: res=> {
        var networkType = res.networkType
        if (networkType == 'none'){
        }else{
          // 调用leancloud登录接口
          AV.User.loginWithWeapp().then(user => {
            this.globalData.userInfo = user.toJSON();
            // 测试
            if (this.loginReadyCallback) {
              this.loginReadyCallback(user);
            }
          }).catch(console.error);
        }
      }
    })

  },
  // 获取用户信息并同步服务端-全局函数
  getUserInfo: function (callback){
    // 获取用户信息
    const user = AV.User.current();
    wx.getUserInfo({
      success: res => {
        // 将用户信息写入服务端并更新本地变量全局变量
        user.set(res.userInfo).save().then(user => {
          this.globalData.userInfo = user.toJSON();
          callback(user.toJSON());
        }).catch(console.error);
      },
      fail: res => {
        console.log(res);
      }
    })
  },
  globalData: {
    userInfo: null
  }
})