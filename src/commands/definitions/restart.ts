import { CommandDefinition } from "../handler.js"

export const restartCommand: CommandDefinition = {
	definition: {
		name: "restart",
		description: "Restart the bot",
		defaultMemberPermissions: ["Administrator"],
	},

	async handle(int) {
		console.info("🔁 Prompted to restart, restarting...")
		await int.reply("*Restarting...*")
		process.exit(1)
	},
}
