#!/usr/bin/env node

import "dotenv/config";

import { Command } from "./command.js";
import { MemoDatabase } from "./memo_database.js";

class Main {
  constructor() {
    this.db = new MemoDatabase();
    this.command = new Command(this.db);
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
