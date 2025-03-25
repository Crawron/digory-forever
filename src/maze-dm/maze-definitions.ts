import { printMazeDebug } from "./maze"
import { parseMaze } from "./parse-maze"
import { renderMaze } from "./render-maze"

export const greenMaze = parseMaze(`
 DR|L D |  DR|L D |   R|L D |  DR|L   |   R|L D 
U R|LUDR|LU  | UDR|L  R|LUD | U R|L DR|L DR|LU  
 DR|LU  |  DR|LU  |   R|LU R|L DR|LUD | U R|L D 
U R|L DR|LU  |    |    |    | UD | UDR|L  R|LUD 
 D | UD |  D |    |    |    | UDR|LU  |  D | UD 
U R|LU R|LUD |    |    |    | U R|L D | U R|LUD 
 DR|L D | UDR|L DR|L DR|L D |  DR|LUD |  D | U  
U  | UDR|LU R|L DR|LU  | U R|LU R|LUDR|LU R|L D 
 D | UDR|L D | UD |   R|L D |   R|LUD |  DR|LUD 
U R|LU  | U R|LU R|L  R|LU R|L   | U R|LU R|LU  
`)

console.log(
	"Green maze \n" + renderMaze(greenMaze) + "\n" + printMazeDebug(greenMaze)
)

export const pinkMaze = parseMaze(`
  DR|L D |   R|L D |   R|L D |  DR|L   |   R|L D 
 U R|LUDR|L D | UDR|L  R|LUD | U R|L DR|L DR|LU  
  D | U R|LUDR|LU  |    | UDR|L DR|LUD | U R|L D 
 U R|L DR|LU  |    |    | U  | UD | UDR|L  R|LUD 
  D | UD |    |    |    |    | U R|LU  |  D | UD 
 U R|LU R|L DR|L   |    |    |   R|L DR|LU R|LUD 
  DR|L D | UDR|L  R|L D |  D |  DR|LUD |  D | U  
 U  | UDR|LU R|L DR|LU  | UDR|LU R|LUDR|LU R|L D 
  D | UDR|L D | UD |   R|LUD |   R|LUD |  DR|LUD 
 U R|LU  | U R|LU R|L  R|LU R|L   | U R|LU R|LU  
`)

console.log(
	"Pink maze \n" + renderMaze(pinkMaze) + "\n" + printMazeDebug(pinkMaze)
)

export const testGreenMaze = parseMaze(`
 DR|L DR|L DR|L DR|L D |  DR|L DR|L DR|L DR|L D 
UDR|LUDR|LU R|LU R|LUDR|LUDR|LUDR|LUDR|LUDR|LUD 
UDR|LUD |  DR|L D | UDR|LUDR|LUDR|LUDR|LUDR|LUD 
UDR|LUD | U R|LU  | UDR|LUDR|LUDR|LUDR|LUDR|LUD 
U R|LU R|L  R|L  R|LUDR|LUDR|LU R|LU R|LU R|LU  
 DR|L DR|L DR|L DR|LUDR|LUDR|L  R|L  R|L DR|L D 
UDR|LUDR|LUDR|LUDR|LUDR|LUD |  DR|L D | UDR|LUD 
UDR|LUDR|LUDR|LUDR|LUDR|LUD | U R|LU  | UDR|LUD 
UDR|LUDR|LUDR|LUDR|LUDR|LUDR|L DR|L DR|LUDR|LUD 
U R|LU R|LU R|LU R|LU  | U R|LU R|LU R|LU R|LU  
`)

console.log(
	"TEST Green maze \n" +
		renderMaze(testGreenMaze) +
		"\n" +
		printMazeDebug(testGreenMaze)
)

export const testPinkMaze = parseMaze(`
 DR|L DR|L DR|L DR|L D |  DR|L DR|L DR|L DR|L D 
UDR|LUDR|LU R|LU R|LUD | UDR|LUDR|LUDR|LUDR|LUD 
UDR|LUD |  DR|L D | UD | UDR|LUDR|LUDR|LUDR|LUD 
UDR|LUD | U R|LU  | UD | UDR|LUDR|LUDR|LUDR|LUD 
U R|LUDR|L DR|L DR|LUDR|LUDR|LUDR|LUDR|LUDR|LU  
 DR|LUDR|LUDR|LUDR|LUDR|LUDR|LU R|LU R|LUDR|L D 
UDR|LUDR|LUDR|LUDR|LUD | UD |  DR|L D | UDR|LUD 
UDR|LUDR|LUDR|LUDR|LUD | UD | U R|LU  | UDR|LUD 
UDR|LUDR|LUDR|LUDR|LUD | UDR|L DR|L DR|LUDR|LUD 
U R|LU R|LU R|LU R|LU  | U R|LU R|LU R|LU R|LU  
`)

console.log(
	"TEST Pink maze \n" +
		renderMaze(testPinkMaze) +
		"\n" +
		printMazeDebug(testPinkMaze)
)
