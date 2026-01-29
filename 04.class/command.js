import { parseArgs } from "node:util";
import { MemoApp } from "./memo_app.js";

export class Command {
  constructor(db) {
    const { values } = parseArgs({
      options: {
        l: { type: "boolean" },
        d: { type: "boolean" },
        r: { type: "boolean" },
        e: { type: "boolean" },
      },
    });
    this.options = values;
    this.memoApp = new MemoApp(db);
  }

  async run() {
    if (this.isAdd()) {
      await this.memoApp.add();
    } else if (this.isList()) {
      await this.memoApp.list();
    } else if (this.isRead()) {
      await this.memoApp.read();
    } else if (this.isEdit()) {
      await this.memoApp.edit();
    } else if (this.isDelete()) {
      await this.memoApp.delete();
    }
  }

  isAdd() {
    return (
      !this.options.l && !this.options.r && !this.options.e && !this.options.d
    );
  }

  isList() {
    return this.options.l;
  }

  isRead() {
    return this.options.r;
  }

  isEdit() {
    return this.options.e;
  }

  isDelete() {
    return this.options.d;
  }
}
