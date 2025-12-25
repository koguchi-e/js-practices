#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

function runSql(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function runAll(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

runSql(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
)
  // エラーなし
  .then(() => runSql("INSERT INTO books (title) VALUES ('走れメロス')"))
  .then(() => runSql("INSERT INTO books (title) VALUES ('こころ')"))
  .then(() => runSql("INSERT INTO books (title) VALUES ('山月記')"))
  .then(() => runAll("SELECT id, title FROM books ORDER BY id"))
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
  })
  .then(() => runSql("DROP TABLE books"))
  // エラーあり：レコードの追加
  .then(() =>
    runSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
    )
      .then(() => runSql("INSERT INTO books (title) VALUES (null)"))
      .catch((err) => {
        if (err) {
          console.error("INSERTエラー：", err.message);
        }
      })
      .then(() => runSql("DROP TABLE books")),
  )
  // エラーあり：レコードの取得
  .then(() =>
    runSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
    )
      .then(() => runSql("INSERT INTO books (title) VALUES ('走れメロス')"))
      .then(() => runAll("SELECT id, author FROM books"))
      .catch((err) => {
        if (err) {
          console.error("SELECTエラー：", err.message);
        }
      })
      .then(() => runSql("DROP TABLE books")),
  );
