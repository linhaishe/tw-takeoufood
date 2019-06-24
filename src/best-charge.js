let loadAllItems = require('../src/items');
let loadPromotions =require('../src/promotions');

function bestCharge(selectedItems) {
  //获得客户挑选的商品信息
  let allItems;
  allItems = [];
  allItems = splitIt(selectedItems);

  //获取商品的基本信息
  let getItems = loadAllItems();
  let getItem = loadAllItems();
  //获取优惠商品
  let getCount = loadPromotions();

  //按照第一种方式优惠或者不优惠
  let count1 = countItByFirst(allItems, getItems);

  //按照第二种方式优惠
  let count2 = countItBySecond(allItems, getItems, getCount);

  let str;
  str = compareIt(count1, count2, allItems, getItem);
  return str;
}

//划分已经购买的名称和数量
//understanding
// var numbers = [1, 2, 3, 4, 5];
// var length = numbers.length;
// for (var i = 0; i < length; i++) {
//   numbers[i] *= 2;
// }
// numbers is now [2, 4, 6, 8, 10]
function splitIt(selectedItems) {
  let temp = [];
  for (var i = 0; i < selectedItems.length; i++) {

    temp[i] = selectedItems[i].split("x");
    temp[i][0] = temp[i][0].replace(/(^\s*)|(\s*$)/g, "");
  }

  return temp;
}

//第一种优惠方式
function countItByFirst(allItems, getItems) {
  let sum = 0;
  for (let i = 0; i < allItems.length; i++) {
    for (let j = 0; j < getItems.length; j++) {
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
  let sum = 0;

  for (let k = 0; k < getItems.length; k++) {
    for (let m = 0; m < getCount[1].items.length; m++) {
      if (getItems[k].id === getCount[1].items[m]) {
        getItems[k].price *= 1 / 2;
      }
    }
  }
  for (let i = 0; i < allItems.length; i++) {
    for (let j = 0; j < getItems.length; j++) {
      if (allItems[i][0] === getItems[j].id) {
        sum += allItems[i][1] * getItems[j].price;
      }
    }
  }

  return sum;
}

function compareIt(count1, count2, allItems, getItems) {

  let output = "============= 订餐明细 =============";

  //将整个购买数据输出
  for (let i = 0; i < allItems.length; i++)
    for (let j = 0; j < getItems.length; j++) {
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
  let sum = 0;
  for (let i = 0; i < allItems.length; i++) {
    for (let j = 0; j < getItems.length; j++) {
      if (allItems[i][0] === getItems[j].id) {
        sum += allItems[i][1] * getItems[j].price;
      }
    }
  }
  return sum - count2;
}

module.exports = bestCharge;
