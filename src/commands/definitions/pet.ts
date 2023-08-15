import { arrRand } from "../../helpers.js"
import { CommandDefinition } from "../handler.js"

export const petCommand: CommandDefinition = {
	definition: { name: "pet", description: "Pet the dog" },
	async handle(int) {
		const barks = ["Bark", "Woof", "Bork", "Arf", "Wof", "Worf", "Woff"]
		const hearts = "💖 💕 💓 🧡 💜 💙 💚 💛 💝 🐕 🦴".split(" ")

		const heart: string = arrRand(hearts) ?? "💖"

		await int.reply({
			content: `# *${arrRand(barks)}!* ${heart}`,
			fetchReply: true,
		})
	},
}
