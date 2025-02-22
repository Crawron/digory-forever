import SQLite from "better-sqlite3"
import { Generated, Selectable, Insertable, Kysely, SqliteDialect } from "kysely"
import { env } from "./env"
import path from "path"

//          Definitions

export interface Database {
	Ledger: LedgerTable
	Pets: PetsTable
}

export interface LedgerTable {
	id: Generated<string>
	recorded_at: number
	host_id: string
	from_id: string
	to_id: string
	amount: number
	reason: string
	link: string | null
}

export type Trade = Selectable<LedgerTable>
export type NewTrade = Insertable<LedgerTable>

export interface PetsTable {
	id: string
	recorded_at: number
	from_id: string
	response: string
}

export type NewPet = Insertable<PetsTable>

const dialect = new SqliteDialect({
	database: new SQLite(path.join(env.DATA_DIR, "garnets.sqlite")),
})
const db = new Kysely<Database>({ dialect })

db.schema.createTable("Ledger").ifNotExists()
	.addColumn("id", "text", cb => cb.primaryKey())
	.addColumn("recorded_at", "text", cb => cb.notNull())
	.addColumn("host_id", "text", cb => cb.notNull())
	.addColumn("from_id", "text", cb => cb.notNull())
	.addColumn("to_id", "text", cb => cb.notNull())
	.addColumn("amount", "integer", cb => cb.notNull())
	.addColumn("reason", "text", cb => cb.notNull())
	.addColumn("link", "text")
	.execute()

db.schema.createTable("Pets").ifNotExists()
	.addColumn("id", "text", cb => cb.primaryKey())
	.addColumn("recorded_at", "text", cb => cb.notNull())
	.addColumn("from_id", "text", cb => cb.notNull())
	.addColumn("response", "text", cb => cb.notNull())
	.execute()

//          Trades

export async function appendTrade(trade: NewTrade) {
	const insertedTrade = await db
		.insertInto("Ledger")
		.values(trade)
		.returningAll()
		.executeTakeFirst()

	return insertedTrade
}

export async function getLedgerResults() {
	const countMap = new Map([["BANK", Infinity]])

	const ledger = await db.selectFrom("Ledger").selectAll().execute()

	for (const trade of ledger) {
		const fromBalance = countMap.get(trade.from_id) ?? 0
		const toBalance = countMap.get(trade.to_id) ?? 0

		countMap.set(trade.from_id, fromBalance - trade.amount)
		countMap.set(trade.to_id, toBalance + trade.amount)
	}

	countMap.delete("BANK")
	return countMap
}


//          Pets

export async function appendPet(pet: NewPet) {
	const inserted = await db.insertInto("Pets")
		.values(pet)
		.returningAll()
		.executeTakeFirst()

	return inserted
}

export async function getPets() {
	return await db.selectFrom("Pets").selectAll().execute()
}

export async function getPetsCount() {
	const countMap = new Map<string, number>()

	const pets = await db.selectFrom("Pets").selectAll().execute()
	for (const pet of pets) {
		const count = countMap.get(pet.from_id) ?? 0
		countMap.set(pet.from_id, count + 1)
	}

	return countMap
}
