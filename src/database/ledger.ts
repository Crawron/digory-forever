import { Generated, Insertable, Selectable } from "kysely"
import { db } from "./connection"

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
