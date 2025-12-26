#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

function executeSql(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function insertBook(title) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO books (title) VALUES (?)", [title], function (err) {
      if (err) reject(err);
      else {
        console.log(this.lastID + ": " + title);
        resolve({ id: this.lastID, title });
      }
    });
  });
}

function selectAll(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

executeSql(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
)
  // エラーなし
  .then(() => {
    console.log("レコードを追加し、自動採番された ID を標準出力に出力する");
  })
  .then(() => insertBook("走れメロス"))
  .then(() => insertBook("こころ"))
  .then(() => insertBook("山月記"))
  .then(() => executeSql("DROP TABLE books"))
  .then(() =>
    executeSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
    )
      .then(() => {
        console.log("レコードを取得し、それを標準出力に出力する");
      })
      .then(() => executeSql("INSERT INTO books (title) VALUES ('走れメロス')"))
      .then(() => executeSql("INSERT INTO books (title) VALUES ('こころ')"))
      .then(() => executeSql("INSERT INTO books (title) VALUES ('山月記')"))
      .then(() => selectAll("SELECT id, title FROM books ORDER BY id"))
      .then((rows) => {
        rows.forEach((row) => {
          console.log(row.id + ": " + row.title);
        });
      })
      .then(() => executeSql("DROP TABLE books")),
  )
  // エラーあり：レコードの追加
  .then(() =>
    executeSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
    )
      .then(() => executeSql("INSERT INTO books (title) VALUES (null)"))
      .catch((err) => {
        if (err) {
          console.error("INSERTエラー：", err.message);
        }
      })
      .then(() => executeSql("DROP TABLE books")),
  )
  // エラーあり：レコードの取得
  .then(() =>
    executeSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
    )
      .then(() => executeSql("INSERT INTO books (title) VALUES ('走れメロス')"))
      .then(() => selectAll("SELECT id, author FROM books"))
      .catch((err) => {
        if (err) {
          console.error("SELECTエラー：", err.message);
        }
      })
      .then(() => executeSql("DROP TABLE books")),
  );
