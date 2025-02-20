import {
	ApplicationCommandDataResolvable,
	ApplicationCommandType,
	Client,
	ChatInputCommandInteraction,
} from "discord.js"

export type CommandDefinition = {
	handle: (int: ChatInputCommandInteraction) => void | Promise<unknown>
	definition: ApplicationCommandDataResolvable
}

export async function handleCommands(
	djsClient: Client,
	guildId: string,
	commands: CommandDefinition[]
) {
	const idMap = new Map<string, CommandDefinition["handle"]>()

	djsClient.once("ready", async () => {
		const remoteCommands = await djsClient.guilds.cache
			.get(guildId)
			?.commands.set(commands.map((c) => c.definition))
			.catch(console.error)

		for (const [i, remote] of [...(remoteCommands?.values() ?? [])].entries()) {
			const handler = commands[i]?.handle
			if (handler) idMap.set(remote.id, handler)
		}

		const commandNames = remoteCommands
			?.map(
				(c) =>
					`${c.type === ApplicationCommandType.ChatInput ? "/" : ""}${c.name}`
			)
			.join(" ")

		console.log(
			`📝 Registered ${remoteCommands?.size || "no"} commands. ${commandNames ?? ""
			}`
		)
	})

	djsClient.on("interactionCreate", (int) => {
		if (!int.isChatInputCommand()) return

		try {
			idMap.get(int.commandId)?.(int)
		} catch (e) {
			console.error(`❌ ${e}`)
		}
	})
}
