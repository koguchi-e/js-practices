#!/usr/bin/env node

import "dotenv/config";

import { Command } from "./command.js";
import { MemoDatabase } from "./memo_database.js";
import { MemoApp } from "./memo_app.js";

class Main {
  constructor() {
    this.command = new Command(process.argv);
    this.db = new MemoDatabase();
    this.memoApp = new MemoApp(this.command, this.db);
  }
  run() {
    this.db.init(() => {
      this.memoApp.run();
    });
  }
}

new Main().run();
