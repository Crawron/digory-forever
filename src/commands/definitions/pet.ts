import { nanoid } from "nanoid"
import { arrRand } from "../../helpers.js"
import { appendPet } from "../../database/pets.js"
import { CommandDefinition } from "../handler.js"

export const petCommand: CommandDefinition = {
	definition: { name: "pet", description: "Pet the dog" },
	async handle(int) {
		const barks = ["Bark", "Woof", "Bork", "Arf", "Wof", "Worf", "Woff"]
		const hearts = "💖 💕 💓 🧡 💜 💙 💚 💛 💝 🐕 🦴".split(" ")

		const heart: string = arrRand(hearts) ?? "💖"

		const response = `## *${arrRand(barks)}!* ${heart}`

		await appendPet({
			from_id: int.user.id,
			recorded_at: Date.now(),
			id: nanoid(),
			response,
		})

		await int.reply({
			content: response,
		})
	},
}

