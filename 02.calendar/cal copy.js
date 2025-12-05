#!/usr/bin/env node

import { type } from 'node:os';
import { parseArgs } from 'node:util';

const options = {
  y: { type: 'string' },
  m: { type: 'string' },
};

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options
});

const year = Number(values.y);
const month = Number(values.m) ;

const date = new Date(year, month)

console.log(`${month}月 ${year}`)
console.log('日 月 火 水 木 金 土');

const first_wday = new Date(year, month -1 , 1).getDay();
const last_day = new Date(year, month, 0).getDate();

const all_days = []
for (let day = 1; day <= last_day; day++ ){
  all_days.push(day)
}

for (let num = 1; num < first_wday; num++ ){
  all_days.unshift(null);
}

const eachSlice = (arr, n = 2, result = []) => {
  if (arr.length === 0) {
    return result;
  }

  result.push(arr.splice(0, n))
  return eachSlice(arr, n, result)
}

const calender_days = eachSlice(all_days, 7);

console.group(calender_days);

console.log(calender_days.join(" "));

// console.log(all_days);

// console.log(first_wday);

// const chunkIntoN = (arr, n) => {
//   const size = arr.length / n;
//   return Array.from({ length: n }, (v, i) =>
//     arr.slice(i * size, i * size + size)
//   );
// };

// console.log(chunkIntoN(all_days, 7));

// const b = all_days.length;
// const cnt = 7,
// newArr = [];
// for(var i = 0; i < Math.ceil(b / cnt); i++) {
//   var arrEl = []; // newArr に追加していく配列
//   for(var j = 0; j < cnt; j++) {
//     var p = all_days.shift(); // 元配列の先頭を取得して元配列から削除
//     if(!p) { break; }        // この場合は'ZZZ'の次に来たらループを抜ける
//     arrEl.push(p);           // arrElに取得した要素を追加
//   }
//   newArr.push(arrEl); // 作ったarrElをnewArrに追加
//   console.log(newArr);
// }

// console.log(newArr);

// const sliceByNumber = (array, number) => {
//   const length = Math.ceil(array.length / number)
//   return new Array(length).fill().map((_, i) =>
//     array.slice(i * number, (i + 1) * number)
//   )
// }
// console.log(sliceByNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3))





