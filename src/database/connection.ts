import SQLite from "better-sqlite3"
import { Generated, Selectable, Insertable, Kysely, SqliteDialect } from "kysely"
import { PetsTable } from "./pets"
import { LedgerTable } from "./ledger"
import { env } from "../env"
import path from "path"

export interface Database {
	Ledger: LedgerTable
	Pets: PetsTable
}

// Dialect and connection

const dialect = new SqliteDialect({
	database: new SQLite(path.join(env.DATA_DIR, "garnets.sqlite")),
})
export const db = new Kysely<Database>({ dialect })



