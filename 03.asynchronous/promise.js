#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

runAsync(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
)
  // エラーなし
  .then(() =>
    console.log("レコードを追加し、自動採番された ID を標準出力に出力する"),
  )
  .then(() =>
    runAsync("INSERT INTO books (title) VALUES ('走れメロス')").then((stmt) => {
      console.log(stmt.lastID + "：走れメロス");
    }),
  )
  .then(() =>
    runAsync("INSERT INTO books (title) VALUES ('こころ')").then((stmt) => {
      console.log(stmt.lastID + "：こころ");
    }),
  )
  .then(() =>
    runAsync("INSERT INTO books (title) VALUES ('山月記')").then((stmt) => {
      console.log(stmt.lastID + "：山月記");
    }),
  )
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
  // エラーあり：レコードの追加
  .then(() => runAsync("INSERT INTO books (title) VALUES (null)"))
  .then(() => allAsync("SELECT id, title FROM books ORDER BY id"))
  .catch((err) => {
    console.error("INSERTエラー：", err.message);
  })
  // エラーあり：レコードの取得
  .then(() => allAsync("SELECT id, author FROM books"))
  .catch((err) => {
    console.error("SELECTエラー：", err.message);
  })
  .then(() => runAsync("DROP TABLE books"));
