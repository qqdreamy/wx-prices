// pages/price_list/PriceList.js
const AV = require('../../libs/av-weapp-min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceLists:[],
    network:true
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取网络状态 如何无网络则提示网络错误
    wx.getNetworkType({
      success: res=> {
        if(res.networkType=='none'){
          this.setData({
            network: false
          })
        }else{
          // 弹出loading
          wx.showLoading({
            title: '正在加载中',
          });
          this.getPriceList().then(results=>{
            this.setData({
              priceLists: results,
              network: true
            });
            wx.hideLoading();
          }).catch(error=>{
            wx.hideLoading();
          })
        }
      }
    });
  },
  // @获取用户列表
  getPriceList:function(){

    return new Promise((resolve, reject)=> {
      var query = new AV.Query('PriceList');
      query.equalTo("user", AV.Object.createWithoutData('_User', AV.User.current().id));
      query.limit(10);
      query.descending('createdAt');
      query.find().then(results => {
        resolve(results);
      }, function (error) {
        this.data.network = false;
        reject(error);
      });
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.getNetworkType({
      success: res=> {
        var networkType = res.networkType
        if (networkType == 'none' ) {
          wx.stopPullDownRefresh();
        } else if (!this.data.network){
          this.getPriceList().then(results=>{
            this.setData({
              priceLists: results,
              network: true
            });
            wx.stopPullDownRefresh();
          })
        }
        wx.stopPullDownRefresh();
      }
    })
  }
})