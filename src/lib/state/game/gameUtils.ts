import type { IBoard, ICoordTuple } from "$lib/components/game/types";
import type { IToastState } from "$lib/state/toast/types";
import { Direction, type IDroppedTile, type ILineItem } from "./types";

export function checkSurroundSquaresForASingleTile (board: IBoard, x: number, y: number): boolean {
    if (
        board?.[x + 1]?.[y]?.tile || 
        board?.[x - 1]?.[y]?.tile || 
        board?.[x]?.[y + 1]?.tile || 
        board?.[x]?.[y - 1]?.tile
    ) {
        return true;
    }
    return false;
}

export function addDropzoneOptions(length: number, firstTile: IDroppedTile, direction: Direction, dropzoneOptions: ICoordTuple[]): ICoordTuple[] {
    const { x, y } = firstTile;
    for (let i = 0; i < length; i++) {
        if (direction === Direction.Vertical) {
            // if part of dropped tiles, don't add to list
            if (y !== i) dropzoneOptions.push([x, i]);
        }
        if (direction === Direction.Horizontal) {
            // if part of dropped tiles, don't add to list
            if (x !== i) {
                dropzoneOptions.push([i, y]);
            }
        }
    }	
    return dropzoneOptions;
}

export function getScoredLineValue (line: ILineItem[], gameMultiple: number): number {
    const lineValue = line.reduce((acc: number, { value }: { value: number}) => acc + value, 0);
    const scoredValue = lineValue % gameMultiple === 0 ? lineValue : 0 - lineValue;
    return scoredValue
}

export function readLinesForScore(lines: ILineItem[][], gameMultiple: number, toastState: IToastState): number {
    // hmmm maybe I shouldn't separate this?, maybe I should
    toastState.addHighlights(lines, gameMultiple);
    return lines.reduce((acc: number, line: ILineItem[]) => acc + getScoredLineValue(line, gameMultiple), 0);
}