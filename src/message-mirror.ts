import { Message } from "discord.js"
import chroma from "chroma-js"
import { isTruthy } from "./helpers.js"
import { config } from "./config.js"

export const mirrorTargetKey = "mirrorTarget"
export const mirrorSourceKey = "mirrorSource"

type MirrorMessage = {
	first?: boolean
	channelId: string
	timestamp: number
	emoji: string
	authorId: string
	content: string
	url: string
	attachment: boolean
	/* edited?: boolean
	deleted?: boolean
	 */
}

async function createMirrorMessage(message: Message): Promise<MirrorMessage> {
	const emoji = config.emojiMap?.[message.author.id] ?? "⚪"

	return {
		channelId: message.channelId,
		timestamp: Math.floor(message.createdTimestamp / 1000),
		emoji,
		content: message.content,
		authorId: message.author.id,
		url: message.url,
		attachment: message.attachments.size > 0,
	}
}

type MirrorBunch = {
	color: number
	id: string
	timestamp: number
	url: string
	messages: MirrorMessage[]
}

const colorMap = new Map<string, number>()
function bunchMessages(messages: MirrorMessage[]): MirrorBunch[] {
	const bunches: MirrorBunch[] = []

	let lastChannel = ""
	let lastAuthor = ""
	let currentBunch: MirrorBunch | null = null

	for (const message of messages) {
		if (lastChannel !== message.channelId) {
			if (currentBunch) bunches.push(currentBunch)

			if (!colorMap.has(message.channelId)) {
				const newColor = chroma.hsl(Math.random() * 360, 1, 0.7).num()
				colorMap.set(message.channelId, newColor)
			}

			currentBunch = {
				color: colorMap.get(message.channelId) ?? 0,
				id: message.channelId,
				timestamp: message.timestamp,
				messages: [],
				url: message.url,
			}
			lastAuthor = ""
		}

		if (lastAuthor !== message.authorId) message.first = true

		currentBunch?.messages.push(message)

		lastChannel = message.channelId
		lastAuthor = message.authorId
	}

	if (currentBunch) bunches.push(currentBunch)
	return bunches
}

function renderMessage({
	timestamp,
	emoji,
	authorId,
	first,
	content,
	attachment,
	url,
}: MirrorMessage): string {
	const header = `\n${emoji} <@${authorId}> <t:${timestamp}:t>\n`

	return [first && header, content, attachment && ` [[Attachment]](${url})`]
		.filter(isTruthy)
		.join("")
}

function renderBunch({ id, timestamp, url, messages, color }: MirrorBunch): {
	description: string
	color: number
} {
	const header = `<#${id}> <t:${timestamp}:D> [Scroll here](${url})\n\n`
	const content = messages.map(renderMessage).join("\n").trim()

	return { description: [header, content].filter(isTruthy).join(""), color }
}

//

const messages = new Map<string, MirrorMessage>()
let targetMessage: Message | null = null

export async function handleMirror(message: Message) {
	if (message.author.bot) return

	const mirrorSources = config.mirrorSources
	if (!mirrorSources.includes(message.channelId)) return

	const targetMirror = config.mirrorDestination
	if (!targetMirror) return

	messages.set(message.id, await createMirrorMessage(message))
	let bunches = bunchMessages([...messages.values()]).map(renderBunch)

	const descriptionLimit = bunches.some((b) => b.description.length > 4096)
	const embedLimit = bunches.length > 10
	const totalLimit =
		bunches.reduce((a, b) => a + b.description.length, 0) > 6000

	if (descriptionLimit || embedLimit || totalLimit) {
		messages.clear()
		messages.set(message.id, await createMirrorMessage(message))
		bunches = bunchMessages([...messages.values()]).map(renderBunch)
		targetMessage = null
	}

	const messageToSend = {
		embeds: bunches,
	}

	if (!targetMessage) {
		const { client } = message
		const targetChannel =
			client.channels.cache.get(targetMirror) ??
			(await client.channels.fetch(targetMirror))

		if (!targetChannel || !targetChannel.isTextBased()) return

		targetMessage = await targetChannel.send(messageToSend)
	} else {
		targetMessage.edit(messageToSend)
	}
}
