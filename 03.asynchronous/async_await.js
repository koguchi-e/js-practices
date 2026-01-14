#!/usr/bin/env node

import { runAsync, allAsync } from "./db.js";

async function asyncAwait() {
  try {
    // エラーなし
    console.log("レコードを追加し、自動採番された ID を標準出力に出力する");
    await runAsync(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
    );
    const firstBook = await runAsync(
      "INSERT INTO books (title) VALUES ('走れメロス')",
    );
    console.log(`${firstBook.lastID}：走れメロス`);
    const secondBook = await runAsync(
      "INSERT INTO books (title) VALUES ('こころ')",
    );
    console.log(`${secondBook.lastID}：こころ`);
    const thirdBook = await runAsync(
      "INSERT INTO books (title) VALUES ('山月記')",
    );
    console.log(`${thirdBook.lastID}：山月記`);
    console.log("レコードを取得し、それを標準出力に出力する");
    const rows = await allAsync("SELECT id, title FROM books ORDER BY id");
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
    await runAsync("DROP TABLE books");
  } catch (err) {
    console.error("エラー：", err.message);
  }
  // エラーあり
  await runAsync(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
  );
  try {
    await runAsync("INSERT INTO books (title) VALUES (null)");
  } catch (err) {
    console.error("INSERTエラー：", err.message);
  }
  try {
    await allAsync("SELECT id, author FROM books");
  } catch (err) {
    console.error("SELECTエラー：", err.message);
  }
  await runAsync("DROP TABLE books");
}

asyncAwait();
