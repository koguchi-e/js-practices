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

  insert(body) {
    return new Promise((resolve, reject) => {
      this.db.run("INSERT INTO memos (body) VALUES (?)", [body], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  findAll() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM memos ORDER BY id", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  findMemoById(id) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT body FROM memos WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  deleteMemoById(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM memos WHERE id = ?", [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  updateMemoById(id, body) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE memos SET body = ? WHERE id = ?",
        [body, id],
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

  closeDatabase() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
