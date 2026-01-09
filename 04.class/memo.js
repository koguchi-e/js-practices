#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { parseArgs } from "node:util";
import readline from "node:readline";
import enquirer from "enquirer";
const { Select } = enquirer;

const { values, positionals } = parseArgs({
  options: {
    l: { type: "boolean" },
    d: { type: "boolean" },
    r: { type: "boolean" },
  },
  allowPositionals: true,
});

function main() {
  const db = new sqlite3.Database("memo.db");

  db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT NOT NULL)",
    );

    if (!values.l && !values.d && !values.r) {
      const stmt = db.prepare("INSERT INTO memos (body) VALUES (?)");
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
    } else if (values.l) {
      console.log("メモ一覧----");
      db.each(
        "SELECT * FROM memos",
        (err, row) => {
          console.log(`[${row.id}] ${row.body.split("\n")[0]}`);
        },
        () => {
          db.close();
        },
      );
    } else if (values.d) {
      db.all("SELECT * FROM memos", (err, rows) => {
        if (err) {
          console.error(err);
          return;
        }
        const choices = rows.map((row) => ({
          name: `[${row.id}] ${row.body.split("\n")[0]}`,
        }));

        const prompt = new Select({
          name: "memo",
          message: "削除するメモを選択してください。",
          choices,
        });

        prompt
          .run()
          .then((selected) => {
            console.log("選択結果：", selected);
            const id = Number(selected.match(/^\[(\d+)\]/)[1]);
            db.run("DELETE FROM memos WHERE id = ?", [id], function (err) {
              if (err) {
                console.error(err);
                return;
              }
              console.log("削除された件数:", this.changes);
              db.close();
            });
          })
          .catch(console.error);
      });
    } else if (values.r) {
      db.all("SELECT * FROM memos", (err, rows) => {
        if (err) {
          console.error(err);
          return;
        }
        const choices = rows.map((row) => ({
          name: `[${row.id}] ${row.body.split("\n")[0]}`,
        }));

        const prompt = new Select({
          name: "memo",
          message: "参照するメモを選択してください。",
          choices,
        });

        prompt.run().then((selected) => {
          console.log("選択結果：", selected);
          const id = Number(selected.match(/^\[(\d+)\]/)[1]);
          db.get("SELECT body FROM memos WHERE id = ?", [id], (err, row) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(row.body);
            db.close();
          });
        });
      });
    }
  });
}
main();
