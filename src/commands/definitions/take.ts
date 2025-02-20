import { ApplicationCommandOptionType } from "discord.js"
import { arrRand } from "../../helpers"
import { CommandDefinition } from "../handler"

export const takeCommand: CommandDefinition = {
	definition: {
		name: "take",
		description:
			"Take a random assortment of 'count' pieces between Fire, Water, Earth and Air",
		options: [
			{
				name: "count",
				type: ApplicationCommandOptionType.Integer,
				minValue: 0,
				maxValue: 4,
				description: "How many pieces to take",
				required: true,
			},
		],
	},

	handle(int) {
		const count = parseInt(int.options.get("count")?.value?.toString() ?? "-1")
		if (count < 0 || count == null) {
			return int.reply(
				`Incorrect count to take \`${count}\` :service_dog::grey_question:`
			)
		}

		const elements = ["🔥 Fire", "🌊 Water", "⛰️ Earth", "🌪️ Air"] as const
		const takes = new Array(count)
			.fill(0)
			.map((_) => `- **${arrRand(elements)}**`)
			.join("\n")

		int.reply(`${int.user} takes\n${takes}`)
	},
}
