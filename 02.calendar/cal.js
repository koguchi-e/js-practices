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
const month = Number(values.m) -1 ;

const date = new Date(year, month)

console.log(`${month}月 ${year}`)
console.log('日 月 火 水 木 金 土');

const first_day = new Date(year, month, 1).getDate();
const end_of_month = new Date(year, month + 1, 0).getDate();

// console.log(new Date(2025, 2, 0).getDate());

console.log(first_day);
console.log(end_of_month);


// for(let i = 0; i < day.length; i+=7 ){
//   const month_days = new Date(year, month, day);
//   console.log(month_days.slice(i, i + 7));
// }

