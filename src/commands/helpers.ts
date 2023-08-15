import { CategoryChannel, Channel, ChannelType, Role } from "discord.js"

/** Get the ids of all channels within that category */
export function expandCategory(category: CategoryChannel) {
	return category.children.valueOf().map((c) => c.id)
}

/** Get all users asigned to a role */
export function expandRole(role: Role) {
	return [...role.members.values()]
}
