var js_CountPrice = require('../../libs/CountPrice.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["天地盖-盖到底", "天地盖-盖底不同", "围框天地盖"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    papers: ["铜版纸", "特种纸", "牛皮纸","自设纸"],
    cardboards:["双灰板","裱白板","双面滑"],
    thicks:[
      {id:1.5,name:'1.5mm'},
      {id:2, name: '2.0mm'},
      {id:2.5, name: '2.5mm' },
      {id:3, name: '3.0mm' }
      ],
    thicksIndex:1,
    bottomThicksIndex:1,
    cardboardsIndex:0,
    bottomCardboardsIndex:0,
    papersIndex: 0,
    paperWeights: [{ id: 128, name: '128g' }, { id: 157, name: '157g' }],
    paperWeightsIndex:0,
    prints: ["四色","单色","专色","无需印刷"],
    print:0,
    quantitys: ["100", "500", "1000", "2000"],
    quantity:2,
    techniques: ["V槽", "半断"],
    technique:0,
    long:100,
    wide:100,
    height:50,
    curling:15,
    topFilm:true,
    ispaper:true,
    isCardboard:true,
    isBCardboard:true,
    boxPrice: {
      count: 0, 
      process:0,
      topPaper:0,
      bottomPaper:0,
      topCardboard:0,
      topPrint:0,
      topFilm:0,
      bottomCardboard:0
    }
  },
  onShow:function(){
    // 重新显示界面-启用报价按钮
    this.setData({
      loading: false
    })
  },
  onLoad: function () {
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
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // 纸板盖盒-展开长
  ExpandTopLong:function(e){
    return Number(this.data.long)+this.data.height*2
  },
  // 纸板盖盒-展开宽
  ExpandTopWide:function(e){
    return Number(this.data.wide)+this.data.height*2
  },
  // 纸板底盒-展开长
  ExpandBottomLong: function (e) {
    return Number(this.data.long * this.data.thicks[this.data.thicksIndex].id-2+(this.data.height-3)*2);
  },
  // 纸板底盒-展开宽
  ExpandBottomWide: function (e) {
    return Number(this.data.wide - this.data.thicks[this.data.thicksIndex].id * 2 - 3 + (this.data.height - 3) * 2);
  },
  // 包纸盖-展开长
  ExpandTopColorsurfaceLong:function(e){
    return Number(Number(this.data.long) + Number(this.data.height * 2) + Number(this.data.thicks[this.data.thicksIndex].id * 2 + this.data.curling * 2 + 1));
  },
  // 包纸盖-展开宽
  ExpandTopColorsurfaceWide:function(e){
    return Number(Number(this.data.wide) + Number(this.data.height * 2) + Number(this.data.thicks[this.data.thicksIndex].id * 2 + this.data.curling * 2 + 1));
  },
  bindPapersChange: function (e) {
    this.setData({
      papersIndex: e.detail.value
    })
  },
  topFilmChange:function(e){
    this.setData({
      topFilm:e.detail.value
    })
  },
  bindPaperWeightsChange:function(e){
    this.setData({
      paperWeightsIndex: e.detail.value
    })
  },
  switch1Change: function (e) {
    this.setData({
      ispaper: e.detail.value
    })
  },
  quantityChange:function(e){
    this.setData({
      quantity: e.detail.value
    })
  },
  techniqueChange:function(e){
    this.setData({
      technique: e.detail.value
    })
  },
  printChange:function(e){
    this.setData({
      print: e.detail.value
    })
  },
  isCardboardChange:function(e){
    this.setData({
      isCardboard:e.detail.value
    })
  },
  isBCardboardChange:function(e){
    this.setData({
      isBCardboard: e.detail.value
    })
  },
  bottomCardboardsChange:function(e){
    this.setData({
      bottomCardboardsIndex: e.detail.value
    })
  },
  cardboardsChange:function(e){
    this.setData({
      cardboardsIndex: e.detail.value
    })
  },
  bottomThicksChange:function(e){
    this.setData({
      bottomThicksIndex: e.detail.value
    })
  },
  thicksChange:function(e){
    this.setData({
      thicksIndex: e.detail.value
    })
  },
  longInput:function(e){
    this.setData({
      long: e.detail.value
    })
  },
  wideInput:function(e){
    this.setData({
      wide: e.detail.value
    })
  },
  heightInput: function (e) {
    this.setData({
      height: e.detail.value
    })
  },
  isCurlingBottom:function(e){
    if (e.detail.value){
      this.setData({
        curling:this.data.long
      })
    }else{
      this.setData({
        curling:15
      })
    }
  },
  // @清空数据
  clearPrice: function () {
    for (var i in this.data.boxPrice) {
      this.data.boxPrice[i] = 0;
    }
  },
  // @计算价格
  CountPrice: function (e) {
    // 计算之前清空数据
    this.clearPrice()
    this.setData({
      loading: true
    })
    // 弹出loading
    wx.showLoading({
      title: '正在计算ing',
      mask:true
    })
    // 数量
    let quantitys=this.data.quantitys[this.data.quantity];
    // 根据尺寸来计算礼盒尺寸
    let boxName = this.long < 250 ? '天地盖1(小)' : this.long > 350 ? '天地盖1(大)' : '天地盖1(中)';
    // 
    js_CountPrice.getPrices().then(()=>{
    }).then(()=>{
      // 盖纸板报价
      if (this.data.isCardboard){
          this.data.boxPrice.topCardboard = js_CountPrice.CardboardPromise(this.ExpandTopLong(), this.ExpandTopWide(), this.data.cardboards[this.data.cardboardsIndex], this.data.thicks[this.data.thicksIndex].id, true);
          // 底纸板是否同盖纸板要求
        if (!this.data.isBCardboard){
          this.data.boxPrice.bottomCardboard = js_CountPrice.CardboardPromise(this.ExpandBottomLong(), this.ExpandBottomWide(), this.data.cardboards[this.data.bottomCardboardsIndex], this.data.thicks[this.data.bottomThicksIndex].id, true);
        }
      }
      // 礼盒加工费
      this.data.boxPrice.process = js_CountPrice.ProcessPromise(boxName, quantitys);
      if (this.data.ispaper){
        // 盖-包纸报价
        this.data.boxPrice.topPaper = js_CountPrice.ColorSurfacePromise(this.ExpandTopColorsurfaceLong(), this.ExpandTopColorsurfaceWide(), this.data.papers[this.data.papersIndex], this.data.paperWeights[this.data.paperWeightsIndex].id)*2;
        if(this.data.print!=3){
          // 盖-印刷报价
          this.data.boxPrice.topPrint = js_CountPrice.PrintPromise(this.ExpandTopColorsurfaceLong(), this.ExpandTopColorsurfaceWide(), quantitys, this.data.print);
        }
        if(this.data.topFilm){
          // 盖-覆膜价格计算
          this.data.boxPrice.topFilm = js_CountPrice.FilmPromise(this.ExpandTopColorsurfaceLong(), this.ExpandTopColorsurfaceWide(), quantitys);
        }
      }
    }).then(() => {
      // @最后步骤计算总价
      // 初始化count值
      this.setData({
        'boxPrice.count': 0
      });
      for (var i in this.data.boxPrice) {
        this.data.boxPrice.count += i == "count" ? 0 : Number(this.data.boxPrice[i]);
      }
      this.data.boxPrice.count = (this.data.boxPrice.count * 1.3).toFixed(2);
      wx.navigateTo({
        url: '../baojia/baojiaMsg?price=' + this.data.boxPrice.count,
        complete: function(){
          //隐藏正在加载
          wx.hideLoading()
        }
      })
    })
  }
});

