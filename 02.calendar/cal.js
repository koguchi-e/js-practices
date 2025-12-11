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

const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
const lastDay = new Date(year, month, 0).getDate();

const allDays = [];
for (let day = 1; day <= lastDay; day++) {
  allDays.push(day);
}

for (let num = 1; num <= firstDayOfWeek; num++) {
  allDays.unshift(null);
}

for (let i = 0; i < allDays.length; i += 7) {
  const calendarDays = allDays.slice(i, i + 7);

  const result = calendarDays.map((n) => {
    if (n === null) {
      return String(n).replace("null", " ").padStart(2, " ");
    } else {
      return String(n).padStart(2, " ");
    }
  });

  console.log(result.join(" "));
}
