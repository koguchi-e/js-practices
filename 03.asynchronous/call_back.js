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

// エラーあり：レコードの追加
function insertError(callback) {
  setTimeout(() => {
    db.run(
      "CREATE TABLE books2 (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
      (err) => {
        if (err) return callback(err);
        db.run("INSERT INTO books2 (title) VALUES (null)", (err) => {
          db.run("DROP TABLE books2", () => {
            callback(err);
          });
          callback(null);
        });
      },
    );
  }, 1000);
}

insertError((err) => {
  if (err) {
    console.error("INSERTエラー：", err.message);
  }
});

// エラーあり：レコードの追加
function selectError(callback) {
  setTimeout(() => {
    db.run(
      "CREATE TABLE books3 (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
      (err) => {
        if (err) return callback(err);
        db.run("INSERT INTO books3 (title) VALUES ('走れメロス')", () => {
          db.all("SELECT id, author FROM books3", (err) => {
            db.run("DROP TABLE books3", () => {
              callback(err);
            });
          });
          callback(null);
        });
      },
    );
  }, 1000);
}

selectError((err) => {
  if (err) {
    console.error("SELECTエラー：", err.message);
  }
});
