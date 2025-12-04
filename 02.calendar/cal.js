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
const month = Number(values.m);

for(let day=1; day <=30; day++){
  new Date(year, month, day);
  console.log(`${month}月 ${day}日 ${year}`);
}
console.log('日 月 火 水 木 金 土');

