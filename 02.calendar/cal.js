#!/usr/bin/env node

import { parseArgs } from "node:util";

function formatCalendarCell(cell) {
  if (cell === null) {
    return "  ";
  }
  return cell.getDate().toString().padStart(2, " ");
}

function formatWeek(weekDates) {
  return weekDates.map(formatCalendarCell).join(" ");
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

for (
  let currentDate = new Date(firstDate);
  currentDate.getMonth() === month - 1;
  currentDate.setDate(currentDate.getDate() + 1)
) {
  monthDates.push(new Date(currentDate));
}

const lines = [];

for (let i = 0; i < monthDates.length; i += 7) {
  const weekDates = monthDates.slice(i, i + 7);
  lines.push(formatWeek(weekDates));
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  console.log(line);
}
