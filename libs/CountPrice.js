const AV = require('./av-weapp-min.js');
const SizeCount=require('./SizeCount.js');
// LeanCloud 应用的 ID 和 Key
AV.init({
  appId: 'cjtOItWI6rsyCzjvJCh9iSMH-gzGzoHsz',
  appKey: '5uIGW67Gq2wbEnLaD7IlVUHu',
});
const mythick = {
  '2': 1150,
  '1.5': 850,
  '2.5': 1450,
  '3': 1750
}
//拼板算法
module.exports.MakeUp = function (long, wide, quantity) {
  let printQuantity = quantity;
  if (Math.floor(590 / (long + 6)) >= Math.floor(440 / (wide + 6)) && Math.floor(590 / (long + 6)) != 0) {//4K尺寸可拼多个进行拼板算法
    printQuantity = quantity / (Math.floor(440 / (wide + 6)) * Math.floor(590 / (long + 6)));
  } else if (long < 590) {
    printQuantity = quantity / Math.floor(590 / (long + 6));
  }
  return printQuantity;
}
//印刷费
//2017-02-17加入拼板算法
module.exports.PrintPromise = function (clong, cwide, quantity, pType) {
  return new Promise((resolve, reject) => {
    let query = new AV.Query('Prints');
    let long = Number(clong);
    let wide = Number(cwide);
    query.select(['price', 'addPrice']);
    console.log(long);
    console.log(wide);
    let printQuantity = this.MakeUp(long, wide, quantity);
    console.log('printQuantity:' + printQuantity);
    let printKB = long > 870 ? '全开' : long > 580 ? '对开' : '四开';
    let pName = pType == 0 ? '四色印刷' : pType == 2 ? '专色印刷' : '单色印刷';
    query.startsWith('name', pName + '-' + printKB);
    query.first().then(results => {
      let p = results.get('price');
      let addPrice = results.get('addPrice');
      p = Number(p) + Number(printQuantity - 1000 > 0 ? addPrice * (printQuantity - 1000) : 0);
      resolve(p / quantity);
    })
  })
}
//计算加工费
module.exports.ProcessPromise = function (name, quantity) {
  return new Promise(function (resolve, reject) {
    let query = new AV.Query('Process');
    query.select([quantity, 'startPrice']);
    query.startsWith('name', name);
    query.first().then(results => {
      resolve(results.get(quantity) == "undefined" ? results.get('startPrice') : results.get(quantity));
    }).catch(error => {
      console.log(error);
    })
  })
}
//瓦楞片(内托)
module.exports.CorrugatedPromise = function (long, wide, name) {
  return new Promise(function (resolve, reject) {
    let query = new AV.Query('CopperplatePapers');
    query.select(['price']);
    query.startsWith('name', '瓦楞片');
    query.first().then(results => {
      let Square = (long / 1000) * (wide / 1000);
      let price = results.get('price');
      resolve(Square * price);
    })
  })
}
//三层瓦楞直接印刷
module.exports.ThreeCorrugated = function (long, wide, name) {
  return new Promise(function (resolve, reject) {
    let query = new AV.Query('FinishPrints');
    query.select(['price']);
    query.startsWith('name', name);
    query.first().then(results => {
      let Square = (long / 1000) * (wide / 1000);
      let price = results.get('price');
      resolve(Square * price);
    })
  })
}
//裱3层瓦楞
module.exports.CorrugatedMount = function (long, wide, name) {
  return new Promise(function (resolve, reject) {
    let query = new AV.Query('FinishPrints');
    query.select(['price']);
    query.startsWith('name', name);
    query.first().then(results => {
      let Square = (long / 1000) * (wide / 1000);
      let price = results.get('price');
      resolve(Square * price);
    })
  })
}
//珍珠棉/PE等按立方计算的价格类
module.exports.EPE = function (long, wide, height, name) {
  return new Promise(function (resolve, reject) {
    let query = new AV.Query('CopperplatePapers');
    query.select(['price']);
    query.startsWith('name', name);
    query.first().then(results => {
      let Cube = (long / 1000) * (wide / 1000) * (height / 1000);
      let price = results.get('price');
      resolve(Cube * price);
    })
  })
}
//绸布
module.exports.DraperyPromise = function (long, wide, quantity, type) {
  return new Promise(function (resolve, reject) {
    let query = new AV.Query('CopperplatePapers');
    query.select(['price']);
    query.startsWith('name', type);
    query.first().then(results => {
      let metric = SizeCount.drapery(long, wide, quantity);
      let price = results.get('price');
      resolve(metric * price / quantity);
    })
  })
}
module.exports.CardboardPromise = function (long, wide, CardboardName, thick, cutt) {
  //厚度转换
  let mthick;
  for (let i in mythick) {
    if (thick == i) {
      mthick = mythick[i];
      break;
    }
  }
  //是否含切纸费
  let cuttPrice = 0;
  if (typeof (cutt) != "undefined" && cutt) {
    //屏蔽切纸费，直接加入纸板价格中
    //let boxJson=require("../json/cutt.json");
    //let kb=SizeCount.KbCountBig(1,long,wide).count;
    //let kbName=kb>25 ? '49k' : kb>10 ? '24k' : kb>5 ? '9k' : kb>2 ? '4k' : '9k';
    //cuttPrice=boxJson[thick][kbName];
  }
  return new Promise(function (resolve, reject) {
    let query = new AV.Query('Cardboards');
    query.select(['Name', 'Price']);
    query.startsWith('Name', CardboardName);
    let dKB = SizeCount.KbCountBig(1, long, wide).count;
    let zKB = SizeCount.KbCountBig(0, long, wide).count;
    query.first().then(results => {
      let tonPrice = results.get('Price');
      let zPrice = (tonPrice / 2327 * mthick / 500) + cuttPrice;//计算单张价格
      let dPrice = (tonPrice / 1884 * mthick / 500) + cuttPrice;
      resolve((dPrice / dKB > zPrice / zKB ? zPrice / zKB : dPrice / dKB));
    })
  });
}
//计算纸板价格-公式2//返回纸板总价-方便核对纸板开料价格
module.exports.CheckCardboard = function (long, wide, tonPrice, thick, quantity, cutt) {
  //厚度转换
  let mthick;
  for (let i in mythick) {
    if (thick == i) {
      mthick = mythick[i];
      break;
    }
  }
  let Price = new Object();
  //是否含切纸费
  let cuttPrice = 0;
  if (typeof (cutt) != "undefined" && cutt) {
    /*let boxJson=require("../json/cutt.json");
    let kb=SizeCount.KbCountBig(1,long,wide).count;
    let kbName=kb>25 ? '49k' : kb>10 ? '24k' : kb>5 ? '9k' : kb>2 ? '4k' : '9k';
    cuttPrice=boxJson[thick][kbName];*/
  }
  let dKB = SizeCount.KbCountBig(1, long, wide).count;
  let zKB = SizeCount.KbCountBig(0, long, wide).count;
  var zPrice = (tonPrice / 2327 * mthick / 500) + cuttPrice;//计算单张价格
  var dPrice = (tonPrice / 1884 * mthick / 500) + cuttPrice;
  console.log('zPrice' + zPrice);
  console.log('dPrice' + dPrice)
  Price.z = Math.ceil(quantity / zKB) * zPrice;
  Price.d = Math.ceil(quantity / dKB) * dPrice;
  return Price;
}
//计算包纸
module.exports.ColorSurfacePromise = function (long, wide, paper, paperWeight, price) {
  let dKB = SizeCount.KbCountBig(1, long, wide).count;
  let zKB = SizeCount.KbCountBig(0, long, wide).count;
  if (typeof (price) != "undefined" && price != 0) {
    //console.log(price / zKB);
    return price / zKB;
  } else {
    return new Promise(function (resolve, reject) {
      let query = new AV.Query('CopperplatePapers');
      query.select(['price']);
      query.startsWith('name', paper);
      query.first().then(results => {
        let tonPrice = results.get('price');
        let zPrice = (tonPrice / 2327 * paperWeight / 500);//计算单张价格
        let dPrice = (tonPrice / 1884 * paperWeight / 500);
        resolve((dPrice / dKB > zPrice / zKB ? zPrice / zKB : dPrice / dKB));
      })
    }).catch(() => {

    })
  }
}
//卡合
module.exports.KaHePromise = function (clong, cwide, quantity) {
  return new Promise((resolve, reject) => {
    let query = new AV.Query('FinishPrints');
    let long = Number(clong);
    let wide = Number(cwide);
    query.select(['price', 'addPrice']);
    query.startsWith('name', '卡合');
    let printQuantity = this.MakeUp(long, wide, quantity);
    console.log(printQuantity);
    console.log('test' + printQuantity);
    query.first().then(results => {
      let p = results.get('price');
      let addPrice = results.get('addPrice');
      p = p + Number(printQuantity - 1000 > 0 ? addPrice * (printQuantity - 1000) : 0);
      resolve(p / quantity);
    })
  })
}
//粘盒
module.exports.StickyBox = function (quantity) {
  return new Promise((resolve, reject) => {
    let query = new AV.Query('FinishPrints');
    query.select(['price', 'addPrice']);
    query.startsWith('name', '粘盒');
    query.first().then(results => {
      let addPrice = results.get('addPrice');
      let price = results.get('price');
      resolve(quantity * addPrice > price ? quantity * addPrice : price / quantity);
    })
  })
}
//覆膜
module.exports.FilmPromise = function (long, wide, quantity) {
  return new Promise((resolve, reject) => {
    let query = new AV.Query('FinishPrints');
    query.select(['price', 'addPrice']);
    query.startsWith('name', '覆膜');
    query.first().then(results => {
      let Square = long / 1000 * wide / 1000;
      let addPrice = results.get('addPrice');
      let price = results.get('price');
      resolve(Square * addPrice * quantity > price ? Square * addPrice : price / quantity);
    });
  });
}
//切纸费
module.exports.cutt = function (long, wide, thick) {
  /*let boxJson=require("../json/cutt.json");
  let kb=SizeCount.KbCountBig(1,long,wide).count;
  let kbName=kb>25 ? '49k' : kb>10 ? '24k' : kb>5 ? '9k' : kb>2 ? '4k' : '9k';
  return boxJson[thick][kbName];*/
}
//纸箱价格
module.exports.Carton = function (long, wide, height) {
  const clong = 530;
  const cwide = 480;
  const cheight = 330;
  const p = 7;
  return p / SizeCount.carton(clong, cwide, cheight, long, wide, height);
}
//烫金
module.exports.PermedPromise = function (type, quantity) {
  return new Promise((resolve, reject) => {
    let query = new AV.Query('FinishPrints');
    query.select(['price', 'addPrice']);
    query.startsWith('name', '烫金');
    query.first().then(results => {
      let p = results.get('price');
      let addPrice = results.get('addPrice');
      p = p + Number(quantity - 1000 > 0 ? addPrice * (quantity - 1000) : 0);
      resolve(p / quantity * type);
    })
  });
}
//提绳
module.exports.RopePromise = function (type) {
  return new Promise((resolve, reject) => {
    let query = new AV.Query('ropes');
    query.select(['price']);
    //console.log(type);
    query.startsWith('name', type);
    query.first().then(results => {
      resolve(results.get('price'));
    })
  })
}
//UV
module.exports.UVPromise = function (long, wide, quantity) {
  return new Promise((resolve, reject) => {
    let query = new AV.Query('FinishPrints');
    query.select(['price']);
    query.startsWith('name', 'UV');
    query.first().then(results => {
      let Square = (long / 1000) * (wide / 1000);
      let p = results.get('price');
      let addPrice = results.get('addPrice');
      let singlePrice = results.get('singlePrice');
      resolve(Square * addPrice * quantity > p ? Square * addPrice < singlePrice ? singlePrice : Square * addPrice : p / quantity);
    })
    /*ref.child('印后').once('value').then(snapshot=>{
      let boxJson=snapshot.val();
      let p=boxJson['UV'].price;
      let Square=long/1000*wide/1000;
      resolve(Square*boxJson['UV'].addPrice*quantity > boxJson['UV'].price ? Square*boxJson['UV'].addPrice<boxJson['UV'].singlePrice ? boxJson['UV'].singlePrice : Square*boxJson['UV'].addPrice : boxJson['UV'].price/quantity)
    })*/
  })
}