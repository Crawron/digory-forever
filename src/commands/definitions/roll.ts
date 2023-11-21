import { ApplicationCommandOptionType } from "discord.js"
import { CommandDefinition } from "../handler"

export const rollCommand: CommandDefinition = {
	definition: {
		name: "roll",
		description: "Roll a die",
		options: [
			{
				name: "sides",
				type: ApplicationCommandOptionType.Number,
				description: "How many sided die to roll",
				minValue: 1,
			},
		],
	},

	handle(int) {
		const sides = parseInt(String(int.options.get("sides")?.value ?? "6"))
		const roll = Math.ceil(Math.random() * sides)

		int.reply(`🎲 d${sides}: \`${roll}\``)
	},
}
