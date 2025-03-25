export type Cell = {
	up: boolean
	down: boolean
	left: boolean
	right: boolean
}

export const printCell = (cell: Cell) =>
	[
		cell.up ? "U" : " ",
		cell.down ? "D" : " ",
		cell.left ? "L" : " ",
		cell.right ? "R" : " ",
	].join("")

export const openCell = { up: true, down: true, left: true, right: true }
export const closedCell = { up: false, down: false, left: false, right: false }

export type Maze = {
	cells: Cell[][]
	getCell: (x: number, y: number) => Cell | undefined
	width: number
	height: number
}

export function printMazeDebug(maze: Maze) {
	return maze.cells.map((row) => row.map(printCell).join("|")).join("\n")
}
