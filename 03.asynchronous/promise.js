#!/usr/bin/env node

import { runAsync, allAsync } from "./db.js";

runAsync(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
)
  // エラーなし
  .then(() =>
    console.log("レコードを追加し、自動採番された ID を標準出力に出力する"),
  )
  .then(() => runAsync("INSERT INTO books (title) VALUES ('走れメロス')"))
  .then((stmt) => {
    console.log(`${stmt.lastID}：走れメロス`);
  })
  .then(() => runAsync("INSERT INTO books (title) VALUES ('こころ')"))
  .then((stmt) => {
    console.log(`${stmt.lastID}：こころ`);
  })
  .then(() => runAsync("INSERT INTO books (title) VALUES ('山月記')"))
  .then((stmt) => {
    console.log(`${stmt.lastID}：山月記`);
  })
  .then(() => console.log("レコードを取得し、それを標準出力に出力する"))
  .then(() => allAsync("SELECT id, title FROM books ORDER BY id"))
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => runAsync("DROP TABLE IF EXISTS books"))
  // エラーありのプログラム
  .then(() =>
    runAsync(
      "CREATE TABLE books_error (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
    ),
  )
  .then(() => runAsync("INSERT INTO books_error (title) VALUES (null)"))
  .catch((err) => {
    console.error("INSERTエラー：", err.message);
  })
  .then(() => allAsync("SELECT id, author FROM books_error"))
  .catch((err) => {
    console.error("SELECTエラー：", err.message);
  })
  .then(() => runAsync("DROP TABLE IF EXISTS books_error"));
