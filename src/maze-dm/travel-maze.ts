import { Maze, closedCell } from "./maze"

export function travelMaze(
	maze: Maze,
	position: { x: number; y: number },
	path: string
) {
	let { x, y } = position

	function nextMove(direction: string) {
		let currentCell = maze.getCell(x, y) ?? closedCell
		if (direction === "U")
			return {
				pos: { x: x, y: y - 1 },
				open: currentCell.up,
			}
		if (direction === "D")
			return {
				pos: { x: x, y: y + 1 },
				open: currentCell.down,
			}
		if (direction === "L")
			return {
				pos: { x: x - 1, y: y },
				open: currentCell.left,
			}
		else
			return {
				pos: { x: x + 1, y },
				open: currentCell.right,
			} // "R"
	}

	for (const [i, direction] of [...path.toUpperCase()].entries()) {
		let next = nextMove(direction)
		if (next.open) {
			x = next.pos.x
			y = next.pos.y
		} else {
			return { failedStep: i + 1 }
		}
	}

	return { x, y }
}
