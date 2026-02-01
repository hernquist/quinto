import type { GameState } from "./game.svelte";
import { Direction, type ICalculateScore, type IDroppedTile, type ILineItem } from "./types";

export function getScoredLineValue (line: ILineItem[], gameMultiple: number): number {
    const lineValue = line.reduce((acc: number, { value }: { value: number}) => acc + value, 0);
    const scoredValue = lineValue % gameMultiple === 0 ? lineValue : 0 - lineValue;
    return scoredValue
}

export function sumScores (lines: ILineItem[][], gameMultiple: number): number {
    return lines.reduce((acc: number, line: ILineItem[]) => acc + getScoredLineValue(line, gameMultiple), 0);
}

export function sumTotalScore(gameState: GameState): number {
    const { lines, gameMultiple } = synchronousCalculateScore(gameState, true);
    const totalLineScore = sumScores(lines, gameMultiple);
    return totalLineScore;
}

export function synchronousCalculateScore (gameState: GameState, isComputerCandidateMove: boolean): ICalculateScore {
    // get board and gameMultiple from gameState
    const { gameMultiple, board } = gameState.game;
    // pull direction and dropped tiles from candidate turn or game turn
    const { direction, droppedTiles }: { direction: Direction, droppedTiles: IDroppedTile[]} = isComputerCandidateMove ? gameState.game.computerCandidateTurn : gameState.game.turn;

    // initialize lines
    let lines: ILineItem[][] = [];
    if (direction === Direction.Undecided && droppedTiles.length > 0) {
        // search left
        const [square] = droppedTiles;
        const { x, y, tile: { value }} = square;
        // set up -- shift left
        let hasAdjacentTile = true;
        let line: ILineItem[] = [];
        let shiftLeft = 1;

        // check left
        do {
            if (board?.[x - shiftLeft]?.[y]?.tile) {
                if (line.length === 0) { 
                    line.push({ x, y, value })
                };
                // counldn't this be just line.push(board[x - shiftLeft][y].tile)
                line.push({ 
                    x: x - shiftLeft, 
                    y, 
                    value: board[x - shiftLeft][y].tile?.value || 0 
                });
                // go left one more
                shiftLeft += 1;
            } else {
                // if no hit set to false
                hasAdjacentTile = false;
            }
        } while (hasAdjacentTile);
    
        // now look right
        let shiftRight = 1;
        // reset adjacent tile
        hasAdjacentTile = true;
        
        do {
            if (board?.[x + shiftRight]?.[y]?.tile) {
                if (line.length === 0) {
                    line.push({ x, y, value });
                }
                // counldn't this be just line.push(board[x - shiftLeft][y].tile)
                line.push({ 
                    x: x + shiftRight, 
                    y, 
                    value: board[x + shiftRight][y].tile?.value || 0 
                });
                // go one more right
                shiftRight += 1;
            } else {
                hasAdjacentTile = false;
            }
        } while (hasAdjacentTile)
                
        // after done checking horizontally push line to score 
        if (line.length !== 0) {
            lines.push(line);
        }
    
        // reset for vertical
        hasAdjacentTile = true;
        line = [];
        // shift "up"
        let shiftUp = 1
        do {
            if (board?.[x]?.[y - shiftUp]?.tile) {
                if (line.length === 0) { 
                    line.push({x, y, value})
                };
                // counldn't this be just line.push(board[x - shiftLeft][y].tile)
                line.push({ 
                    x: x, 
                    y: y - shiftUp, 
                    value: board[x][y - shiftUp]?.tile?.value || 0 
                });
                shiftUp += 1;
            } else {
                hasAdjacentTile = false;
            }
        } while (hasAdjacentTile);
    
        let shiftDown = 1;
        hasAdjacentTile = true;
        do {
            if (board?.[x]?.[y + shiftDown]?.tile) {
                if (line.length === 0) {
                    line.push({x, y, value});
                }
                // counldn't this be just line.push(board[x - shiftLeft][y].tile)
                line.push({ 
                    x, 
                    y: y + shiftDown, 
                    value: board[x][y + shiftDown].tile?.value || 0 
                });
                shiftDown += 1;
            } else {
                hasAdjacentTile = false;
            }
        } while (hasAdjacentTile)
                
         // after done checking vertically push line to score 
        if (line.length !== 0) {
            lines.push(line);
        }

        // handle empty line -- single, untouched tile
        if (lines.length === 0) {
            lines.push([{ x, y, value } ])
        }

        return { lines, gameMultiple }
    }

    // --- HORIZONTAL ---
    if (direction === Direction.Horizontal) {
        let copy = [...droppedTiles];

        // get score
        const board = gameState.game.board;

        const firstSquare: IDroppedTile = copy[0]
        
        // determine "line" for horizontal placement
        // some init
        let hasAdjacentTile = true;
        let line: ILineItem[] = []
        let shiftLeft = 1;
        
        // add first square to line
        let { x, y, tile: { value }} = firstSquare; 
        line.push({x, y, value});

        do {
            const foundCandidateTileIndex = copy.findIndex(tile => tile.x === x - shiftLeft && tile.y === y);
            if (board?.[x - shiftLeft]?.[y]?.tile) {
                line.push({
                    x: x - shiftLeft,
                    y,
                    value: board[x - shiftLeft][y].tile?.value || 0
                });   
            } else if (foundCandidateTileIndex !== -1) {
                line.push({
                    x: x - shiftLeft,
                    y,
                    value: copy[foundCandidateTileIndex].tile.value
                })
            } else {
                hasAdjacentTile = false
            }
            shiftLeft += 1;
        } while (hasAdjacentTile)

        let shiftRight = 1;
        hasAdjacentTile = true;

        do {
            const foundCandidateTileIndex = copy.findIndex(tile => tile.x === x + shiftRight && tile.y === y);
            if (board?.[x + shiftRight]?.[y]?.tile) {
                line.push({ 
                    x: x + shiftRight, 
                    y, 
                    value: board[x + shiftRight][y].tile?.value || 0 
                });
            } else if (foundCandidateTileIndex !== -1) {
                line.push({
                    x: x + shiftRight,
                    y,
                    value: copy[foundCandidateTileIndex].tile.value
                })
            } else {
                hasAdjacentTile = false;
            }
            shiftRight += 1;
        } while (hasAdjacentTile)

        if (line.length > 1) {
            lines.push(line);
        }

        // check each droppedTiles vertical "line" possibility
        // original droppedTiles 
        const newConstitutedDroppedTiles = [...copy];
        for (let i = 0; i < newConstitutedDroppedTiles.length; i++) {
            hasAdjacentTile = true;
            line = [];

            const { x, y, tile: { value }} = newConstitutedDroppedTiles[i];

            // checking above
            let shiftUp = 1;
            do {
                const foundCandidateTileIndex = copy.findIndex(tile => tile.x === x && tile.y - shiftUp === y);
                if (board?.[x]?.[y - shiftUp]?.tile) {
                    if (line.length === 0) { 
                        line.push({x, y, value})
                    };
                    line.push({ 
                        x: x, 
                        y: y - shiftUp, 
                        value: board[x][y - shiftUp]?.tile?.value || 0 
                    });
                } else if (foundCandidateTileIndex !== -1) {
                    line.push({
                        x,
                        y: y - shiftUp,
                        value: copy[foundCandidateTileIndex].tile.value
                    })
                } else {
                    hasAdjacentTile = false;
                }
                shiftUp += 1;
            } while (hasAdjacentTile);

            let shiftDown = 1
            hasAdjacentTile = true 

            do {
                const foundCandidateTileIndex = copy.findIndex(tile => tile.x === x && tile.y + shiftDown === y);
                if (board?.[x]?.[y + shiftDown]?.tile) {
                    if (line.length === 0) {
                        line.push({x, y, value});
                    }
                    line.push({ 
                        x, 
                        y: y + shiftDown, 
                        value: board[x][y + shiftDown].tile?.value || 0 
                    });
                } else if (foundCandidateTileIndex !== -1) {
                    line.push({
                        x,
                        y: y + shiftDown,
                        value: copy[foundCandidateTileIndex].tile.value
                    })
                } else {
                    hasAdjacentTile = false;
                }
                shiftDown += 1;
            } while (hasAdjacentTile);

            if (line.length !== 0) {
                lines.push(line)
            }
        }

        return { lines, gameMultiple }
    }

    // VERTICAL
    if (direction === Direction.Vertical) {
        // order dropped tiles from top to bottom
        let copy = [...droppedTiles];

        // get score
        const board = gameState.game.board;

        const firstSquare: IDroppedTile = copy[0]

        // determine "line" for vertical placement
        // some init
        let hasAdjacentTile = true;
        let line: ILineItem[] = []
        let shiftUp = 1;

        // add first square to line
        let { x, y, tile: { value }} = firstSquare; 
        line.push({x, y, value});
        do {
            const foundCandidateTileIndex = copy.findIndex(tile => tile.x === x && tile.y - shiftUp === y);
            if (board?.[x]?.[y - shiftUp]?.tile) {
                line.push({
                    x,
                    y: y - shiftUp,
                    value: board[x][y - shiftUp].tile?.value || 0
                });
            } else if (foundCandidateTileIndex !== -1) {
                line.push({
                    x,
                    y: y - shiftUp,
                    value: copy[foundCandidateTileIndex].tile.value
                })
            } else {
                hasAdjacentTile = false
            }
            shiftUp += 1;
        } while (hasAdjacentTile)

        let shiftDown = 1;
        hasAdjacentTile = true;

        do {
            const foundCandidateTileIndex = copy.findIndex(tile => tile.x === x && tile.y + shiftDown === y);
            if (board?.[x]?.[y + shiftDown]?.tile) {
                line.push({ 
                    x, 
                    y: y + shiftDown, 
                    value: board[x][y + shiftDown].tile?.value || 0 
                });
            } else if (foundCandidateTileIndex !== -1) {
                line.push({
                    x,
                    y: y + shiftDown,
                    value: copy[foundCandidateTileIndex].tile.value
                })
            } else {
                hasAdjacentTile = false;
            }
            shiftDown += 1;
        } while (hasAdjacentTile)

        if (line.length > 1) {
            lines.push(line);
        }

        // check each droppedTiles horizontal "line" possibility
        // original droppedTiles 
        const newConstitutedDroppedTiles = [...copy];
        for (let i = 0; i < newConstitutedDroppedTiles.length; i++) {
            hasAdjacentTile = true;
            line = [];
            const { x, y, tile: { value }} = newConstitutedDroppedTiles[i];
            // checking left
            let shiftLeft = 1;
            do {
                const foundCandidateTileIndex = copy.findIndex(tile => tile.x - shiftLeft === x && tile.y === y);
                if (board?.[x - shiftLeft]?.[y]?.tile) {
                    if (line.length === 0) { 
                        line.push({x, y, value})
                    };
                    line.push({ 
                        x: x - shiftLeft, 
                        y: y, 
                        value: board[x - shiftLeft][y]?.tile?.value || 0 
                    });
                } else if (foundCandidateTileIndex !== -1) {
                    line.push({
                        x: x - shiftLeft,
                        y,
                        value: copy[foundCandidateTileIndex].tile.value
                    })
                } else {
                    hasAdjacentTile = false;
                }
                shiftLeft += 1;
            } while (hasAdjacentTile);

            let shiftRight = 1;
            hasAdjacentTile = true; 
            do {
                const foundCandidateTileIndex = copy.findIndex(tile => tile.x + shiftRight === x && tile.y === y);
                if (board?.[x + shiftRight]?.[y]?.tile) {
                    if (line.length === 0) {
                        line.push({x, y, value});
                    }
                    line.push({ 
                        x: x + shiftRight, 
                        y, 
                        value: board[x + shiftRight][y].tile?.value || 0 
                    });
                } else if (foundCandidateTileIndex !== -1) {
                    line.push({
                        x: x + shiftRight,
                        y,
                        value: copy[foundCandidateTileIndex].tile.value
                    })
                } else {
                    hasAdjacentTile = false;
                }
                shiftRight += 1;
            } while (hasAdjacentTile);

            if (line.length !== 0) {
                lines.push(line)
            }
        }
        
        return { lines, gameMultiple };
    }
    
    console.error("Error: calculation not working...")
    return { lines: [], gameMultiple}
}
    