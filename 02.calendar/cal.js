#!/usr/bin/env node

import { parseArgs } from "node:util";

const parseArgsConfig = {
  y: { type: "string" },
  m: { type: "string" },
};

const { values: inputValues } = parseArgs({
  options: parseArgsConfig,
});

const today = new Date();

const year =
  inputValues.y !== undefined ? Number(inputValues.y) : today.getFullYear();

const month =
  inputValues.m !== undefined ? Number(inputValues.m) : today.getMonth() + 1;

const monthStr = String(month);
const title = `${monthStr}月 ${year}`;

console.log(title.padStart(monthStr.length === 1 ? 13 : 14, " "));
console.log("日 月 火 水 木 金 土");

const first_wday = new Date(year, month - 1, 1).getDay();
const last_day = new Date(year, month, 0).getDate();

const all_days = [];
for (let day = 1; day <= last_day; day++) {
  all_days.push(day);
}

for (let num = 1; num <= first_wday; num++) {
  all_days.unshift(null);
}

for (let i = 0; i < all_days.length; i += 7) {
  const calender_days = all_days.slice(i, i + 7);

  const result = calender_days.map((n) => {
    if (n === null) {
      return String(n).replace("null", " ").padStart(2, " ");
    } else {
      return String(n).padStart(2, " ");
    }
  });

  console.log(result.join(" "));
}
