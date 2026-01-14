#!/usr/bin/env node

import { runAsync, allAsync } from "./db.js";

try {
  // エラーなし
  console.log("レコードを追加し、自動採番された ID を標準出力に出力する");
  await runAsync(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
  );
  const firstInsertResult = await runAsync(
    "INSERT INTO books (title) VALUES ('走れメロス')",
  );
  console.log(`${firstInsertResult.lastID}：走れメロス`);
  const secondInsertResult = await runAsync(
    "INSERT INTO books (title) VALUES ('こころ')",
  );
  console.log(`${secondInsertResult.lastID}：こころ`);
  const thirdInsertResult = await runAsync(
    "INSERT INTO books (title) VALUES ('山月記')",
  );
  console.log(`${thirdInsertResult.lastID}：山月記`);
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
  "CREATE TABLE books_error (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
);
try {
  await runAsync("INSERT INTO books_error (title) VALUES (null)");
} catch (insertErr) {
  console.error("INSERTエラー：", insertErr.message);
}
try {
  await allAsync("SELECT id, author FROM books");
} catch (selectErr) {
  console.error("SELECTエラー：", selectErr.message);
}
await runAsync("DROP TABLE books_error");
