import { Client } from "discord.js"
import { env } from "./env"
import { handleCommands } from "./commands/handler"
import { petCommand } from "./commands/definitions/pet"
import { pickCommand } from "./commands/definitions/pick"
import { restartCommand } from "./commands/definitions/restart"
import {
	explodeCommand,
	getIdsCommand,
	checkConfigCommand,
} from "./commands/definitions/get-ids"
import { announceCommand } from "./commands/definitions/announce"
import { handleMirror } from "./message-mirror"
import { avatarsCommand } from "./commands/definitions/avatars"
import { garnetCountCommand, tradeCommand } from "./commands/definitions/trade"
import { rollCommand } from "./commands/definitions/roll"

const discordClient = new Client({
	intents: [
		"GuildMessages",
		"Guilds",
		"MessageContent",
		"GuildMembers",
		"GuildMessageReactions",
	],
})

discordClient.on("ready", () => console.info("🦮 Ready"))
discordClient.on("messageCreate", handleMirror)
discordClient.on("messageReactionAdd", async (reaction, _) => {
	if (reaction.emoji.name !== "📌") return

	const message = await reaction.message.fetch(true)

	const hasEnoughReactions = message.reactions.cache.some(
		(r) => r.emoji.name === "📌" && r.count >= 2
	)

	if (hasEnoughReactions) message.pin("Pin reactions")
	else message.unpin()
})

handleCommands(discordClient, env.DISCORD_SERVER_ID, [
	petCommand,
	pickCommand,
	restartCommand,
	getIdsCommand,
	explodeCommand,
	checkConfigCommand,
	announceCommand,
	avatarsCommand,
	// tradeCommand,
	// garnetCountCommand,
	rollCommand,
])

discordClient.login(env.DISCORD_BOT_TOKEN)
