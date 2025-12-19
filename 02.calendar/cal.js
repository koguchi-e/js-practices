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

console.log("      " + title);
console.log("日 月 火 水 木 金 土");

const firstDate = new Date(year, month - 1, 1);
const monthDates = [];

for (let wday = 1; wday <= firstDate.getDay(); wday++) {
  monthDates.push(null);
}

for (
  ;
  firstDate.getMonth() === month - 1;
  firstDate.setDate(firstDate.getDate() + 1)
) {
  monthDates.push(new Date(firstDate));
}

for (let weekIndex = 0; weekIndex < monthDates.length; weekIndex += 7) {
  const sliceDays = monthDates.slice(weekIndex, weekIndex + 7);

  const outputCalendarDays = sliceDays.map((n) =>
    n !== null ? n.getDate().toString().padStart(2, " ") : "  ",
  );

  console.log(outputCalendarDays.join(" "));
}
