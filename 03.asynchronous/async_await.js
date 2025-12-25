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

function runAll(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// エラーなし
async function runBooksFlow() {
  try {
    await runSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
    );
    await runSql("INSERT INTO books (title) VALUES ('走れメロス')");
    await runSql("INSERT INTO books (title) VALUES ('こころ')");
    await runSql("INSERT INTO books (title) VALUES ('山月記')");
    const rows = await runAll("SELECT id, title FROM books ORDER BY id");
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
  } catch (err) {
    console.error("エラー：", err.message);
  } finally {
    await runSql("DROP TABLE books");
  }
}

// エラーあり：レコードの追加
async function insertError() {
  try {
    await runSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
    );
    await runSql("INSERT INTO books (title) VALUES (null)");
  } catch (err) {
    console.error("INSERTエラー：", err.message);
  } finally {
    await runSql("DROP TABLE books");
  }
}

// エラーあり：レコードの取得
async function selectError() {
  try {
    await runSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
    );
    await runSql("INSERT INTO books (title) VALUES ('走れメロス')");
    await runAll("SELECT id, author FROM books");
  } catch (err) {
    console.error("SELECTエラー：", err.message);
  } finally {
    await runSql("DROP TABLE books");
  }
}

async function main() {
  await runBooksFlow();
  await insertError();
  await selectError();
}
main();
