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
    paperWeights:["100g","128g","157g"],
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
    ispaper:true,
    isCardboard:true,
    isBCardboard:false,
    boxPrice: {
      count: 0, 
      process:0,
      topCardboard:0,
      bottomCardboard:0
    }
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
  ExpandTopLong:function(e){
    return Number(this.data.long)+this.data.height*2
  },
  ExpandTopWide:function(e){
    return Number(this.data.wide)+this.data.height*2
  },
  ExpandBottomLong: function (e) {
    //return Number(this.long) - Number(this.thick * 2) - this.bottomBack + Number(this.height - this.BottomThick) * 2;
    return Number(this.data.long * this.data.thicks[this.data.thicksIndex].id-2+(this.data.height-3)*2);
  },
  ExpandBottomWide: function (e) {
    //return Number(this.wide)-Number(this.thick*2)-this.bottomBack+Number(this.height-this.BottomThick)*2;
    return Number(this.data.wide - this.data.thicks[this.data.thicksIndex].id * 2 - 3 + (this.data.height - 3) * 2);
  },
  bindPapersChange: function (e) {
    this.setData({
      papersIndex: e.detail.value
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
  CountPrice:function(e){
    js_CountPrice.ProcessPromise('天地盖1(小)', this.data.quantitys[this.data.quantity]).then(value => {
      this.setData({
        'boxPrice.process':value.toFixed(2)
      });
    }).then(()=>{//盖-纸板
      if (this.data.isCardboard){
        return js_CountPrice.CardboardPromise(this.ExpandTopLong(), this.ExpandTopWide(), this.data.cardboards[this.data.cardboardsIndex], this.data.thicks[this.data.thicksIndex].id, true).then(value => {
          this.setData({
            'boxPrice.topCardboard':value.toFixed(2)
          });
        }).then(()=>{//底-纸板
          console.log(this.ExpandBottomLong());
          return js_CountPrice.CardboardPromise(this.ExpandBottomLong(), this.ExpandBottomWide(), this.data.cardboards[this.data.bottomCardboardsIndex], this.data.thicks[this.data.bottomThicksIndex].id, true).then(value => {
            this.setData({
              'boxPrice.bottomCardboard': value.toFixed(2)
            });
          })
        });
      }
    }).then(() => {//最后步骤计算总价
      this.setData({//初始化count值
        'boxPrice.count': 0
      });
      for (var i in this.data.boxPrice) {
        this.data.boxPrice.count += i == "count" ? 0 : Number(this.data.boxPrice[i]);
      }
      this.data.boxPrice.count = (this.data.boxPrice.count * 1.3).toFixed(2);
      wx.navigateTo({
        url: 'baojiaMsg?price='+this.data.boxPrice.count
      })
    })
  }
});

