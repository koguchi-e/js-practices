#!/usr/bin/env node

import { parseArgs } from "node:util";

function formatCalendarCell(cell) {
  if (cell === null) {
    return "  ";
  }
  return cell.getDate().toString().padStart(2, " ");
}

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
console.log(`      ${title}`);
console.log("日 月 火 水 木 金 土");

const firstDate = new Date(year, month - 1, 1);
const monthDates = [];

for (let i = 0; i < firstDate.getDay(); i++) {
  monthDates.push(null);
}

const currentDate = new Date(firstDate);

for (
  ;
  currentDate.getMonth() === month - 1;
  currentDate.setDate(currentDate.getDate() + 1)
) {
  monthDates.push(new Date(currentDate));
}

for (
  let weekStartIndex = 0;
  weekStartIndex < monthDates.length;
  weekStartIndex += 7
) {
  const weekDates = monthDates.slice(weekStartIndex, weekStartIndex + 7);
  const formattedWeek = weekDates.map(formatCalendarCell);
  console.log(formattedWeek.join(" "));
}
