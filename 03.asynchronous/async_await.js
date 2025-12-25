#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

function runSql(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function insertBook(sql) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO books (title) VALUES (?)");
    stmt.run(sql, (err) => {
      stmt.finalize();
      if (err) reject(err);
      else resolve();
    });
  });
}

function selectAllBooks() {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, title FROM books ORDER BY id", (err, rows) => {
      db.run("DROP TABLE books", () => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });
}

async function main() {
  try {
    await runSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
    );
    await insertBook("走れメロス");
    await insertBook("こころ");
    await insertBook("山月記");
    const rows = await selectAllBooks();
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
  } catch (err) {
    console.error("エラー：", err.message);
  }
}

main();
