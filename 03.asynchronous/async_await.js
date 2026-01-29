#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { runAsync, allAsync, closeAsync } from "./sqlite3-promise.js";

const db = new sqlite3.Database(":memory:");

try {
  // エラーなし
  console.log("レコードを追加し、自動採番された ID を標準出力に出力する");
  await runAsync(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
  );
  let stmt;
  stmt = await runAsync(db, "INSERT INTO books (title) VALUES ('走れメロス')");
  console.log(`${stmt.lastID}：走れメロス`);
  stmt = await runAsync(db, "INSERT INTO books (title) VALUES ('こころ')");
  console.log(`${stmt.lastID}：こころ`);
  stmt = await runAsync(db, "INSERT INTO books (title) VALUES ('山月記')");
  console.log(`${stmt.lastID}：山月記`);
  console.log("レコードを取得し、それを標準出力に出力する");
  const rows = await allAsync(db, "SELECT id, title FROM books ORDER BY id");
  rows.forEach((row) => {
    console.log(`${row.id}: ${row.title}`);
  });
} finally {
  await runAsync(db, "DROP TABLE books");
}
// エラーあり
try {
  await runAsync(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
  );
  try {
    await runAsync(db, "INSERT INTO books (title) VALUES (null)");
  } catch (err) {
    if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
      console.error(`INSERTエラー：${err.message}`);
    } else {
      throw err;
    }
  }
  try {
    await allAsync(db, "SELECT id, author FROM books");
  } catch (err) {
    if (err instanceof Error && err.code === "SQLITE_ERROR") {
      console.error(`SELECTエラー：${err.message}`);
    } else {
      throw err;
    }
    await runAsync(db, "DROP TABLE books");
  }
} finally {
  await closeAsync(db);
}
