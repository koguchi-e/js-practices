#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

// エラーなし
function successFlow(callback) {
  setTimeout(() => {
    db.run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
      () => {
        const stmt = db.prepare("INSERT INTO books (title) VALUES (?)");
        stmt.run(["走れメロス"], function () {
          stmt.run(["こころ"], function () {
            stmt.run(["山月記"], function () {
              stmt.finalize();
              db.all("SELECT id, title FROM books ORDER BY id", (err, rows) => {
                db.run("DROP TABLE books", (err) => {
                  if (err) {
                    callback(new Error("失敗しました"));
                    return;
                  }
                  callback(null, rows);
                });
              });
            });
          });
        });
      },
    );
  }, 1000);
}

successFlow((err, rows) => {
  if (err) {
    console.error("エラー:", err.message);
    return;
  }
  rows.forEach((row) => {
    console.log(row.id + ": " + row.title);
  });
});

// エラーあり
function failureFlow(callback) {
  setTimeout(() => {
    db.run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
      () => {
        const stmt = db.prepare("INSERT INTO books (title) VALUES (?)");
        stmt.run([null], function () {
          db.all("SELECT id, title FROM books ORDER BY id", (err, rows) => {
            db.run("DROP TABLE books", () => {
              if (err) {
                callback(new Error("失敗しました"));
                return;
              }
              callback(null, rows);
            });
          });
        });
      },
    );
  }, 1000);
}

failureFlow((err, rows) => {
  if (err) {
    console.error("エラー:", err.message);
    return;
  }
  rows.forEach((row) => {
    console.log(row.id + ": " + row.title);
  });
});
