import { Message, ChannelType } from "discord.js"
import { Maze } from "./maze"
import { travelMaze } from "./travel-maze"
import {
	greenMaze,
	pinkMaze,
	testGreenMaze,
	testPinkMaze,
} from "./maze-definitions"

let dmOngoing = false

type Vec2 = { x: number; y: number }

export function printPosition({ x, y }: Vec2) {
	const theAlphabet = "ABCDEFGHIJ".split("")
	const column = theAlphabet[x]

	return `${column ?? "?"}${y + 1}`
}

type Player = {
	name: string
	pos: Vec2
	path: string
	moveRefresh: number
	home: { x: number; y: number }
	corners: { tl: boolean; tr: boolean; bl: boolean; br: boolean }
	maze: Maze
}

const whims: Player = {
	name: "whims",
	pos: { x: 0, y: 9 },
	path: "",
	moveRefresh: 0,
	home: { x: 0, y: 9 },
	corners: { tl: false, tr: false, bl: true, br: false },
	maze: pinkMaze,
}

const wimpz: Player = {
	name: "wimpz",
	pos: { x: 9, y: 0 },
	path: "",
	moveRefresh: 0,
	home: { x: 9, y: 0 },
	corners: { tl: false, tr: true, bl: false, br: false },
	maze: greenMaze,
}

const redst: Player = {
	name: "redst",
	pos: { x: 0, y: 9 },
	path: "",
	moveRefresh: 0,
	home: { x: 0, y: 9 },
	corners: { tl: false, tr: false, bl: true, br: false },
	maze: testPinkMaze,
}

const craww: Player = {
	name: "craww",
	pos: { x: 9, y: 0 },
	path: "",
	moveRefresh: 0,
	home: { x: 9, y: 0 },
	corners: { tl: false, tr: true, bl: false, br: false },
	maze: testGreenMaze,
}

const players: Record<string, Player> = {
	"144505214970363905": wimpz,
	"306489597024796672": whims,
}

const second = 1000

const messageImage =
	"https://media.discordapp.net/attachments/1002711688526704856/1093826353838702602/image.png"

export function processDmc(message: Message) {
	if (message.channel.type === ChannelType.GroupDM) return
	if (message.channelId !== "1091079647028052061") return
	if (message.content === "") return
	if (message.author.bot) return

	if (
		!dmOngoing &&
		(message.author.id === "109677308410875904" ||
			message.author.id === "141189864287633408")
	) {
		if (message.content !== "!startdmc") return
		if (dmOngoing) return
		dmOngoing = true
		message.reply(
			`<@&1005525681385508864> **DMC has started!** Your initial positions are **\`${printPosition(
				whims.pos
			)}\`** for Whims 💜, and **\`${printPosition(
				wimpz.pos
			)}\`** for Wimp 💚\n\n Good luck! 🦴\n\n${messageImage}`
		)
		console.log("DMC STARTED. Players: ", players)
		return
	}

	if (!dmOngoing) return
	if (/[^ULDR]/i.test(message.content.trim().toUpperCase())) return

	const player = players[message.author.id]
	if (!player) return

	if (player.moveRefresh > message.createdTimestamp) {
		console.log(
			`cooldown block for ${player.name}: ${player.moveRefresh} > ${message.createdTimestamp
			} (${player.moveRefresh - message.createdTimestamp})`
		)
		message.reply(
			`You're still in cooldown, it ends <t:${Math.round(
				player.moveRefresh / 1000
			)}:R>`
		)
		return
	}

	console.log({ processingPlayer: player })

	const path = message.content.trim().toUpperCase().replaceAll(/[ ]/g, "")
	console.log(
		`Travelling: ${player.name}: ${message.content.trim().toUpperCase()}`
	)

	const result = travelMaze(player.maze, player.pos, path)
	if (result.failedStep != null) {
		player.moveRefresh = message.createdAt.valueOf() + 35 * second

		setTimeout(() => {
			message.reply("Your cooldown is over!")
			if (dmOngoing) console.log(`Cooldown for ${player.name} ended`)
		}, player.moveRefresh - Date.now())
		message.reply(
			`This submission bonks, you remain at \`${printPosition(
				player.pos
			)}\`. Your cooldown ends <t:${Math.round(player.moveRefresh / 1000)}:R>`
		)
		console.log(
			`Travel failed at step ${result.failedStep}\n${path}\n${"^".padStart(
				result.failedStep
			)}`
		)
	} else if (result.x != null) {
		// good travel
		player.moveRefresh = message.createdAt.valueOf() + 25 * second
		player.pos.x = result.x
		player.pos.y = result.y
		player.path += path

		setTimeout(() => {
			message.reply("Your cooldown is over!")
			if (dmOngoing) console.log(`Cooldown for ${player.name} ended`)
		}, player.moveRefresh - Date.now())

		message.reply(
			`Move successful! Your new position is \`${printPosition(
				player.pos
			)}\`. Your cooldown ends <t:${Math.round(player.moveRefresh / 1000)}:R>`
		)

		console.log(
			`Traveled to ${printPosition(player.pos)} [${result.x}, ${result.y}]`
		)
	}

	const { pos, maze } = player

	if (pos.x === 0 && pos.y === 0) player.corners.tl = true
	if (pos.x === maze.width - 1 && pos.y === 0) player.corners.tr = true
	if (pos.x === 0 && pos.y === maze.height - 1) player.corners.bl = true
	if (pos.x === maze.width - 1 && pos.y === maze.height - 1)
		player.corners.br = true

	// win check
	if (
		player.corners.tl &&
		player.corners.tr &&
		player.corners.bl &&
		player.corners.br &&
		player.pos.x === player.home.x &&
		player.pos.y === player.home.y
	) {
		dmOngoing = false

		message.channel.send(
			`Death match over! <@${message.author.id}> has visited all four corners of the maze and come back home 🏡`
		)
	}
}
