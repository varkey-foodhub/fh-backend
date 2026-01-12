import Database from "better-sqlite3";

export const db = new Database("app.db");

db.pragma("journal_mode = WAL");

export default db