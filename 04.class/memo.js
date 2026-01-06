#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { parseArgs } from "node:util";
import readline from "node:readline";

const db = new sqlite3.Database("memo.db");

const { values, positionals } = parseArgs({
  options: {
    l: { type: "boolean" },
    r: { type: "boolean" },
    d: { type: "boolean" },
  },
  allowPositionals: true,
});

db.serialize(function () {
  db.run(
    "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, memo TEXT UNIQUE NOT NULL)",
  );

  if (!values.l && !values.r && !values.d) {
    const stmt = db.prepare("INSERT INTO memos (memo) VALUES (?)");
    let inputString = "";

    const reader = readline.createInterface({
      input: process.stdin,
    });

    reader.on("line", (line) => {
      inputString += line + "\n";
    });

    reader.on("close", () => {
      stmt.run(inputString, () => {
        console.log("以下メモが登録されました----");
        console.log(inputString);
        stmt.finalize();
        db.close();
      });
    });
  }
  if (values.l) {
    console.log("メモ一覧----");
    db.each(
      "SELECT * FROM memos",
      (err, row) => {
        const firstLine = row.memo.split("\n")[0];
        console.log(firstLine);
      },
      () => {
        db.close();
      },
    );
  }
});
