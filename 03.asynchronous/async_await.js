#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { runAsync, allAsync } from "./sqlite3-promise.js";

const db = new sqlite3.Database(":memory:");

try {
  // エラーなし
  console.log("レコードを追加し、自動採番された ID を標準出力に出力する");
  await runAsync(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
  );
  const firstInsertResult = await runAsync(
    db,
    "INSERT INTO books (title) VALUES ('走れメロス')",
  );
  console.log(`${firstInsertResult.lastID}：走れメロス`);
  const secondInsertResult = await runAsync(
    db,
    "INSERT INTO books (title) VALUES ('こころ')",
  );
  console.log(`${secondInsertResult.lastID}：こころ`);
  const thirdInsertResult = await runAsync(
    db,
    "INSERT INTO books (title) VALUES ('山月記')",
  );
  console.log(`${thirdInsertResult.lastID}：山月記`);
  console.log("レコードを取得し、それを標準出力に出力する");
  const rows = await allAsync(db, "SELECT id, title FROM books ORDER BY id");
  rows.forEach((row) => {
    console.log(`${row.id}: ${row.title}`);
  });
  await runAsync(db, "DROP TABLE books");
} catch (err) {
  console.error(`エラー： ${err.message}`);
}
// エラーあり
await runAsync(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
);
try {
  await runAsync(db, "INSERT INTO books (title) VALUES (null)");
} catch (insertErr) {
  if (insertErr.code === "SQLITE_CONSTRAINT") {
    console.error(`INSERTエラー：${insertErr.message}`);
  } else {
    throw insertErr;
  }
}
try {
  await allAsync(db, "SELECT id, author FROM books");
} catch (selectErr) {
  if (selectErr.code === "SQLITE_ERROR") {
    console.error(`SELECTエラー：${selectErr.message}`);
  } else {
    throw selectErr;
  }
}
await runAsync(db, "DROP TABLE books");
