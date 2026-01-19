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
      console.log(`${this.lastID}：走れメロス`);
      stmt.run(["こころ"], function () {
        console.log(`${this.lastID}：こころ`);
        stmt.run(["山月記"], function () {
          console.log(`${this.lastID}：山月記`);
          stmt.finalize();
          console.log("レコードを取得し、それを標準出力に出力する");
          db.all("SELECT id, title FROM books ORDER BY id", (_err, rows) => {
            rows.forEach((row) => {
              console.log(`${row.id}: ${row.title}`);
            });
            db.run("DROP TABLE books", () => {
              // エラーあり
              db.run(
                "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
                () => {
                  db.run(
                    "INSERT INTO books (title) VALUES (null)",
                    (insertErr) => {
                      if (insertErr) {
                        console.error(`INSERTエラー：${insertErr.message}`);
                      }
                      db.all("SELECT id, author FROM books", (selectErr) => {
                        if (selectErr) {
                          console.error(`SELECTエラー：${selectErr.message}`);
                        }
                        db.run("DROP TABLE books", () => {});
                      });
                    },
                  );
                },
              );
            });
          });
        });
      });
    });
  },
);
