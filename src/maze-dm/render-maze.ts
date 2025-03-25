import { Cell, Maze, openCell } from "./maze"

const walls = [
	// (open wall)
	// LR,    L,    R,    X
	["  ", " ─", "─ ", "──"], // TB
	["╷ ", "┌─", "┐ ", "┬─"], // T
	["╵ ", "└─", "┘ ", "┴─"], // B
	["│ ", "├─", "┤ ", "┼─"], // X
]

export function renderMaze(maze: Maze) {
	const { width, height } = maze

	let output = ""

	function getCell(x: number, y: number): Cell {
		if (x < 0 || x >= width) return openCell
		if (y < 0 || y >= height) return openCell

		return maze.getCell(x, y) ?? openCell
	}

	function getCornerWalls(x: number, y: number) {
		let verticalSprite = 3
		let horizontalSprite = 3

		const topLeftCell = getCell(x - 1, y - 1)
		const bottomRightCell = getCell(x, y)
		const topRightCell = getCell(x, y - 1)
		const bottomLeftCell = getCell(x - 1, y)

		if (topLeftCell.right && topRightCell.left) verticalSprite -= 2 // top open
		if (bottomLeftCell.right && bottomRightCell.left) verticalSprite -= 1 // bottom open
		if (topLeftCell.down && bottomLeftCell.up) horizontalSprite -= 2 // left open
		if (bottomRightCell.up && topRightCell.down) horizontalSprite -= 1 // right open

		return walls[verticalSprite]?.[horizontalSprite] ?? "??"
	}

	for (let y = 0; y < height + 1; y++) {
		for (let x = 0; x < width + 1; x++) {
			output += getCornerWalls(x, y)
		}
		output += "\n"
	}

	return output + "\n\n!!! ONE WAY WALLS NOT DISPLAYED !!!"
}
