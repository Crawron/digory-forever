import { Insertable } from "kysely"
import { db } from "./connection"

export interface PetsTable {
	id: string
	recorded_at: number
	from_id: string
	response: string
}

export type NewPet = Insertable<PetsTable>

db.schema.createTable("Pets").ifNotExists()
	.addColumn("id", "text", cb => cb.primaryKey())
	.addColumn("recorded_at", "text", cb => cb.notNull())
	.addColumn("from_id", "text", cb => cb.notNull())
	.addColumn("response", "text", cb => cb.notNull())
	.execute()

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

