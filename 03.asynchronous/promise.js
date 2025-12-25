#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

// エラーなし
function successFlowDbGet() {
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

function successDbInsertData() {
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

function successDbSelectAll() {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, title FROM books ORDER BY id", (err, rows) => {
      db.run("DROP TABLE books", () => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });
}

successFlowDbGet()
  .then(successDbInsertData)
  .then(successDbSelectAll)
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
  });

// エラーあり
function failureFlowDbGet() {
  return new Promise((resolve, reject) => {
    db.run(
      "CREATE TABLE books2 (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

function failureDbInsertData() {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO books2 (title) VALUES (?)");
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

function failureDbSelectAll() {
  return new Promise((resolve, reject) => {
    db.all("SELECT author FROM books2", (selectErr) => {
      db.run("DROP TABLE books", () => {
        if (selectErr) reject(selectErr);
        else resolve();
      });
    });
  });
}

failureFlowDbGet()
  .then(failureDbInsertData)
  .then(failureDbSelectAll)
  .catch((err) => {
    if (err) {
      console.error("エラー：", err.message);
    }
  });
