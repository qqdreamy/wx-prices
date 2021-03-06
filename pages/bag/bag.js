// pages/bag/bag.js
const js_CountPrice = require('../../libs/CountPrice.js');

let app = getApp();
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
    prints: ["四色印刷", "单色印刷", "专色印刷", "无需印刷"],
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
      film: 0,
      rope: 0
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
  // @自设纸价格
  paperPriceInput: function (e) {
    this.setData({
      paperPrice: e.detail.value
    })
  },
  // @数量选择
  quantityChange: function (e) {
    this.setData({
      quantity: e.detail.value
    })
  },
  // @纸张选择
  bindPapersChange: function (e) {
    this.setData({
      papersIndex: e.detail.value
    })
  },
  // @克重选择
  bindPaperWeightsChange: function (e) {
    this.setData({
      paperWeightsIndex: e.detail.value
    })
  },
  // @印刷选择
  printChange: function (e) {
    this.setData({
      print: e.detail.value
    })
  },
  // @覆膜选择
  filmChange: function (e) {
    this.setData({
      film: e.detail.value
    })
  },
  // @烫金选择
  permedChange:function(e){
    this.setData({
      permed:e.detail.value
    })
  },
  // @计算手提袋展开尺寸
  ExpandLong: function (e) { 
    // 最大单粘尺寸
    const MaxLog = 930;
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
  // @计算手提袋展开尺寸
  ExpandWide: function (e) {
    return Number(this.data.height) + 40 + (this.data.wide / 2 + 15);
  },
  // @显示loading,并禁用报价按钮
  showloading: function () {
    // 弹出loading
    wx.showLoading({
      title: '正在计算中',
    })
    // 禁用报价按钮
    this.setData({
      loading: true
    })
  },
  // @报价计算
  CountPrice: function (e) {
    // 已验证手机号码用户才可以进行报价
    if (app.globalData.userInfo.mobilePhoneVerified){
      // 显示loading,并禁用报价按钮
      this.showloading()
      let quantitys = this.data.quantitys[this.data.quantity];
      // 构建一个对象用于传递参数
      let priceList = {};
      priceList.name="手提袋"
      priceList.quantitys=quantitys;
      // 用于写入工艺
      priceList.technology =this.data.paperWeights[this.data.paperWeightsIndex].name + this.data.papers[this.data.papersIndex];
      priceList.technology += this.data.prints[this.data.print];
      js_CountPrice.getPrices().then(() => {
        // 获取卡合价格
        let kahe=js_CountPrice.KaHePromise(this.ExpandLong(), this.ExpandWide(), quantitys);
        // 获取加工费
        this.data.boxPrice.process=js_CountPrice.ProcessPromise('手提袋' + this.data.bagType, quantitys)+kahe;
        // 纸张价格
        let pPaper // 用于纸张价格计算
        if (this.data.papersIndex == 3){// 自设纸判断
          pPaper=this.data.boxPrice.paper = js_CountPrice.ColorSurfacePromise(this.ExpandLong(), this.ExpandWide(), this.data.papers[this.data.papersIndex], this.data.paperWeights[this.data.paperWeightsIndex].id, this.data.paperPrice)
        }else{// 非自设纸
          pPaper=js_CountPrice.ColorSurfacePromise(this.ExpandLong(), this.ExpandWide(), this.data.papers[this.data.papersIndex], this.data.paperWeights[this.data.paperWeightsIndex].id)
        }
        // 根据单粘/双粘计算纸张价格
        if (this.data.bagType == 2) {
          this.data.boxPrice.paper = (pPaper * 2).toFixed(2);
        } else {
          this.data.boxPrice.paper = pPaper.toFixed(2);
        }
        // 印刷费用
        if(this.data.print != 3){
          let p=js_CountPrice.PrintPromise(this.ExpandLong(), this.ExpandWide(), quantitys, this.data.print);
          if (this.data.bagType == 2) {
            this.data.boxPrice.print = (p * 2).toFixed(2);
          } else {
            this.data.boxPrice.print = p.toFixed(2);
          }
        }
        // 覆膜费用
        if(this.data.film){
          let p=js_CountPrice.FilmPromise(this.ExpandLong(), this.ExpandWide(), quantitys);
          // 
          priceList.technology+="覆膜";
          if (this.data.bagType == 2) {
            this.data.boxPrice.film = (p * 2).toFixed(2);
          } else {
            this.data.boxPrice.film = p.toFixed(2);
          }
        }
        // 烫金费用
        if(this.data.permed){
          priceList.technology+="烫金";
          this.data.boxPrice.permed=js_CountPrice.PermedPromise('1', quantitys);
        }
        // 提绳
        this.data.boxPrice.rope=js_CountPrice.RopePromise(this.data.ropes[this.data.ropesIndex]);
        priceList.technology += this.data.ropes[this.data.ropesIndex];
      }).then(() => {// 最后步骤计算总价
        // 初始化count值
        this.setData({
          'boxPrice.count': 0
        });
        for (var i in this.data.boxPrice) {
          this.data.boxPrice.count += i == "count" ? 0 : Number(this.data.boxPrice[i]);
        }
        this.data.boxPrice.count = (this.data.boxPrice.count * 1.3).toFixed(2);
        // 将报价信息加入leancloud
        priceList.size=this.data.long+ "*"+this.data.wide+"*"+this.data.height;
        //priceList.paper = this.data.paperWeights[this.data.paperWeightsIndex].name + this.data.papers[this.data.papersIndex];
        //js_CountPrice.savePriceList("手提袋",size,quantitys,paper,technology,this.data.boxPrice.count);
        // 隐藏正在加载提示框
        wx.hideLoading()
        wx.navigateTo({
          url: '../baojia/baojiaMsg?price=' + this.data.boxPrice.count + "&priceList=" + JSON.stringify(priceList)
        })
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '您未绑定手机号码无法获得详细报价',
        confirmText: '去绑定',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../bindPhone/bindPhone',
            })
          }
        }
      })
    }
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