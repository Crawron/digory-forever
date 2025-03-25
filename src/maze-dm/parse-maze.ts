import { Cell, Maze, closedCell } from "./maze"

export function parseMaze(input: string): Maze {
	if (/[^ULDR| \n]/i.test(input))
		throw new Error(
			"invalid character in maze description. only ULDR, |, spaces and line breaks allowed. " +
				`(Found: ${/[^ULDR| \n]/gi.exec(input)?.join(", ")})`
		)

	const cellStrs = input
		.trim()
		.toUpperCase()
		.split("\n")
		.map((i) => i.split("|"))

	const cells: Maze["cells"] = []
	for (const cellRow of cellStrs) {
		const row: Cell[] = []
		for (const cell of cellRow) {
			row.push({
				up: cell.includes("U"),
				down: cell.includes("D"),
				left: cell.includes("L"),
				right: cell.includes("R"),
			})
		}
		cells.push(row)
	}

	// sanity check
	const rowLengths = cells.map((row) => row.length).sort()
	if ([...rowLengths].pop() !== [...rowLengths].shift())
		throw new Error(
			"decoded maze is not a rectangle or square. at least one of the rows is uneven"
		)

	// more sanity check
	if (rowLengths.some((r) => r < 1)) throw new Error("some rows are empty!")
	if (rowLengths.length < 1) throw new Error("there's no rows!")

	const width = rowLengths[0] ?? 1
	const height = rowLengths.length

	return {
		cells,
		width,
		height,
		getCell: (x, y) => cells[y]?.[x],
	}
}
