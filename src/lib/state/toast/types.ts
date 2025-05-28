import type { ILineItem } from "../game/types";
import type { Players } from "../player/types";

export enum ToastType {
	TOTAL_LINE_SCORE = "totalLineScore",
	PLAYER_MESSGAGE = "playerMessage"
}

export type IToast = {
	id: string;
	title: string;
	message: string;
	type: ToastType;
};

export interface IQueuedMessgage extends IToast {
	durationMs: ReturnType<typeof setTimeout>,
	activePlayer: Players
}

export interface IHighlightedItem extends ILineItem {
	scoredValue: number;
}

export interface IToastState {
	toasts: IToast[],
	toastToTimeMap?: Record<string, number>,

	highlightedSquares: IHighlightedSquare[],
	highlightedSquaresToTimeoutMap?: Record<string, number>,

	queuedMessages: IQueuedMessgage[],
	firedQueuedMessages: IQueuedMessgage[],
	firedQueuedMessagesToTimeoutMap: Record<string, ReturnType<typeof setTimeout>>,

	add: (title: string, message: string, type: ToastType, durationMs?: number) => void,
	remove: (id: string) => void,

	addQueuedMessage: (title: string, message: string, activePlayer: Players, type: ToastType, durationMs?:  ReturnType<typeof setTimeout>) => void,
	fireMessages: () => void,
	removeFiredQueuedMessage: (id: string) => void,
	
	addHighlights: (squares: ILineItem[][], gameMultiple: number) => void,
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
