#!/usr/bin/env node

import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

// エラーなし
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
  () => {
    console.log("レコードを追加し、自動採番された ID を標準出力に出力する");
    db.run("INSERT INTO books (title) VALUES ('走れメロス')", function () {
      console.log(`${this.lastID}：走れメロス`);
      db.run("INSERT INTO books (title) VALUES ('こころ')", function () {
        console.log(`${this.lastID}：こころ`);
        db.run("INSERT INTO books (title) VALUES ('山月記')", function () {
          console.log(`${this.lastID}：山月記`);
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
                        if (insertErr.code === "SQLITE_CONSTRAINT") {
                          console.error(`INSERTエラー：${insertErr.message}`);
                        } else {
                          throw insertErr;
                        }
                      }
                      db.all("SELECT id, author FROM books", (selectErr) => {
                        if (selectErr) {
                          if (selectErr.code === "SQLITE_ERROR") {
                            console.error(`SELECTエラー：${selectErr.message}`);
                          } else {
                            throw selectErr;
                          }
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
