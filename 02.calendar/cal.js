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

const firstDay = new Date(year, month - 1, 1);
const allDays = [];

for (let num = 1; num <= firstDay.getDay(); num++) {
  allDays.push(null);
}

while (firstDay.getMonth() === month - 1) {
  allDays.push(new Date(firstDay));
  firstDay.setDate(firstDay.getDate() + 1);
}

for (let i = 0; i < allDays.length; i += 7) {
  const sliceDays = allDays.slice(i, i + 7);

  const outputCalendarDays = sliceDays.map((n) => {
    return n === null ? "  " : n.getDate().toString().padStart(2, " ");
  });

  console.log(outputCalendarDays.join(" "));
}
