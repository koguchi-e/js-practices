#!/usr/bin/env node

import "dotenv/config";

import { Command } from "./command.js";
import { MemoDatabase } from "./memo_database.js";
import { MemoApp } from "./memo_app.js";

class Main {
  constructor() {
    this.command = new Command();
    this.db = new MemoDatabase();
    this.memoApp = new MemoApp(this.command, this.db);
  }
  async run() {
    try {
      await this.db.init();
      await this.memoApp.run();
    } finally {
      await this.db.closeDatabase();
    }
  }
}

new Main().run();
