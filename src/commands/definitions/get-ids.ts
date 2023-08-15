import {
	ApplicationCommandOptionType,
	CategoryChannel,
	Channel,
	ChannelType,
} from "discord.js"
import { CommandDefinition } from "../handler.js"
import { stringify as stringifyYaml } from "yaml"
import { config } from "../../config.js"

const mentionRegex = /<(@|#|@&|@!)\d+>/g

const chType = (channelType: ChannelType) => {
	const typeMap: Record<ChannelType, string> = {
		"0": "Text",
		"1": "DM",
		"2": "Voice",
		"3": "Group DM",
		"4": "Category",
		"5": "Announcement",
		"10": "Announcement Thread",
		"11": "Public Thread",
		"12": "Private Thread",
		"13": "Stage",
		"14": "Directory",
		"15": "Forum",
	}

	return typeMap[channelType]
}

export const getIdsCommand: CommandDefinition = {
	definition: {
		name: "get-ids",
		description: "Get a list of IDs from the mentions in the input",
		defaultMemberPermissions: ["Administrator"],
		options: [
			{
				name: "input",
				type: ApplicationCommandOptionType.String,
				description: "Set of mentions to extract IDs from",
				required: true,
			},
		],
	},

	async handle(int) {
		const input = String(int.options.get("input")?.value ?? "")
		const mentions = input.match(mentionRegex) ?? []
		const ids = mentions.map((m) => m.replace(/[^\d]+/g, ""))

		await int.reply({
			content: `${mentions
				.map((m, i) => `${i + 1}. ${m}`)
				.join("\n")}\n\`\`\`\n${ids.join(",\n")}\`\`\``,
			ephemeral: true,
			allowedMentions: { parse: [] },
		})
	},
}

export const explodeCommand: CommandDefinition = {
	definition: {
		name: "explode-category",
		description: "List all subchannels of a category",
		defaultMemberPermissions: ["Administrator"],
		options: [
			{
				name: "category",
				type: ApplicationCommandOptionType.Channel,
				channelTypes: [ChannelType.GuildCategory],
				description: "Category to explode",
				required: true,
			},
		],
	},

	handle(int) {
		const channel = int.options.get("category", true).channel

		if (!(channel instanceof CategoryChannel)) {
			int.reply("Channel is not a category channel")
			return
		}

		const children: Channel[] = []

		for (const child of channel.children.valueOf().values())
			children.push(child)

		int.reply({
			content:
				`${channel}\n\`\`\`yaml\n` +
				children
					.map(
						(c) =>
							`- "${c.id}"\t#${c.type !== ChannelType.DM && c.name} (${chType(
								c.type
							)})`
					)
					.join("\n") +
				`\`\`\``,
			ephemeral: true,
		})
	},
}

export const checkConfigCommand: CommandDefinition = {
	definition: {
		name: "check-config",
		description: "Print the current config",
		defaultMemberPermissions: ["Administrator"],
	},

	handle(int) {
		int.reply({
			content: `\`\`\`yaml\n${stringifyYaml(config)}\`\`\``,
			ephemeral: true,
		})
	},
}
