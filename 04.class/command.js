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
