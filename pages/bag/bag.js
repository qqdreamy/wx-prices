// pages/bag/bag.js
var js_CountPrice = require('../../libs/CountPrice.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    long: 200,
    wide: 80,
    height: 200,
    quantitys: [500, 1000, 2000,3000,5000,10000],
    quantity: 1,
    papers: ["白卡纸", "特种纸", "牛皮纸", "自设纸"],
    papersIndex: 0,
    paperWeights: [{ id: 200, name: '200g' }, { id: 230, name: '230g' }, { id: 250, name: '250g' }, { id: 300, name: '300g' }],
    paperWeightsIndex: 2,
    prints: ["四色", "单色", "专色", "无需印刷"],
    print: 0,
    film: true,
    permed:false,
    ropes: ["三股棉绳", "棉绳", "尼龙绳"],
    ropesIndex: 0,
    bagType: 1,
    paperPrice: 0,
    boxPrice: {
      count: 0,
      process: 0,
      paper: 0,
      print: 0,
      film:0,
      rope:0
    }
  },
  longInput: function (e) {
    this.setData({
      long: e.detail.value
    })
  },
  wideInput: function (e) {
    this.setData({
      wide: e.detail.value
    })
  },
  heightInput: function (e) {
    this.setData({
      height: e.detail.value
    })
  },
  paperPriceInput: function (e) {//自设纸价格
    this.setData({
      paperPrice: e.detail.value
    })
  },
  //数量选择
  quantityChange: function (e) {
    this.setData({
      quantity: e.detail.value
    })
  },
  //纸张选择
  bindPapersChange: function (e) {
    this.setData({
      papersIndex: e.detail.value
    })
  },
  //克重选择
  bindPaperWeightsChange: function (e) {
    this.setData({
      paperWeightsIndex: e.detail.value
    })
  },
  //印刷选择
  printChange: function (e) {
    this.setData({
      print: e.detail.value
    })
  },
  //覆膜选择
  filmChange: function (e) {
    this.setData({
      film: e.detail.value
    })
  },
  //烫金选择
  permedChange:function(e){
    this.setData({
      permed:e.detail.value
    })
  },
  ExpandLong: function (e) { //计算手提袋展开尺寸
    const MaxLog = 930;//最大单粘尺寸
    if (this.data.long * 2 + this.wide * 2 + 20 > MaxLog) {
      this.setData({
        bagType: 2
      });
      return this.data.long + (this.wide - 1) + 20;
    } else {
      this.setData({
        bagType: 1
      })
      return this.data.long * 2 + this.data.wide * 2 + 20;
    }
  },
  ExpandWide: function (e) {//计算手提袋展开尺寸
    return Number(this.data.height) + 40 + (this.data.wide / 2 + 15);
  },
  clearPrice: function () {//清空数据
    for (var i in this.data.boxPrice) {
      this.data.boxPrice[i] = 0;
    }
  },
  CountPrice: function (e) {
    this.clearPrice()//计算之前清空数据
    wx.showLoading({
      title: '正在计算ing',
    })
    js_CountPrice.KaHePromise(this.ExpandLong(), this.ExpandWide(), this.data.quantitys[this.data.quantity]).then(value=>{
      return value;
    }).then(kahe=>{
      return js_CountPrice.ProcessPromise('手提袋' + this.data.bagType, this.data.quantitys[this.data.quantity]).then(value => {
        this.setData({
          'boxPrice.process': (value+kahe).toFixed(2)
        });
      });
    }).then(() => {//纸张
      if (this.data.papersIndex== 3) {//自设纸判断
        let value= js_CountPrice.ColorSurfacePromise(this.ExpandLong(), this.ExpandWide(), this.data.papers[this.data.papersIndex], this.data.paperWeights[this.data.paperWeightsIndex].id, this.data.paperPrice);
        if (this.data.bagType == 2) {
          this.data.boxPrice.paper = (value * 2).toFixed(2);
        } else {
          this.data.boxPrice.paper = value.toFixed(2);
        }
      } else {//非自设纸
        return js_CountPrice.ColorSurfacePromise(this.ExpandLong(), this.ExpandWide(), this.data.papers[this.data.papersIndex], this.data.paperWeights[this.data.paperWeightsIndex].id).then(value => {
          if (this.data.bagType == 2) {
            this.data.boxPrice.paper = (value * 2).toFixed(2);
          } else {
            this.data.boxPrice.paper = value.toFixed(2);
          }
        })
      }
    }).then(() => {//印刷
      if (this.data.print != 3) {
        return js_CountPrice.PrintPromise(this.ExpandLong(), this.ExpandWide(), this.data.quantitys[this.data.quantity], this.data.print).then(value => {
          if (this.data.bagType == 2) {
            this.data.boxPrice.print = (value * 2).toFixed(2);
          } else {
            this.data.boxPrice.print = value.toFixed(2);
          }
        })
      }
    }).then(() => {//覆膜
      if (this.data.film){
        return js_CountPrice.FilmPromise(this.ExpandLong(), this.ExpandWide(), this.data.quantitys[this.data.quantity]).then(value => {
          if (this.data.bagType == 2) {
            this.data.boxPrice.film = (value * 2).toFixed(2);
          } else {
            this.data.boxPrice.film = value.toFixed(2);
          }
        })
      }
    }).then(() => {//烫金
      if (this.data.permed){
        return js_CountPrice.PermedPromise('1', this.data.quantitys[this.data.quantity]).then(value=>{
          this.data.boxPrice.permed=value.toFixed(2);
        })
      }
    }).then(() => {//提绳
      return js_CountPrice.RopePromise(this.data.ropes[this.data.ropesIndex]).then(value=>{
        this.data.boxPrice.rope=value.toFixed(2);
      })
    }).then(() => {//最后步骤计算总价
      this.setData({//初始化count值
        'boxPrice.count': 0
      });
      for (var i in this.data.boxPrice) {
        this.data.boxPrice.count += i == "count" ? 0 : Number(this.data.boxPrice[i]);
      }
      this.data.boxPrice.count = (this.data.boxPrice.count * 1.3).toFixed(2);
      wx.hideLoading()//隐藏正在加载
      wx.navigateTo({
        url: '../baojia/baojiaMsg?price=' + this.data.boxPrice.count
      })
    })
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