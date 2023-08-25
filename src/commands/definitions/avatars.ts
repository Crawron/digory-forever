import { config } from "../../config"
import { isTruthy } from "../../helpers"
import { CommandDefinition } from "../handler"

export const avatarsCommand: CommandDefinition = {
	definition: {
		name: "avatars",
		description: "Get all avatars of configured list",
		defaultMemberPermissions: ["Administrator"],
	},
	async handle(int) {
		const reply = await int.deferReply()

		const avatars = (
			await Promise.all(
				config.avatarTargets.map((uid) => int.client.users.fetch(uid))
			)
		)
			.filter(isTruthy)
			.map(
				(u) =>
					`${u} <${
						u.avatarURL({ extension: "png", size: 1024 }) ?? u.defaultAvatarURL
					}>`
			)

		await reply.edit({
			content: avatars.join("\n"),
			allowedMentions: { users: [] },
		})
	},
}
