// pages/ColorBox/DrawerBox.js
var js_CountPrice = require('../../libs/CountPrice.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["抽屉盒", "双插盒", "提手盒"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    long: 200,
    wide: 80,
    height: 50,
    quantitys: [500, 1000, 2000, 3000, 5000, 10000],
    quantity: 1,
    papers: ["白卡纸", "特种纸", "牛皮纸", "自设纸"],
    paperPrice:3,
    innerPaperPrice:3,
    papersIndex: 0,
    innerPapersIndex: 0,
    paperWeights: [{ id: 200, name: '200g' }, { id: 230, name: '230g' }, { id: 250, name: '250g' }, { id: 300, name: '300g' }],
    paperWeightsIndex: 2,
    innerPaperWeightsIndex: 2,
    prints: ["四色", "单色", "专色", "无需印刷"],
    print: 0,
    innerPrintIndex: 3,
    film: true,
    innerFilm: true,
    permed: false,
    innerPermed: false,
    boxPrice: {
      count: 0,
      innerPaper:0,
      innerPrint:0,
      innerFilm:0,
      innerPermed:0,
      envelopePaper:0,
      film:0,
      print:0,
      permed:0,
      process: 0
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
  paperPriceInput: function (e) {//封套自设纸价格
    this.setData({
      paperPrice: e.detail.value
    })
  },
  innerPaperPriceInput:function(e){//内盒自设纸价格
    this.setData({
      innerPaperPrice: e.detail.value
    })
  },
  //数量选择
  quantityChange: function (e) {
    this.setData({
      quantity: e.detail.value
    })
  },
  //内盒纸张选择
  bindInnerPapersChange: function (e) {
    this.setData({
      innerPapersIndex: e.detail.value
    })
  },
  //内盒克重选择
  bindInnerPaperWeightsChange: function (e) {
    this.setData({
      innerPaperWeightsIndex: e.detail.value
    })
  },
  //内盒印刷选择
  innerPrintChange: function (e) {
    this.setData({
      innerPrintIndex: e.detail.value
    })
  },
  //内盒覆膜选择
  innerFilmChange: function (e) {
    this.setData({
      innerFilm: e.detail.value
    })
  },
  //内盒烫金选择
  innerPermedChange: function (e) {
    this.setData({
      innerPermed: e.detail.value
    })
  },
  //封套烫金选择
  permedChange: function (e) {
    this.setData({
      permed: e.detail.value
    })
  },
  //封套纸张选择
  bindPapersChange: function (e) {
    this.setData({
      papersIndex: e.detail.value
    })
  },
  //封套克重选择
  bindPaperWeightsChange: function (e) {
    this.setData({
      paperWeightsIndex: e.detail.value
    })
  },
  //封套印刷选择
  printChange: function (e) {
    this.setData({
      print: e.detail.value
    })
  },
  //封套覆膜选择
  filmChange: function (e) {
    this.setData({
      film: e.detail.value
    })
  },
  //封套展开尺寸long
  EnvelopeExpandLong: function (e) {
    return Number(this.data.wide * 2 + this.data.height * 2 + 20 + 20);
  },
  //封套展开尺寸wide
  EnvelopeExpandWide: function (e) {
    return Number(this.data.long + 20);
  },
  //内盒展开尺寸long
  InnerExpandLong:function(e){
    return Number(this.data.height*4+this.data.long);
    //return Number(this.data.height*4+this.data.long+20+30);
  },
  //内盒展开尺寸wide
  InnerExpandWide:function(e){
    return Number(this.data.height*4+this.data.wide+20+30);
  },
  clearPrice: function () {//清空价格数据
    for (var i in this.data.boxPrice) {
      this.data.boxPrice[i] = 0;
    }
  },
  CountPrice: function (e) {
    this.clearPrice()//计算之前清空数据
    wx.showLoading({
      title: '正在计算ing',
    })
    //卡合费用
    js_CountPrice.KaHePromise(this.EnvelopeExpandLong(), this.EnvelopeExpandWide(), this.data.quantitys[this.data.quantity]).then(value => {
      this.data.boxPrice.process = (value * 2).toFixed(2);//*2封套内盒一起计算
    }).then(() => {//封套-纸张价格
      if (this.data.papersIndex == 3) {
        this.data.boxPrice.envelopePaper = js_CountPrice.ColorSurfacePromise(this.EnvelopeExpandLong(), this.EnvelopeExpandWide(), '', '', this.data.paperPrice).toFixed(2);
      } else {
        return js_CountPrice.ColorSurfacePromise(this.EnvelopeExpandLong(), this.EnvelopeExpandWide(), this.data.papers[this.data.papersIndex], this.data.paperWeights[this.data.paperWeightsIndex].id).then(value => {
          this.data.boxPrice.envelopePaper = value.toFixed(2);
        });
      }
    }).then(() => {//封套-覆膜
      if (this.data.film) {
        return js_CountPrice.FilmPromise(this.EnvelopeExpandLong(), this.EnvelopeExpandWide(), this.data.quantitys[this.data.quantity]).then(value => {
          this.data.boxPrice.film = value.toFixed(2);
        })
      }
    }).then(() => {//封套-印刷
      if (this.data.print != '4') {
        return js_CountPrice.PrintPromise(this.EnvelopeExpandLong(), this.EnvelopeExpandWide(), this.data.quantitys[this.data.quantity], this.data.print).then(value => {
          this.data.boxPrice.print = value.toFixed(2);
        })
      }
    }).then(() => {//封套-烫金工艺
      if (this.data.permed){
        return js_CountPrice.PermedPromise('1', this.data.quantitys[this.data.quantity]).then(value => {
          this.data.boxPrice.permed = value.toFixed(2);
        })
      }
    }).then(() => {//内盒-纸张
      if (this.data.innerPapersIndex == 3) {
        this.data.boxPrice.innerPaper = js_CountPrice.ColorSurfacePromise(this.InnerExpandLong(), this.InnerExpandWide(), '', '', this.data.innerPaperPrice).toFixed(2);
      } else {
        return js_CountPrice.ColorSurfacePromise(this.InnerExpandLong(), this.InnerExpandWide(), this.data.papers[this.data.innerPapersIndex], this.data.paperWeights[this.data.innerPaperWeightsIndex].id).then(value => {
          this.data.boxPrice.innerPaper = value.toFixed(2);
        });
      }
    }).then(() => {//内盒-印刷
      if (this.data.innerPrint != '4') {
        return js_CountPrice.PrintPromise(this.InnerExpandLong(), this.InnerExpandWide(), this.data.quantitys[this.data.quantity], this.data.innerPrint).then(value => {
          this.data.boxPrice.innerPrint = value.toFixed(2);
        })
      }
    }).then(() => {//内盒-覆膜
      if (this.data.innerFilm) {
        return js_CountPrice.FilmPromise(this.InnerExpandLong(), this.InnerExpandWide(), this.data.quantitys[this.data.quantity]).then(value => {
          this.data.boxPrice.innerFilm = value.toFixed(2);
        })
      }
    }).then(() => {//内盒-烫金
      if (this.data.innerPermed) {
        return js_CountPrice.PermedPromise('1', this.data.quantitys[this.data.quantity]).then(value => {
          this.data.boxPrice.innerPermed = value.toFixed(2);
        })
      }
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
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
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