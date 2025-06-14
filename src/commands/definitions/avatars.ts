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
					`${u} ${u.username}\n<${u.avatarURL({ extension: "png", size: 1024 }) ?? u.defaultAvatarURL
					}>`
			).join("\n")

		if (avatars.length > 2000) {
			console.log(avatars)
			reply.edit("Sent to console 🦴")
		}
		else {
			await reply.edit({
				content: avatars,
				allowedMentions: { users: [] },
			})
		}
	},
}
