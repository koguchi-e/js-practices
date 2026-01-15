#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { runAsync, allAsync } from "./sqlite3-promise.js";

const db = new sqlite3.Database(":memory:");

// エラーなし
runAsync(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
)
  .then(() => {
    console.log("レコードを追加し、自動採番された ID を標準出力に出力する");
    return runAsync(db, "INSERT INTO books (title) VALUES ('走れメロス')");
  })
  .then((stmt) => {
    console.log(`${stmt.lastID}：走れメロス`);
    return runAsync(db, "INSERT INTO books (title) VALUES ('こころ')");
  })
  .then((stmt) => {
    console.log(`${stmt.lastID}：こころ`);
    return runAsync(db, "INSERT INTO books (title) VALUES ('山月記')");
  })
  .then((stmt) => {
    console.log(`${stmt.lastID}：山月記`);
    console.log("レコードを取得し、それを標準出力に出力する");
    return allAsync(db, "SELECT id, title FROM books ORDER BY id");
  })
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => runAsync(db, "DROP TABLE books"))
  // エラーありのプログラム
  .then(() =>
    runAsync(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
    ),
  )
  .then(() => runAsync(db, "INSERT INTO books (title) VALUES (null)"))
  .catch((insertErr) => {
    if (insertErr.code === "SQLITE_CONSTRAINT") {
      console.error("INSERTエラー：", insertErr.message);
    } else {
      throw insertErr;
    }
  })
  .then(() => allAsync(db, "SELECT id, author FROM books"))
  .catch((selectErr) => {
    if (selectErr.code === "SQLITE_ERROR") {
      console.error("SELECTエラー：", selectErr.message);
    } else {
      throw selectErr;
    }
  })
  .then(() => runAsync(db, "DROP TABLE books"));
