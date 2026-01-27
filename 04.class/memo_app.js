import readline from "node:readline";
import enquirer from "enquirer";

import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";

const { Select } = enquirer;
const editor = process.env.EDITOR;

export class MemoApp {
  constructor(command, db) {
    this.command = command;
    this.db = db;
  }

  async run() {
    if (this.command.isAdd()) {
      await this.add();
    } else if (this.command.isList()) {
      await this.list();
    } else if (this.command.isDelete()) {
      await this.delete();
    } else if (this.command.isRead()) {
      await this.read();
    } else if (this.command.isEdit()) {
      await this.edit();
    }
  }

  async add() {
    let memoBody = "";

    await new Promise((resolve) => {
      const reader = readline.createInterface({
        input: process.stdin,
      });

      reader.on("line", (line) => {
        memoBody += line + "\n";
      });

      reader.on("close", async () => {
        await this.db.insert(memoBody);
        console.log("以下メモが登録されました----");
        console.log(memoBody);
        resolve();
      });
    });
  }

  async list() {
    console.log("メモ一覧----");
    const rows = await this.db.findAll();
    rows.forEach((row) => {
      console.log(`[${row.id}] ${row.body.split("\n")[0]}`);
    });
  }

  async select(message) {
    const rows = await this.db.findAll();
    const choices = rows.map((row) => `[${row.id}] ${row.body.split("\n")[0]}`);

    const prompt = new Select({
      name: "memo",
      message,
      choices,
    });

    const selected = await prompt.run();
    const id = Number(selected.match(/^\[(\d+)\]/)[1]);
    return id;
  }

  async delete() {
    const id = await this.select("削除するメモを選択してください。");
    await this.db.deleteMemoById(id);
  }

  async read() {
    const id = await this.select("参照するメモを選択してください。");
    const row = await this.db.findMemoById(id);
    console.log("メモ本文----");
    console.log(row.body);
  }

  async edit() {
    const id = await this.select("編集するメモを選択してください。");

    if (!editor) {
      console.error("EDITOR 環境変数が設定されていません。");
      process.exit(1);
    }

    const row = await this.db.findMemoById(id);

    await fs.writeFile("./memo.txt", row.body, "utf8");

    spawnSync(editor, ["-w", "./memo.txt"], { stdio: "inherit" });

    const editBody = await fs.readFile("./memo.txt", "utf8");

    await this.db.updateMemoById(id, editBody);

    const updated = await this.db.findMemoById(id);
    console.log("編集結果----");
    console.log(updated.body);

    await fs.unlink("./memo.txt");
  }
}
