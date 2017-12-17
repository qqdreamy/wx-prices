const AV = require('../libs/av-weapp-min.js');
class PriceList extends AV.Object {
  // 盒型尺寸:长*宽*高
  get size() { return this.get('size'); }
  set size(value) { this.set('size', value); }
  // 数量
  get quantities() { return this.get('quantities'); }
  set quantities(value) { this.set('quantities', value); }
  // 工艺
  get technology() { return this.get('technology'); }
  set technology(value) { this.set('technology', value); } 
  // 价格
  get price() { return this.get('price'); }
  set price(value) { this.set('price', value); } 
}

AV.Object.register(PriceList, 'PriceList');
module.exports = PriceList;