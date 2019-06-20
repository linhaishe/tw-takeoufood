var loadAllItems = require('../src/items');
var loadPromotions =require('../src/promotions');

function bestCharge(selectedItems) {
  //获得客户挑选的商品信息
  var allItems;
  allItems = [];
  allItems = splitIt(selectedItems);

  //获取商品的基本信息
  var getItems = loadAllItems();
  var getItem = loadAllItems();
  //获取优惠商品
  var getCount = loadPromotions();

  //按照第一种方式优惠或者不优惠
  var count1 = countItByFirst(allItems, getItems);

  //按照第二种方式优惠
  var count2 = countItBySecond(allItems, getItems, getCount);

  var str;
  str = compareIt(count1, count2, allItems, getItem);
  return str;
}

//划分已经购买的名称和数量
// var numbers = [1, 2, 3, 4, 5];
// var length = numbers.length;
// for (var i = 0; i < length; i++) {
//   numbers[i] *= 2;
// }
// numbers is now [2, 4, 6, 8, 10]
function splitIt(selectedItems) {
  var temp = [];
  for (var i = 0; i < selectedItems.length; i++) {

    temp[i] = selectedItems[i].split("x");
    temp[i][0] = temp[i][0].replace(/(^\s*)|(\s*$)/g, "");
  }

  return temp;
}

//第一种优惠方式
function countItByFirst(allItems, getItems) {
  var sum = 0;
  for (var i = 0; i < allItems.length; i++) {
    for (var j = 0; j < getItems.length; j++) {
      if (allItems[i][0] === getItems[j].id) {
        sum += allItems[i][1] * getItems[j].price;
      }
    }
  }

  if (sum >= 30) {
    sum = sum - 6;
  }
  return sum;
}

//第二种优惠方式
function countItBySecond(allItems, getItems, getCount) {
  var sum = 0;

  for (var k = 0; k < getItems.length; k++) {
    for (var m = 0; m < getCount[1].items.length; m++) {
      if (getItems[k].id === getCount[1].items[m]) {
        getItems[k].price *= 1 / 2;
      }
    }
  }
  for (var i = 0; i < allItems.length; i++) {
    for (var j = 0; j < getItems.length; j++) {
      if (allItems[i][0] === getItems[j].id) {
        sum += allItems[i][1] * getItems[j].price;
      }
    }
  }

  return sum;
}

function compareIt(count1, count2, allItems, getItems) {

  var output = "============= 订餐明细 =============";

  //将整个购买数据输出
  for (var i = 0; i < allItems.length; i++)
    for (var j = 0; j < getItems.length; j++) {
      if (allItems[i][0] === getItems[j].id) {
        output += "\n" + getItems[j].name + " x" + allItems[i][1] + " = " + allItems[i][1] * getItems[j].price + "元";
      }
    }

  //判断优惠方式

  if (count1 === count2) {
    output += "\n" + "-----------------------------------" + "\n" + "总计：" + count1 + "元";

  }
  else if (count1 < count2) {
    output += "\n" + "-----------------------------------" + "\n" + "使用优惠:";
    output += "\n" + "满30减6元，省6元" + "\n" + "-----------------------------------" + "\n" + "总计：" + count1 + "元";
  }
  else {

    output += "\n" + "-----------------------------------" + "\n" + "使用优惠:";
    output += "\n" + "指定菜品半价(黄焖鸡，凉皮)，" + "省" + getReducePrice(count2, allItems, getItems) + "元" + "\n" + "-----------------------------------" + "\n" + "总计：" + count2 + "元";
  }

  output += "\n" + "===================================";
  return output;
}

//计算差价
function getReducePrice(count2, allItems, getItems) {
  var sum = 0;
  for (var i = 0; i < allItems.length; i++) {
    for (var j = 0; j < getItems.length; j++) {
      if (allItems[i][0] === getItems[j].id) {
        sum += allItems[i][1] * getItems[j].price;
      }
    }
  }
  return sum - count2;
}

module.exports = bestCharge;
