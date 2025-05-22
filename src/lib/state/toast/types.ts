import type { ILineItem } from "../game/types";

export type IToast = {
	id: string;
	title: string;
	message: string;
};

export interface IHighlightedItem extends ILineItem {
	scoredValue: number;
}

export interface IToastState {
	toasts: IToast[],
	toastToTimeMap?: Record<string, number>,

	highlightedSquares: IHighlightedSquare[],
	highlightedSquaresToTimeoutMap?: Record<string, number>,

	add: (title: string, message: string, durationMs?: number) => void,
	remove: (id: string) => void,
	
	addHighlights: (sqaures: ILineItem[][], gameMultiple: number) => void,
	addHighlight: (square: IHighlightedItem, durationMs?: number) => void,
	removeHighlight: (id: string) => void,
}

export interface IHighlightedSquare {
	id: string;
	x: number;
	y: number;
	value: number;
	scoredValue: number;
}
