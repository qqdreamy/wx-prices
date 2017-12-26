const AV = require('../../libs/av-weapp-min.js');

// 获取应用事例
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },
  // @呼叫电话
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: '18008620099'
    })
  },
  // @go门市地址
  goOffice: function (e) {
    wx.openLocation({
      longitude: Number(114.249900),
      latitude: Number(30.625470),
      name: "德成包装(门市)",
      address: "湖北省武汉市东西湖区莱特市场15栋B06"
    })
  },
  // @地图显示工厂地址
  goFactory: function (e) {
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
    const user = AV.User.current();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      if (this.data.nickName == null) {
        // 服务端无userInfo则获取用户信息
        wx.getUserInfo({
          success: res => {
            // 将用户信息写入服务端并更新本地变量全局变量
            user.set(res.userInfo).save().then(user => {
              app.globalData.userInfo = user.toJSON();
              this.setData({
                userInfo: user.toJSON(),
                hasUserInfo: true
              })
            }).catch(console.error);
          }
        })
      }
    } else {
      app.loginReadyCallback = res => {
        this.setData({
          userInfo: res.toJSON(),
          hasUserInfo: true
        })
      }
    }
    // 监听网络
    wx.onNetworkStatusChange(res=>{
      // 判断是否有网络连接
      if(res.isConnected){
        app.getUserInfo(user => {
          this.setData({
            userInfo: user,
            hasUserInfo: true
          })
        })
      }
    })
  },
  onShow: function (options){
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  }
})