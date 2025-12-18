#!/usr/bin/env node

import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

// エラーなし
function successFlow() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      db.run(
        "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)",
        (err) => {
          if (err) return reject(err);

          const stmt = db.prepare("INSERT INTO books (title) VALUES (?)");

          stmt.run(["走れメロス"], function (err) {
            if (err) return reject(err);

            stmt.run(["こころ"], function (err) {
              if (err) return reject(err);

              stmt.run(["山月記"], function (err) {
                stmt.finalize();
                if (err) return reject(err);

                db.all(
                  "SELECT id, title FROM books ORDER BY id",
                  (err, rows) => {
                    db.run("DROP TABLE books", (err) => {
                      if (err) return reject(err);
                      resolve(rows);
                      // reject(err);
                    });
                  },
                );
              });
            });
          });
        },
      );
    }, 1000);
  });
}

successFlow()
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row.id + ": " + row.title);
    });
  })
  .catch((err) => {
    console.error("失敗", err.message);
  });
