#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

function executeSql(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function insertBook(title) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO books (title) VALUES (?)", [title], function (err) {
      if (err) reject(err);
      else {
        console.log(this.lastID + ": " + title);
        resolve({ id: this.lastID, title });
      }
    });
  });
}

function selectAll(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// エラーなし
async function insertBooksAndPrintID() {
  try {
    console.log("レコードを追加し、自動採番された ID を標準出力に出力する");
    await executeSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
    );
    await insertBook("走れメロス");
    await insertBook("こころ");
    await insertBook("山月記");
  } catch (err) {
    console.error("エラー：", err.message);
  } finally {
    await executeSql("DROP TABLE books");
  }
}

async function selectBooksAndPrint() {
  try {
    console.log("レコードを取得し、それを標準出力に出力する");
    await executeSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
    );
    await executeSql("INSERT INTO books (title) VALUES ('走れメロス')");
    await executeSql("INSERT INTO books (title) VALUES ('こころ')");
    await executeSql("INSERT INTO books (title) VALUES ('山月記')");
    const rows = await selectAll("SELECT id, title FROM books ORDER BY id");
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
  } catch (err) {
    console.error("エラー：", err.message);
  } finally {
    await executeSql("DROP TABLE books");
  }
}

// エラーあり：レコードの追加
async function insertError() {
  try {
    await executeSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
    );
    await executeSql("INSERT INTO books (title) VALUES (null)");
  } catch (err) {
    console.error("INSERTエラー：", err.message);
  } finally {
    await executeSql("DROP TABLE books");
  }
}

// エラーあり：レコードの取得
async function selectError() {
  try {
    await executeSql(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE NOT NULL)",
    );
    await executeSql("INSERT INTO books (title) VALUES ('走れメロス')");
    await selectAll("SELECT id, author FROM books");
  } catch (err) {
    console.error("SELECTエラー：", err.message);
  } finally {
    await executeSql("DROP TABLE books");
  }
}

async function main() {
  await insertBooksAndPrintID();
  await selectBooksAndPrint();
  await insertError();
  await selectError();
}
main();
