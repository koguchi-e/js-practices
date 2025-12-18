#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

// エラーなし
function successFlow() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      db.run(
        "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
        () => {
          const stmt = db.prepare("INSERT INTO books (title) VALUES (?)");

          stmt.run(["走れメロス"], function () {
            stmt.run(["こころ"], function () {
              stmt.run(["山月記"], function () {
                stmt.finalize();
                db.all(
                  "SELECT id, title FROM books ORDER BY id",
                  (err, rows) => {
                    db.run("DROP TABLE books", () => {
                      if (err) return reject(err);
                      resolve(rows);
                    });
                  },
                );
              });
            });
          });
        },
      );
    }, 1000);
  });
}

successFlow().then((rows) => {
  rows.forEach((row) => {
    console.log(row.id + ": " + row.title);
  });
});

// エラーあり
function failureFlow() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      db.run(
        "CREATE TABLE books2 (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
        () => {
          const stmt = db.prepare("INSERT INTO books2 (title) VALUES (?)");
          stmt.run([null], function (insertErr) {
            stmt.finalize();

            if (insertErr) {
              db.all("SELECT author FROM books2", (selectErr) => {
                db.run("DROP TABLE books2", () => {
                  reject({ insertErr, selectErr });
                });
              });
              return;
            }
          });
        },
      );
    }, 1000);
  });
}

failureFlow().catch((err) => {
  if (err.insertErr) {
    console.error("エラー：", err.insertErr.message);
  }
  if (err.selectErr) {
    console.error("エラー：", err.selectErr.message);
  }
});
