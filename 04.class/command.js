import { parseArgs } from "node:util";

export class Command {
  constructor() {
    const { values } = parseArgs({
      options: {
        l: { type: "boolean" },
        d: { type: "boolean" },
        r: { type: "boolean" },
        e: { type: "boolean" },
      },
    });
    this.options = values;
  }

  isAdd() {
    return (
      !this.options.l && !this.options.d && !this.options.r && !this.options.e
    );
  }

  isList() {
    return this.options.l;
  }

  isDelete() {
    return this.options.d;
  }

  isRead() {
    return this.options.r;
  }

  isEdit() {
    return this.options.e;
  }
}
