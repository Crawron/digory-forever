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

const discordClient = new Client({
	intents: ["GuildMessages", "Guilds", "MessageContent", "GuildMembers"],
})

discordClient.on("ready", () => console.info("🦮 Ready"))
discordClient.on("messageCreate", handleMirror)

handleCommands(discordClient, env.DISCORD_SERVER_ID, [
	petCommand,
	pickCommand,
	restartCommand,
	getIdsCommand,
	explodeCommand,
	checkConfigCommand,
	announceCommand,
	avatarsCommand,
])

discordClient.login(env.DISCORD_BOT_TOKEN)
