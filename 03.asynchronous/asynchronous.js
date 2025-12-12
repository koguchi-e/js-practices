#!/usr/bin/env node

// import { useCallback } from "react";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

// DBをコールバックで作成
function makeTableCallback() {
  setTimeout(() => {
    db.run("CREATE TABLE books (id INT, title TEXT)");
    const stmt = db.prepare("INSERT INTO books VALUES (id, ?)");
    stmt.run([1, "走れメロス"]);
    stmt.run([2, "こころ"]);
    stmt.run([3, "山月記"]);
    stmt.finalize();
    // db.each("SELECT rowid AS id, info FROM books", (err, row) => {
    //   console.log(row.id + ": " + row.title);
    //   // useCallback(null, stmt);
    // });
  });
}
db.close();

makeTableCallback("SELECT rowid AS id, info FROM books", (err, row) => {
  if (err) {
    console.log("エラー:", err);
    return;
  }
  console.log(row.id + ": " + row.title);
});
