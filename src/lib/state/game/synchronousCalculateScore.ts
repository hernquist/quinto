import type { GameState } from "./game.svelte";
import { orderTilesByDimension } from "./gameUtils";
import { Direction, type IDroppedTile, type ILineItem } from "./types";

type ICalculateScore = {
    lines: ILineItem[][],
    gameMultiple: number
}

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
    const { gameMultiple, board } = gameState.game;
     const { direction, droppedTiles} = isComputerCandidateMove? gameState.game.computerCandidateTurn : gameState.game.turn;

    let lines: ILineItem[][] = [];
    if (direction === Direction.Undecided && droppedTiles.length > 0) {
        // search left
        const [square] = droppedTiles;
        const { x, y, tile: { value }} = square;
        // set up -- shift left
        let hasAdjacentTile = true

        let line: ILineItem[] = [];
        let shiftLeft = 1;
        do {
            if (board?.[x - shiftLeft]?.[y]?.tile) {
                if (line.length === 0) { 
                    line.push({ x, y, value })
                };
                line.push({ 
                    x: x - shiftLeft, 
                    y, 
                    value: board[x - shiftLeft][y].tile?.value || 0 
                });
                shiftLeft += 1;
            } else {
                hasAdjacentTile = false;
            }
        } while (hasAdjacentTile);
    
        let shiftRight = 1;
        hasAdjacentTile = true;
        do {
            if (board?.[x + shiftRight]?.[y]?.tile) {
                if (line.length === 0) {
                    line.push({ x, y, value });
                }
                line.push({ 
                    x: x + shiftRight, 
                    y, 
                    value: board[x + shiftRight][y].tile?.value || 0 
                });
                shiftRight += 1;
            } else {
                hasAdjacentTile = false;
            }
        } while (hasAdjacentTile)
                
        if (line.length !== 0) {
            lines.push(line);
        }
    
        // up and down
        hasAdjacentTile = true;
        // shift "up"
        line = [];
        let shiftUp = 1
        do {
            if (board?.[x]?.[y - shiftUp]?.tile) {
                if (line.length === 0) { 
                    line.push({x, y, value})
                };
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
                
        if (line.length !== 0) {
            lines.push(line);
        }

        // handle empty line -- single, untouched tile
        if (lines.length === 0) {
            lines.push([{ x, y, value } ])
        }

        return { lines, gameMultiple }
    }

    // horizontal
    if (direction === Direction.Horizontal) {
        
        // order dropped tiles from the left to right
        let orderedDroppedTiles = droppedTiles.sort((a, b) => orderTilesByDimension(a, b, "x"));

        const lastIndex = orderedDroppedTiles.length - 1;
        const lastSquare: IDroppedTile = orderedDroppedTiles[lastIndex];
        const firstSquare: IDroppedTile = orderedDroppedTiles[0]
        const middleSquares: IDroppedTile[] = orderedDroppedTiles.slice(1, lastIndex);
        
        // determine "line" for horizontal placement
        // some init
        let hasAdjacentTile = true;
        let line: ILineItem[] = []
        let shiftLeft = 1;
        
        // add first square to line
        let { x, y, tile: { value }} = firstSquare; 
        line.push({x, y, value});
        
        do {
            if (board?.[x - shiftLeft]?.[y]?.tile) {
                line.push({
                    x: x - shiftLeft,
                    y,
                    value: board[x - shiftLeft][y].tile?.value || 0
                });
                shiftLeft += 1;
            } else {
                hasAdjacentTile = false
            }
        } while (hasAdjacentTile)

        let shiftRight = 1;
        hasAdjacentTile = true;

        do {
            if (board?.[x + shiftRight]?.[y]?.tile) {
                line.push({ 
                    x: x + shiftRight, 
                    y, 
                    value: board[x + shiftRight][y].tile?.value || 0 
                });
                shiftRight += 1;
            } else {
                hasAdjacentTile = false;
            }
        } while (hasAdjacentTile)

        lines.push(line);

        // check each droppedTiles vertical "line" possibility
        // orginal droppedTiles 
        const newConstitutedDroppedTiles = [firstSquare, ...middleSquares, lastSquare];
        for (let i = 0; i < newConstitutedDroppedTiles.length; i++) {
            hasAdjacentTile = true;
            line = [];

            const { x, y, tile: { value }} = newConstitutedDroppedTiles[i];
            // checking above
            let shiftUp = 1;
            do {
                if (board?.[x]?.[y - shiftUp]?.tile) {
                    if (line.length === 0) { 
                        line.push({x, y, value})
                    };
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

            let shiftDown = 1
            hasAdjacentTile = true 
            do {
                if (board?.[x]?.[y + shiftDown]?.tile) {
                    if (line.length === 0) {
                        line.push({x, y, value});
                    }
                    line.push({ 
                        x, 
                        y: y + shiftDown, 
                        value: board[x][y + shiftDown].tile?.value || 0 
                    });
                    shiftDown += 1;
                } else {
                    hasAdjacentTile = false;
                }
            } while (hasAdjacentTile);
            if (line.length !== 0) {
                lines.push(line)
            }
        }

        return { lines, gameMultiple }
    }

    // vertical
    if (direction === Direction.Vertical) {
        // order dropped tiles from top to bottom

        let orderedDroppedTiles = droppedTiles.sort((a, b) => orderTilesByDimension(a, b, "x"));

        const lastIndex = orderedDroppedTiles.length - 1;
        const lastSquare: IDroppedTile = orderedDroppedTiles[lastIndex];
        const firstSquare: IDroppedTile = orderedDroppedTiles[0]
        const middleSquares: IDroppedTile[] = orderedDroppedTiles.slice(1, lastIndex);

        // determine "line" for vertical placement
        // some init
        let hasAdjacentTile = true;
        let line: ILineItem[] = []
        let shiftUp = 1;

        // add first square to line
        let { x, y, tile: { value }} = firstSquare; 
        line.push({x, y, value});
        do {
            if (board?.[x]?.[y - shiftUp]?.tile) {
                line.push({
                    x,
                    y: y - shiftUp,
                    value: board[x][y - shiftUp].tile?.value || 0
                });
                shiftUp += 1;
            } else {
                hasAdjacentTile = false
            }
        } while (hasAdjacentTile)

        let shiftDown = 1;
        hasAdjacentTile = true;

        do {
            if (board?.[x]?.[y + shiftDown]?.tile) {
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

        lines.push(line);

        // check each droppedTiles horizontal "line" possibility
        // orginal droppedTiles 
        const newConstitutedDroppedTiles = [firstSquare, ...middleSquares, lastSquare];
        for (let i = 0; i < newConstitutedDroppedTiles.length; i++) {
            hasAdjacentTile = true;
            line = [];
            const { x, y, tile: { value }} = newConstitutedDroppedTiles[i];
            // checking left
            let shiftLeft = 1;
            do {
                if (board?.[x - shiftLeft]?.[y]?.tile) {
                    if (line.length === 0) { 
                        line.push({x, y, value})
                    };
                    line.push({ 
                        x: x - shiftLeft, 
                        y: y, 
                        value: board[x - shiftLeft][y]?.tile?.value || 0 
                    });
                    shiftLeft += 1;
                } else {
                    hasAdjacentTile = false;
                }
            } while (hasAdjacentTile);

            let shiftRight = 1;
            hasAdjacentTile = true; 
            do {
                if (board?.[x + shiftRight]?.[y]?.tile) {
                    if (line.length === 0) {
                        line.push({x, y, value});
                    }
                    line.push({ 
                        x: x + shiftRight, 
                        y, 
                        value: board[x + shiftRight][y].tile?.value || 0 
                    });
                    shiftRight += 1;
                } else {
                    hasAdjacentTile = false;
                }
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
    