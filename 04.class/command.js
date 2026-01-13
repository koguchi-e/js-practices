import { parseArgs } from "node:util";

export class Command {
  constructor() {
    const { values } = parseArgs({
      options: {
        l: { type: "boolean" },
        d: { type: "boolean" },
        r: { type: "boolean" },
      },
    });
    this.values = values;
  }

  isAdd() {
    return !this.values.l && !this.values.d && !this.values.r;
  }

  isList() {
    return this.values.l;
  }

  isDelete() {
    return this.values.d;
  }

  isRead() {
    return this.values.r;
  }
}
