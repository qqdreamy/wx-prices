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
  // 封套自设纸价格
  paperPriceInput: function (e) {
    this.setData({
      paperPrice: e.detail.value
    })
  },
  // 内盒自设纸价格
  innerPaperPriceInput:function(e){
    this.setData({
      innerPaperPrice: e.detail.value
    })
  },
  // 数量选择
  quantityChange: function (e) {
    this.setData({
      quantity: e.detail.value
    })
  },
  // 内盒纸张选择
  bindInnerPapersChange: function (e) {
    this.setData({
      innerPapersIndex: e.detail.value
    })
  },
  // 内盒克重选择
  bindInnerPaperWeightsChange: function (e) {
    this.setData({
      innerPaperWeightsIndex: e.detail.value
    })
  },
  // 内盒印刷选择
  innerPrintChange: function (e) {
    this.setData({
      innerPrintIndex: e.detail.value
    })
  },
  // 内盒覆膜选择
  innerFilmChange: function (e) {
    this.setData({
      innerFilm: e.detail.value
    })
  },
  // 内盒烫金选择
  innerPermedChange: function (e) {
    this.setData({
      innerPermed: e.detail.value
    })
  },
  // 封套烫金选择
  permedChange: function (e) {
    this.setData({
      permed: e.detail.value
    })
  },
  // 封套纸张选择
  bindPapersChange: function (e) {
    this.setData({
      papersIndex: e.detail.value
    })
  },
  // 封套克重选择
  bindPaperWeightsChange: function (e) {
    this.setData({
      paperWeightsIndex: e.detail.value
    })
  },
  // 封套印刷选择
  printChange: function (e) {
    this.setData({
      print: e.detail.value
    })
  },
  // 封套覆膜选择
  filmChange: function (e) {
    this.setData({
      film: e.detail.value
    })
  },
  // 封套展开尺寸long
  EnvelopeExpandLong: function (e) {
    return Number(this.data.wide * 2 + this.data.height * 2 + 20 + 20);
  },
  // 封套展开尺寸wide
  EnvelopeExpandWide: function (e) {
    return Number(this.data.long + 20);
  },
  // 内盒展开尺寸long
  InnerExpandLong:function(e){
    return Number(this.data.height*4+this.data.long);
  },
  // 内盒展开尺寸wide
  InnerExpandWide:function(e){
    return Number(this.data.height*4+this.data.wide+20+30);
  },
  // @显示loading,并禁用报价按钮
  showloading: function () {
    // 弹出loading
    wx.showLoading({
      title: '正在计算ing',
    })
    // 禁用报价按钮
    this.setData({
      loading: true
    })
  },
  // @计算价格
  CountPrice: function (e) {
    this.showloading();
    let quantitys = this.data.quantitys[this.data.quantity];
    // 封套+内盒 卡合费用
    js_CountPrice.getPrices().then(() => {
      let temp =js_CountPrice.KaHePromise(this.EnvelopeExpandLong(), this.EnvelopeExpandWide(), quantitys)
      this.data.boxPrice.process=(temp*2).toFixed(2);
      // 封套-纸张
      if (this.data.papersIndex == 3){// 自设纸计算
        this.data.boxPrice.envelopePaper = js_CountPrice.ColorSurfacePromise(this.EnvelopeExpandLong(), this.EnvelopeExpandWide(), '', '', this.data.paperPrice).toFixed(2)
      }else{ // 非自设纸价格
        this.data.boxPrice.envelopePaper = js_CountPrice.ColorSurfacePromise(this.EnvelopeExpandLong(), this.EnvelopeExpandWide(), this.data.papers[this.data.papersIndex], this.data.paperWeights[this.data.paperWeightsIndex].id)
      }
      // 封套-覆膜
      this.data.boxPrice.film =js_CountPrice.FilmPromise(this.EnvelopeExpandLong(), this.EnvelopeExpandWide(), quantitys);
      // 封套-印刷
      this.data.boxPrice.print = js_CountPrice.PrintPromise(this.EnvelopeExpandLong(), this.EnvelopeExpandWide(), quantitys, this.data.print);
      // 封套-烫金
      if(this.data.permed){
        this.data.boxPrice.permed=js_CountPrice.PermedPromise('1',quantitys);
      }
      // 内盒纸张
      if (this.data.innerPapersIndex == 3) {
        this.data.boxPrice.innerPaper = js_CountPrice.ColorSurfacePromise(this.InnerExpandLong(), this.InnerExpandWide(), '', '', this.data.innerPaperPrice).toFixed(2);
      }else{
        this.data.boxPrice.innerPaper =js_CountPrice.ColorSurfacePromise(this.InnerExpandLong(), this.InnerExpandWide(), this.data.papers[this.data.innerPapersIndex], this.data.paperWeights[this.data.innerPaperWeightsIndex].id)
      }
      // 内盒印刷
      if (this.data.innerPrintIndex != 3) {
        this.data.boxPrice.innerPrint = js_CountPrice.PrintPromise(this.InnerExpandLong(), this.InnerExpandWide(), quantitys, this.data.innerPrint);
      }
      // 内盒覆膜
      if (this.data.innerFilm) {
        this.data.boxPrice.innerFilm = js_CountPrice.FilmPromise(this.InnerExpandLong(), this.InnerExpandWide(), this.data.quantitys[this.data.quantity]);
      }
      // 内盒烫金
      if (this.data.innerPermed) {
        this.data.boxPrice.innerPermed = js_CountPrice.PermedPromise('1', this.data.quantitys[this.data.quantity]);
           value.toFixed(2);
      }
    }).then(() => {//最后步骤计算总价
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
    // 清空上次报价数据
    for (var i in this.data.boxPrice) {
      this.data.boxPrice[i] = 0;
    }
    // 启用报价按钮
    this.setData({
      loading: false
    })
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