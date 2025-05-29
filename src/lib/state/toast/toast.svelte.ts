import { getContext, onDestroy, setContext } from 'svelte';
import type { IHighlightedItem, IHighlightedSquare, IQueuedMessgage, IToast, ToastType } from './types';
import type { ILineItem } from '../game/types';
import { getScoredLineValue } from '../game/gameUtils';
import type { Players } from '../player/types';

export const HIGHLIGHT_DURATION = 1200;
export const MAIN_TOAST_DURATION = 1200;

export class ToastState {
	toasts = $state<IToast[]>([]);
	toastToTimeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

	queuedMessages = $state<IQueuedMessgage[]>([]);
	firedQueuedMessages = $state<IQueuedMessgage[]>([]);
	firedQueuedMessagesToTimeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

	highlightedSquares = $state<IHighlightedSquare[]>([]);
	highlightedSquaresToTimeoutMap = new Map();

	linesIndex = 0;
	numberOfLines = 0;

	constructor() {
		onDestroy(() => {
			for (const timeout of this.toastToTimeoutMap.values()) {
				clearTimeout(timeout);
			}
			this.toastToTimeoutMap.clear();
			this.highlightedSquaresToTimeoutMap.clear();
			this.firedQueuedMessagesToTimeoutMap.clear();
		});	
	}

	public add(title: string, message: string, type: ToastType, durationMs = MAIN_TOAST_DURATION) {
		const id = crypto.randomUUID();
		this.toasts.push({ 
			id, 
			title, 
			message, 
			type 
		});

		this.toastToTimeoutMap.set(id, 
			setTimeout(
				() => { this.remove(id); }, 
				durationMs
			)
		);
	}

	public remove(id: string) {
		const timeout = this.toastToTimeoutMap.get(id);
		if (timeout) {
			clearTimeout(timeout);
			this.toastToTimeoutMap.delete(id);
		}
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
	}

	public removeAllToasts() {
		this.toasts.forEach(({ id }) => {
			const timeout = this.toastToTimeoutMap.get(id);
			if (timeout) {
				clearTimeout(timeout);
				this.toastToTimeoutMap.delete(id);
			}
		});

		this.toasts = [];
	}

	private progressThroughLine(line: ILineItem[], gameMultiple: number) {
		const scoredValue = getScoredLineValue(line, gameMultiple);
		line.forEach((lineItem: ILineItem) => {
			this.addHighlight({...lineItem, scoredValue} );
		});
		this.linesIndex++;
	}

	private resetLinesIndex(): void {
		this.linesIndex = 0;
	}

	public addHighlights(lines: ILineItem[][], gameMultiple: number, highlightDuration = HIGHLIGHT_DURATION) {
		this.resetLinesIndex()
		this.numberOfLines = lines.length;

		const line: ILineItem[] = lines[this.linesIndex];
		this.progressThroughLine(line, gameMultiple);

		if (this.linesIndex < this.numberOfLines) {
			const interval = setInterval(() => {
				if (this.linesIndex === this.numberOfLines) {
					this.removeAllHighlights();
					clearInterval(interval);
				} else {
					this.removeAllHighlights();
					const line: ILineItem[] = lines[this.linesIndex];
					this.progressThroughLine(line, gameMultiple);
				}	
			}, highlightDuration);
		}
	}

	private addHighlight(lineItem: IHighlightedItem, highlightDuration = HIGHLIGHT_DURATION) {
		const id = crypto.randomUUID();

		this.highlightedSquares.push({ ...lineItem, id })
		this.highlightedSquaresToTimeoutMap.set(
			id, 
			setTimeout(() => {
				this.removeHighlight(id);
			}, highlightDuration)
		)
	}

	public removeHighlight(id: string) {
		const timeout = this.highlightedSquaresToTimeoutMap.get(id);
		if (timeout) {
			clearTimeout(timeout);
			this.highlightedSquaresToTimeoutMap.delete(id);
		}
		this.highlightedSquares = this.highlightedSquares.filter((square) => square.id !== id);
	}

	// not sure we need this
	public removeAllHighlights() {
		this.highlightedSquares.forEach(({ id }) => {
			const timeout = this.highlightedSquaresToTimeoutMap.get(id);
			if (timeout) {
				clearTimeout(timeout);
				this.highlightedSquaresToTimeoutMap.delete(id);
			}
		});

		this.highlightedSquares = [];
	}

	public addQueuedMessage(title: string, message: string, activePlayer: Players, type: ToastType, durationMs = HIGHLIGHT_DURATION) {
		const id = crypto.randomUUID();
		this.queuedMessages.push({ id, title, message, activePlayer, type, durationMs});
	}
	
	public fireMessages() {
		this.firedQueuedMessages = this.queuedMessages;
		this.firedQueuedMessages.forEach(( {id, durationMs} ) => 
			this.firedQueuedMessagesToTimeoutMap.set(id, 
				setTimeout(() => { this.removeFiredQueuedMessage(id); }, this.numberOfLines * durationMs)
			)
		)
	}

	public removeFiredQueuedMessage(id: string) {
		const timeout = this.firedQueuedMessagesToTimeoutMap.get(id);
		if (timeout) {
			clearTimeout(timeout);
			this.firedQueuedMessagesToTimeoutMap.delete(id);
		}
		this.firedQueuedMessages = this.firedQueuedMessages.filter((toast) => toast.id !== id);
		this.queuedMessages = this.queuedMessages.filter((toast) => toast.id !== id);
	}

	public removeAllQueuedMessages() {
		this.firedQueuedMessages.forEach(({ id }) => {
			const timeout = this.firedQueuedMessagesToTimeoutMap.get(id);
			if (timeout) {
				clearTimeout(timeout);
				this.firedQueuedMessagesToTimeoutMap.delete(id);
			}
		});
		this.queuedMessages = [];
	}
}

const TOAST_KEY = Symbol('TOAST');

export function setToastState() {
	return setContext(TOAST_KEY, new ToastState());
}

export function getToastState() {
	return getContext<ReturnType<typeof setToastState>>(TOAST_KEY);
}