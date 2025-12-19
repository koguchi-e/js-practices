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

const title = `${month}月 ${year}`;

console.log(title.padStart(month.length === 1 ? 13 : 14, " "));
console.log("日 月 火 水 木 金 土");

const firstDate = new Date(year, month - 1, 1);
const monthDates = [];

for (let num = 1; num <= firstDate.getDay(); num++) {
  monthDates.push(null);
}

while (firstDate.getMonth() === month - 1) {
  monthDates.push(new Date(firstDate));
  firstDate.setDate(firstDate.getDate() + 1);
}

for (let i = 0; i < monthDates.length; i += 7) {
  const sliceDays = monthDates.slice(i, i + 7);

  const outputCalendarDays = sliceDays.map((n) => {
    return n === null ? "  " : n.getDate().toString().padStart(2, " ");
  });

  console.log(outputCalendarDays.join(" "));
}
