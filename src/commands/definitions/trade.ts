import { ApplicationCommandOptionType, GuildMember } from "discord.js"
import { CommandDefinition } from "../handler"
import { appendTrade, getLedgerResults, Trade } from "../../database/ledger"
import { config } from "../../config"
import { nanoid } from "nanoid"

export const tradeCommand: CommandDefinition = {
	definition: {
		name: "trade",
		description: "Register a garnet trade, or any other garnet transactions",
		defaultMemberPermissions: ["Administrator"],
		options: [
			{
				name: "from",
				description: "Who's sending garnets. Give a host to take from bank",
				type: ApplicationCommandOptionType.User,
				required: true,
			},
			{
				name: "to",
				description: "Who's recieving garnets. Give a host to give to bank",
				type: ApplicationCommandOptionType.User,
				required: true,
			},
			{
				name: "amount",
				description: "How much to transfer",
				type: ApplicationCommandOptionType.Integer,
				required: true,
				min_value: 0,
			},
			{
				name: "reason",
				description: "A description of this trade. For clarification in logs",
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: "link",
				description:
					"Link to a confirmation message, for trades between players",
				type: ApplicationCommandOptionType.String,
			},
		],
	},

	async handle(int) {
		const reply = await int.deferReply()

		let from = int.options.getMember("from") as GuildMember | null
		const fromHost = from?.permissions.has("Administrator")

		let to = int.options.getMember("to") as GuildMember | null
		const toHost = to?.permissions.has("Administrator")

		let amount = int.options.get("amount", true).value
		let reason = int.options.get("reason", true).value
		let link = int.options.get("link")?.value

		const host = int.user.id

		// existence check
		if (!from || !to || !amount || !reason)
			return reply.edit("Missing or empty option")

		amount = Number(amount)
		reason = String(reason)
		link = link ? String(link) : undefined

		const garnetCounts = await getLedgerResults()

		const fromBalance = fromHost ? Infinity : garnetCounts.get(from.id) ?? 0

		if (fromBalance < amount)
			return reply.edit(
				`${from} does not have enough garnets for this transaction. ( ${fromBalance} / ${amount} )`
			)

		const goodTrade = (
			await appendTrade({
				id: nanoid(6),
				recorded_at: Date.now(),
				host_id: host,
				from_id: fromHost ? "BANK" : from.id,
				to_id: toHost ? "BANK" : to.id,
				amount,
				reason,
				link: link ?? null,
			})
		)

		if (goodTrade) {
			await reply.edit({
				content: renderTradeFull(goodTrade),
				allowedMentions: { parse: [] },
			})
		} else {
			reply.edit("Something went wrong when recording the trade")
		}
	},
}

function renderTradeFull(trade: Trade) {
	const fromEmoji = config.emojiMap?.[trade.from_id] ?? "⚪"
	const from =
		trade.from_id === "BANK"
			? `<:hostDigory:1141243154734002307> Bank`
			: `${fromEmoji} <@${trade.from_id}>`

	const toEmoji = config.emojiMap?.[trade.to_id] ?? "⚪"
	const to =
		trade.to_id === "BANK"
			? `<:hostDigory:1141243154734002307> Bank`
			: `${toEmoji} <@${trade.to_id}>`

	const hostEmoji = config.emojiMap?.[trade.host_id] ?? "⚪"
	const host = `${hostEmoji} <@${trade.host_id}>`

	return [
		"_ _",
		`**➡️ ${from} to ${to} for \`${trade.amount}\` garnets**`,
		" ",
		`> ${trade.reason}`,
		" ",
		trade.link && `- [Confirmation message](${trade.link})`,
		`- Recorded by ${host} at <t:${Math.floor(trade.recorded_at / 1000)}:R>`,
	]
		.filter((l) => !!l)
		.join("\n")
}

export const garnetCountCommand: CommandDefinition = {
	definition: {
		name: "garnet-counts",
		description: "Show current garnet count of all people in the ledger",
		defaultMemberPermissions: ["Administrator"],
	},

	async handle(int) {
		const reply = await int.deferReply()

		const garnetCounts = [...(await getLedgerResults()).entries()].sort(
			([, a], [, b]) => b - a
		)
		const totalBalance = garnetCounts.reduce((a, [, b]) => a + b, 0)

		const list: string[] = []

		for (const [i, [id, balance]] of garnetCounts.entries()) {
			const emoji = config.emojiMap?.[id] ?? "⚪"
			list.push(`${i + 1}. ${emoji} <@${id}> - \`${balance}\``)
		}

		reply.edit({
			content: [
				"## Garnet counts",
				" ",
				...list,
				" ",
				`*Total count ${totalBalance}*`,
			].join("\n"),
			allowedMentions: { parse: [] },
		})
	},
}

