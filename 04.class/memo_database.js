import sqlite3 from "sqlite3";

export class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("memo.db");
  }
  init(callback) {
    this.db.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT NOT NULL)",
      callback,
    );
  }
  insert(body, callback) {
    const stmt = this.db.prepare("INSERT INTO memos (body) VALUES (?)");
    stmt.run(body, callback);
    stmt.finalize();
  }
  findAll(callback) {
    this.db.all("SELECT * FROM memos", callback);
  }
  findMemoById(id, callback) {
    this.db.get("SELECT body FROM memos WHERE id = ?", [id], callback);
  }
  deleteById(id, callback) {
    this.db.run("DELETE FROM memos WHERE id = ?", [id], callback);
  }
  close() {
    this.db.close();
  }
}
