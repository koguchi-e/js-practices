#!/usr/bin/env node

import "dotenv/config";

import { Command } from "./command.js";
import { MemoDatabase } from "./memo_database.js";
import { MemoApp } from "./memo_app.js";

class Main {
  constructor() {
    this.db = new MemoDatabase();
    this.memoApp = new MemoApp(this.db);
    this.command = new Command(this.memoApp);
  }
  async run() {
    try {
      await this.db.init();
      await this.command.run();
    } finally {
      await this.db.closeDatabase();
    }
  }
}

new Main().run();
