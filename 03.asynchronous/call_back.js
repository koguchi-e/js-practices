#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

function makeTableCallback(callback) {
  setTimeout(() => {
    const success = true;
    if (success) {
      db.run("CREATE TABLE books (id INT, title TEXT)", () => {
        const stmt = db.prepare("INSERT INTO books VALUES (?, ?)");
        stmt.run([1, "走れメロス"], () => {
          db.get("SELECT rowid AS id, title FROM books", (err, row) => {
            callback(null, row);
          });
        });
      });
    } else {
      callback(new Error("失敗しました"));
    }
  }, 1000);
}

makeTableCallback((err, value) => {
  if (err) {
    console.error("エラー:", err);
    return;
  }
  console.log(value.id + ": " + value.title);
});
