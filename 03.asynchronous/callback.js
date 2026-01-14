#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

// エラーなし
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
  () => {
    console.log("レコードを追加し、自動採番された ID を標準出力に出力する");
    const stmt = db.prepare("INSERT INTO books (title) VALUES (?)");
    stmt.run(["走れメロス"], function () {
      console.log(this.lastID + "：走れメロス");
      stmt.run(["こころ"], function () {
        console.log(this.lastID + "：こころ");
        stmt.run(["山月記"], function () {
          console.log(this.lastID + "：山月記");
          stmt.finalize();
          db.all("SELECT id, title FROM books ORDER BY id", (err, rows) => {
            db.run("DROP TABLE IF EXISTS books", () => {
              console.log("レコードを取得し、それを標準出力に出力する");
              rows.forEach((row) => {
                console.log(row.id + ": " + row.title);
              });
            });
            // エラーあり
            db.run(
              "CREATE TABLE books_error (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
              (err) => {
                if (err) return console.error(err);
                db.run(
                  "INSERT INTO books_error (title) VALUES (null)",
                  (err) => {
                    if (err) {
                      db.run("DROP TABLE IF EXISTS books_error", () => {
                        console.error("INSERTエラー：", err.message);
                      });
                    }
                    db.all("SELECT id, author FROM books_error", (err) => {
                      db.run("DROP TABLE IF EXISTS books_error", () => {
                        console.error("SELECTエラー：", err.message);
                      });
                    });
                  },
                );
              },
            );
          });
        });
      });
    });
  },
);
