import sqlite3 from "sqlite3";
import { hashPassword, verifyPassword } from "./utils.js";

export function initializeDB() {
  const db = new sqlite3.Database("db.sqlite3");

  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      name TEXT,
      hash TEXT)`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS user_history_entries (id INTEGER PRIMARY KEY,
      ipv4_address TEXT,
      location TEXT,
      created_at TEXT,
      updated_at TEXT,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id))`
    );
  });

  db.close();
}

export async function addUser(email, name, password) {
  const db = new sqlite3.Database("db.sqlite3");
  const hash = await hashPassword(password);

  db.serialize(() => {
    const statement = db.prepare(
      "INSERT INTO users (email, name, hash) VALUES (?, ?, ?)"
    );
    statement.run(email, name, hash);
    statement.finalize(() => {
      db.close();
    });
  });
}

export async function verifyUser(email, password) {
  const db = new sqlite3.Database("db.sqlite3");

  return new Promise((resolve) => {
    db.serialize(() => {
      db.get("SELECT * FROM users WHERE email = ?", [email], async (_, row) => {
        const match = await verifyPassword(password, row.hash);
        db.close();

        resolve(row.id);
      });
    });
  });
}

export async function updateHistory(email, location, ipv4Address) {
  const db = new sqlite3.Database("db.sqlite3");

  db.serialize(() => {
    // get id from email
    db.get("SELECT id FROM users WHERE email = ?", [email], (_, row) => {
      if (!row) {
        db.close();
        return;
      }
      const userId = row.id;
      // check for an existing entry
      db.get(
        "SELECT id FROM user_history_entries WHERE ipv4_address = ? AND user_id = ?",
        [ipv4Address, userId],
        (_, entry) => {
          if (entry) {
            // update if exists
            db.run(
              "UPDATE user_history_entries SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
              [entry.id],
              () => {
                db.close();
                console.log("updated");
              }
            );
          } else {
            // insert if entry doesn't exist
            db.run(
              `INSERT INTO user_history_entries (ipv4_address, location, created_at, updated_at, user_id)
               VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
              [ipv4Address, location, userId],
              () => {
                db.close();
                console.log("new entry");
              }
            );
          }
        }
      );
    });
  });
}

export async function getHistory(email) {
  const db = new sqlite3.Database("db.sqlite3");

  return new Promise((resolve) => {
    db.get("SELECT id FROM users WHERE email = ?", [email], (_, row) => {
      if (!row) resolve([]);
      db.all(
        "SELECT * FROM user_history_entries WHERE user_id = ?",
        [row.id],
        (_, rows) => {
          db.close();
          resolve(rows);
        }
      );
    });
  });
}
