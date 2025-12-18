#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

function makeTableCallback(callback) {
  setTimeout(() => {
    db.run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
      (err) => {
        if (err) {
          callback(err);
          return;
        }
        const stmt = db.prepare("INSERT INTO books (title) VALUES (?)");
        stmt.run(["走れメロス"], function (err) {
          if (err) {
            callback(err);
            return;
          }
          stmt.run(["こころ"], function (err) {
            if (err) {
              callback(err);
              return;
            }
            stmt.run(["山月記"], function (err) {
              stmt.finalize();
              if (err) {
                callback(err);
                return;
              }
              db.all("SELECT id, title FROM books ORDER BY id", (err, rows) => {
                if (err) {
                  callback(err);
                  return;
                }
                callback(null, rows);
              });
            });
          });
        });
      },
    );
  }, 1000);
}

makeTableCallback((err, rows) => {
  if (err) {
    console.error("エラー:", err);
    return;
  }
  rows.forEach((row) => {
    console.log(row.id + ": " + row.title);
  });
});
