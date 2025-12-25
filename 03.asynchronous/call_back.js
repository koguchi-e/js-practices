#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

// エラーなし
function runBooksFlow(callback) {
  setTimeout(() => {
    db.run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
      () => {
        const stmt = db.prepare("INSERT INTO books (title) VALUES (?)");
        stmt.run(["走れメロス"], () => {
          stmt.run(["こころ"], () => {
            stmt.run(["山月記"], () => {
              stmt.finalize();
              db.all("SELECT id, title FROM books ORDER BY id", (err, rows) => {
                db.run("DROP TABLE books", () => {
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

runBooksFlow((err, rows) => {
  rows.forEach((row) => {
    console.log(row.id + ": " + row.title);
  });
});

// エラーあり
function runBooks2Flow(callback) {
  setTimeout(() => {
    db.run(
      "CREATE TABLE books2 (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
      (err) => {
        if (err) return callback(err);

        const stmt = db.prepare("INSERT INTO books2 (title) VALUES (?)");
        stmt.run([null], (insertErr) => {
          stmt.finalize();

          if (insertErr) {
            db.all("SELECT author FROM books2", (selectErr) => {
              db.run("DROP TABLE books2", () => {
                callback(insertErr);
                callback(selectErr);
              });
            });
            return;
          }
          callback(null);
        });
      },
    );
  }, 1000);
}

runBooks2Flow((err) => {
  if (err) {
    console.error("エラー：", err.message);
  }
});
