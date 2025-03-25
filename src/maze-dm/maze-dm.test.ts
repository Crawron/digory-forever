import { expect, test, vi } from "vitest"
import { parseMaze } from "./parse-maze"
import { printMazeDebug } from "./maze"
import { renderMaze } from "./render-maze"
import { travelMaze } from "./travel-maze"

const sampleMazeStr = `d  |dr |rl |rl |rld|rl |rl |ld
urd|ul |rd |rl |ul |rd |l  |ud
ur |ld |ur |ld |dr |ulr|lr |ul
rd |ulr|l  |ud |ur |ld |r  |ld
ud |rd |lr |ul |d  |ur |lr |udl
u  |ud |d  |rd |ulr|rl |rl |ul
rd |ul |ur |ulr|lr |ld |r  |ld
ur |lr |lr |lr |l  |ur |lr |lu`

test("Parse maze", () => {
	const maze = parseMaze(sampleMazeStr)

	expect(printMazeDebug(maze)).toBe(
		` D  | D R|  LR|  LR| DLR|  LR|  LR| DL 
UD R|U L | D R|  LR|U L | D R|  L |UD  
U  R| DL |U  R| DL | D R|U LR|  LR|U L 
 D R|U LR|  L |UD  |U  R| DL |   R| DL 
UD  | D R|  LR|U L | D  |U  R|  LR|UDL 
U   |UD  | D  | D R|U LR|  LR|  LR|U L 
 D R|U L |U  R|U LR|  LR| DL |   R| DL 
U  R|  LR|  LR|  LR|  L |U  R|  LR|U L `
	)
})

test("Render maze", () => {
	const maze = parseMaze(sampleMazeStr)

	expect(renderMaze(maze)).toBe(
		`┌─┬─────────────┐ 
│ ╵ ┌──── ┌───┐ │ 
│  ─┤  ─┬─┘  ─┘ │ 
├── └─┐ │  ─┬───┤ 
│ ┌───┘ ├─┐ └── │ 
│ │ ┌─┬─┘ └──── │ 
├─┘ │ ╵  ───┬───┤ 
│  ─┴─────┐ └── │ 
└─────────┴─────┘ 


!!! ONE WAY WALLS NOT DISPLAYED !!!`
	)
})

test("Travel", () => {
	const maze = parseMaze(sampleMazeStr)
	const guy = { x: 0, y: 7 }
	const path = "uruurruulurrurrrddllur"

	const success = travelMaze(maze, guy, path)

	expect(success).toEqual({ x: 6, y: 1 })
})

test("Bonk", () => {
	const maze = parseMaze(sampleMazeStr)
	const guy = { x: 0, y: 7 }
	const path = "rrurrul"

	const success = travelMaze(maze, guy, path)

	expect(success).toEqual({ failedStep: 3 })
})
