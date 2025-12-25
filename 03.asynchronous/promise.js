#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

// エラーなし
function createBooksTable() {
  return new Promise((resolve, reject) => {
    db.run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

function insertBooks() {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO books (title) VALUES (?)");
    stmt.run(["走れメロス"], () => {
      stmt.run(["こころ"], () => {
        stmt.run(["山月記"], (err) => {
          stmt.finalize();
          if (err) reject(err);
          else resolve();
        });
      });
    });
  });
}

function selectAllBooks() {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, title FROM books ORDER BY id", (err, rows) => {
      db.run("DROP TABLE books", () => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });
}

// エラーあり
function selectAllBooks2() {
  return new Promise((resolve, reject) => {
    db.all("SELECT author FROM books2", (selectErr) => {
      db.run("DROP TABLE books", () => {
        if (selectErr) reject(selectErr);
        else resolve();
      });
    });
  });
}

// エラーなし
createBooksTable()
  .then(insertBooks)
  .then(selectAllBooks)
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
  });

// エラーあり
createBooksTable()
  .then(insertBooks)
  .then(selectAllBooks2)
  .catch((err) => {
    if (err) {
      console.error("エラー：", err.message);
    }
  });
