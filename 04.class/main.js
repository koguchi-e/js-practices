#!/usr/bin/env node

import readline from "node:readline";
import enquirer from "enquirer";
const { Select } = enquirer;

import { Command } from "./command.js";
import { MemoDatabase } from "./memo_database.js";

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
      }
    });
  }

  addMemo() {
    let inputString = "";

    const reader = readline.createInterface({
      input: process.stdin,
    });

    reader.on("line", (line) => {
      inputString += line + "\n";
    });

    reader.on("close", () => {
      this.db.insert(inputString, () => {
        console.log("以下メモが登録されました----");
        console.log(inputString);
        this.db.close();
      });
    });
  }

  listMemo() {
    console.log("メモ一覧----");
    this.db.findAll((err, rows) => {
      rows.forEach((row) => {
        console.log(`[${row.id}] ${row.body.split("\n")[0]}`);
      });
      this.db.close();
    });
  }

  deleteMemo() {
    this.db.findAll((err, rows) => {
      const choices = rows.map((row) => ({
        name: `[${row.id}] ${row.body.split("\n")[0]}`,
      }));

      const prompt = new Select({
        name: "memo",
        message: "削除するメモを選択してください。",
        choices,
      });

      prompt.run().then((selected) => {
        console.log("選択結果：", selected);
        const id = Number(selected.match(/^\[(\d+)\]/)[1]);
        this.db.deleteById(id, () => {
          if (err) {
            console.error(err);
            return;
          }
          this.db.close();
        });
      });
    });
  }

  readMemo() {
    this.db.findAll((err, rows) => {
      const choices = rows.map(
        (row) => `[${row.id}] ${row.body.split("\n")[0]}`,
      );

      const prompt = new Select({
        name: "memo",
        message: "参照するメモを選択してください。",
        choices,
      });

      prompt.run().then((selected) => {
        console.log("選択結果：", selected);
        const id = Number(selected.match(/^\[(\d+)\]/)[1]);
        this.db.findMemoById(id, (err, row) => {
          console.log("メモ本文----");
          console.log(row.body);
          this.db.close();
        });
      });
    });
  }
}
new Main().run();
