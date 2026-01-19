#!/usr/bin/env node

import readline from "node:readline";
import enquirer from "enquirer";
import "dotenv/config";
import fs from "fs";

import { Command } from "./command.js";
import { MemoDatabase } from "./memo_database.js";
import { spawnSync } from "node:child_process";

const { Select } = enquirer;
const editor = process.env.EDITOR;

class Main {
  constructor() {
    this.command = new Command(process.argv);
    this.db = new MemoDatabase();
  }

  run() {
    this.db.init(() => {
      if (this.command.isAdd()) {
        this.addMemo();
      } else if (this.command.isList()) {
        this.listMemo();
      } else if (this.command.isDelete()) {
        this.deleteMemo();
      } else if (this.command.isRead()) {
        this.readMemo();
      } else if (this.command.isEdit()) {
        this.editMemo();
      }
    });
  }

  addMemo() {
    let memoBody = "";

    const reader = readline.createInterface({
      input: process.stdin,
    });

    reader.on("line", (line) => {
      memoBody += line + "\n";
    });

    reader.on("close", () => {
      this.db.insert(memoBody, () => {
        console.log("以下メモが登録されました----");
        console.log(memoBody);
        this.db.close();
      });
    });
  }

  listMemo() {
    console.log("メモ一覧----");
    this.db.findAll((err, rows) => {
      if (err) {
        console.error(err);
        return;
      } else {
        rows.forEach((row) => {
          console.log(`[${row.id}] ${row.body.split("\n")[0]}`);
        });
      }
      this.db.close();
    });
  }

  selectMemo(message, callback) {
    this.db.findAll((err, rows) => {
      if (err) {
        console.error(err);
        return;
      } else {
        const choices = rows.map(
          (row) => `[${row.id}] ${row.body.split("\n")[0]}`,
        );

        const prompt = new Select({
          name: "memo",
          message,
          choices,
        });

        prompt.run().then((selected) => {
          console.log("選択結果：", selected);
          const id = Number(selected.match(/^\[(\d+)\]/)[1]);
          callback(id);
        });
      }
    });
  }

  deleteMemo() {
    this.selectMemo("削除するメモを選択してください。", (id) => {
      this.db.deleteMemoById(id, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        this.db.close();
      });
    });
  }

  readMemo() {
    this.selectMemo("参照するメモを選択してください。", (id) => {
      this.db.findMemoById(id, (err, row) => {
        if (err) {
          console.error(err);
          return;
        } else {
          console.log("メモ本文----");
          console.log(row.body);
        }
        this.db.close();
      });
    });
  }

  editMemo() {
    this.selectMemo("編集するメモを選択してください。", (id) => {
      if (!editor) {
        console.error("EDITOR 環境変数が設定されていません。");
        process.exit(1);
      } else {
        this.db.findMemoById(id, (err, row) => {
          fs.writeFile("./memo.txt", row.body, "utf8", (err) => {
            if (err) {
              console.log(err);
            } else {
              spawnSync(editor, ["-w", "./memo.txt"], {
                stdio: "inherit",
              });
              const editBody = fs.readFileSync("./memo.txt", "utf8");
              this.db.updateMemoById(id, editBody, (err) => {
                if (err) {
                  console.error(err);
                  return;
                } else {
                  this.db.findMemoById(id, (err, row) => {
                    if (err) {
                      console.error(err);
                      return;
                    } else {
                      console.log("編集結果----");
                      console.log(row.body);
                      fs.unlinkSync("./memo.txt");
                      this.db.close();
                    }
                  });
                }
              });
            }
          });
        });
      }
    });
  }
}

new Main().run();
