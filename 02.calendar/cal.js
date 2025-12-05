#!/usr/bin/env node

import { log } from 'node:console';
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

let year;
if (values.y !== undefined){
  year = Number(values.y);
}else{
  year = 2025;
}

const month = Number(values.m) ;
const date = new Date(year, month)

const title = `${month}月 ${year}`

console.log(title.padStart(14, " "));
console.log('日 月 火 水 木 金 土');

const first_wday = new Date(year, month -1 , 1).getDay();
const last_day = new Date(year, month, 0).getDate();

const all_days = []
for (let day = 1; day <= last_day; day++ ){
  all_days.push(day)
}

for (let num = 1; num <= first_wday; num++ ){
  all_days.unshift(null);
}

for (let i = 0; i < all_days.length; i += 7) {
  const calender_days = (all_days.slice(i, i + 7));
  const result = calender_days.map(n => String(n).padStart(2, " "));
  console.log(result.join(" "));
}
