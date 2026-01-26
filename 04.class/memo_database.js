import sqlite3 from "sqlite3";

export class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("memo.db");
  }

  init() {
    return new Promise((resolve, reject) => {
      this.db.run(
        "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT NOT NULL)",
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  insert(body, callback) {
    const stmt = this.db.prepare("INSERT INTO memos (body) VALUES (?)");
    stmt.run(body, (err) => {
      stmt.finalize();
      callback(err);
    });
  }

  findAll(callback) {
    this.db.all("SELECT * FROM memos ORDER BY id", callback);
  }

  findMemoById(id, callback) {
    this.db.get("SELECT body FROM memos WHERE id = ?", [id], callback);
  }

  deleteMemoById(id, callback) {
    this.db.run("DELETE FROM memos WHERE id = ?", [id], callback);
  }

  updateMemoById(id, body, callback) {
    this.db.run("UPDATE memos SET body = ? WHERE id = ?", [body, id], callback);
  }

  close() {
    this.db.close();
  }
}
