import {
	ApplicationCommandOptionType,
	ChannelType,
	GuildBasedChannel,
	NewsChannel,
	TextChannel,
} from "discord.js"
import { config } from "../../config"
import { CommandDefinition } from "../handler"
import { isTruthy } from "../../helpers"

export const announceCommand: CommandDefinition = {
	definition: {
		name: "announce",
		description:
			"Send a message to all configured channels. (`announcementTargets`)",
		defaultMemberPermissions: ["Administrator"],
		options: [
			{
				name: "message",
				description: "Message to send",
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
	async handle(int) {
		const message = int.options.get("message")?.value?.toString().trim()
		if (!message) return int.reply("No message provided")

		const targets = config.announcementTargets
			.map((cid) => int.client.channels.resolve(cid))
			.filter(isTruthy)
			.filter((c): c is GuildBasedChannel => !c.isDMBased())
			.filter(
				(c): c is TextChannel | NewsChannel => c.type === ChannelType.GuildText
			)

		const reply = await int.reply(`⏳ Sending announcement to ${targets.length} channels:\n> ${message}`)

		for (const target of targets) await target.send(message)

		reply.edit(`✅ Sent announcement to ${targets.length} channels:\n> ${message}`)
	},
}
