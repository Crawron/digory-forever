import knex from "knex"

const db = knex({
	client: "sqlite3",
	connection: {
		filename: "./data/garnets.sqlite",
	},
})

export type Trade = {
	id: string
	recorded_at: number
	host_id: string
	from_id: string
	to_id: string
	amount: number
	reason: string
	link: string | null
}

function createLedgerTable() {
	return db.schema.createTable("Ledger", (table) => {
		table.string("id").notNullable().primary()
		table.timestamp("recorded_at").notNullable()
		table.string("host_id").notNullable()
		table.string("from_id").notNullable()
		table.string("to_id").notNullable()
		table.integer("amount").notNullable()
		table.text("reason").notNullable()
		table.text("link")
	})
}

if (!(await db.schema.hasTable("Ledger"))) {
	await createLedgerTable()
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export async function appendTrade(trade: Trade) {
	const insertedTrade = await db
		.insert<string, Trade[]>(trade, "*")
		.into("Ledger")

	console.log({ insertedTrade })

	return insertedTrade
}

export async function getLedgerResults() {
	const countMap = new Map([["BANK", Infinity]])

	const ledger = await db.table<Trade>("Ledger")

	for (const trade of ledger) {
		const fromBalance = countMap.get(trade.from_id) ?? 0
		const toBalance = countMap.get(trade.to_id) ?? 0

		countMap.set(trade.from_id, fromBalance - trade.amount)
		countMap.set(trade.to_id, toBalance + trade.amount)
	}

	countMap.delete("BANK")
	return countMap
}

//  Pet

export type Pet = {
	id: string
	recorded_at: number
	from_id: string
	response: string
}

function createPetTable() {
	return db.schema.createTable("Pets", (table) => {
		table.string("id").notNullable().primary()
		table.timestamp("recorded_at").notNullable()
		table.string("from_id").notNullable()
		table.string("response").notNullable()
	})
}

if (!(await db.schema.hasTable("Pets"))) {
	await createPetTable()
}

export async function appendPet(pet: Pet) {
	const inserted = await db.insert<string, Pet[]>(pet, "*").into("Pets")

	return inserted
}

export async function getPets() {
	return await db.table<Pet>("Pets")
}

export async function getPetsCount() {
	const countMap = new Map<string, number>()

	const pets = await db.table<Pet>("Pets")
	for (const pet of pets) {
		const count = countMap.get(pet.from_id) ?? 0
		countMap.set(pet.from_id, count + 1)
	}

	return countMap
}
