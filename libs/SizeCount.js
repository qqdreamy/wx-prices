module.exports.KbCountBig = function (type, c, k) {
  //0为正度，1为大度,默认为正度
  var zc = 1092;
  var zk = 787;
  if (type == 1) {
    zc = 1194;
    zk = 889;
  } else {
    zc = 1092;
    zk = 787
  }
  //需计算的长宽高
  var c = Number(c);
  var k = Number(k);
  //最终开别结果
  var kbEnd1;
  var kbEnd2;
  if (c >= k) {//测试数据250 220
    var kb1 = parseInt(zc / c);//4
    var kb2 = parseInt(zk / k);//4
    var sy1 = (zc % c);//194
    var ssy1 = (zk % k);//9
    var kb3 = parseInt(sy1 / k);//0
    var sy2;
    var path;
    var ssy2;
    if (kb3 >= 1) {
      sy2 = parseInt(zk / c);
      kbEnd1 = kb1 * kb2 + sy2 * kb3;
    } else {
      //增加新算法，需测试
      if (ssy1 + k > c) {
        kb2 = kb2 - 1;
        ssy2 = parseInt(zc / k);
        sy2 = 1;
        kb3 = ssy2;
        kbEnd1 = kb1 * kb2 + ssy2;
        path = 'top';
      } else {
        kbEnd1 = kb1 * kb2
      }
    }
    var kb4 = parseInt(zc / k);
    var kb5 = parseInt(zk / c);
    var sy4 = zk % c;
    var kb6 = parseInt(sy4 / k);
    var sy5;
    if (kb6 >= 1) {
      sy5 = parseInt(zc / c);
      kbEnd2 = kb4 * kb5 + sy5 * kb6;
    }
    else {
      kbEnd2 = kb4 * kb5;
    }
  } else {
    var kb1 = parseInt(zc / c);//3
    var kb2 = parseInt(zk / k);//3
    var sy1 = (zk % k);//103
    var kb3 = parseInt(sy1 / c);//1
    var sy2;
    if (kb3 >= 1) {
      sy2 = parseInt(zc / k);
      kbEnd1 = kb1 * kb2 + sy2 * kb3;
    } else {
      kbEnd1 = kb1 * kb2
    }
    var kb4 = parseInt(zc / k);
    var kb5 = parseInt(zk / c);
    var sy4 = zc % k;
    var kb6 = parseInt(sy4 / c);
    var sy5;
    if (kb6 >= 1) {
      sy5 = parseInt(zk / k);
      kbEnd2 = kb4 * kb5 + sy5 * kb6;
    }
    else {
      kbEnd2 = kb4 * kb5;
    }
  }
  var kb = new Object();
  if (kbEnd1 >= kbEnd2) {
    kb.type = 1;
    kb.count = kbEnd1;
    kb.kb1 = kb1;
    kb.kb2 = kb2;
    kb.sy2 = sy2;
    kb.kb3 = kb3;
    kb.path = path;
  } else {
    kb.type = 2
    kb.count = kbEnd2;
    kb.kb4 = kb4;
    kb.kb5 = kb5;
    kb.sy5 = sy5;
    kb.kb6 = kb6;
  }
  return kb;
}
//计算绸布,返回实际需要米数
module.exports.drapery = function (long, wide, quantity) {//长、宽、数量
  const draperyWide = 1500;//宽幅常量
  if (draperyWide % long > draperyWide % wide) {
    let t = draperyWide / wide;
    return quantity / t * long / 1000;
  } else {
    let t = draperyWide / long;
    return quantity / t * wide / 1000;
  }
}
//计算纸箱
module.exports.carton = function (clong, cwide, cheight, long, wide, height) {
  /*const clong=530;
  const cwide=480;
  const cheight=330;
  let long=231;
  let wide=220;
  let height=40;*/
  let mlong = clong % long;
  let mwide = clong % wide;
  let mheight = clong % height;
  let re;
  if (mlong > mwide) {
    let a = parseInt(clong / wide);
    let b = parseInt(cwide / long);
    let c = parseInt(cheight / height);
    re = a * b * c;
  } else {
    let a = parseInt(clong / long);
    let b = parseInt(cwide / wide);
    let c = parseInt(cheight / height);
    re = a * b * c;
  }
  let mmwide = cwide % long;
  let ree;
  if (mlong > mmwide && cheight > height) {
    let a = parseInt(clong / height);
    let b = parseInt(cwide / long);
    let c = parseInt(cheight / wide);
    ree = a * b * c;
  } else {
    let a = parseInt(clong / long);
    let b = parseInt(cwide / height);
    let c = parseInt(cheight / wide);
    ree = a * b * c;
  }
  return re > ree ? re : ree;
}