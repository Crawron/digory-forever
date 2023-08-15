import { ApplicationCommandOptionType } from "discord.js"
import { arrRand, isTruthy } from "../../helpers"
import { CommandDefinition } from "../handler"

export const pickCommand: CommandDefinition = {
	definition: {
		name: "pick",
		description: "Pick a random item from a list of comma separated options",
		options: [
			{
				name: "options",
				type: ApplicationCommandOptionType.String,
				description: "List of options to pick from, comma separated",
				required: true,
			},
		],
	},

	handle(int) {
		const optionsString = String(int.options.get("options")?.value ?? "")
		const options = optionsString
			.split(",")
			.map((o) => o.trim())
			.filter(isTruthy)
		const pick = arrRand(options)

		if (!pick)
			return int.reply(
				"Couldn't find anything to pick from :service_dog::grey_question:"
			)

		int.reply(
			`Between: ${options
				.map((o) => `\`${o}\``)
				.join(", ")}:\n- Pick \`${pick}\` 🦴`
		)
	},
}
