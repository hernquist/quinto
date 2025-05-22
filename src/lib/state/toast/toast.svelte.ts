import { getContext, onDestroy, setContext } from 'svelte';
import type { IHighlightedItem, IHighlightedSquare, IToast } from './types';
import type { ILineItem } from '../game/types';
import { getScoredLineValue } from '../game/gameUtils';

const HIGHLIGHT_DURATION = 1200;

export class ToastState {
	toasts = $state<IToast[]>([]);
	toastToTimeoutMap = new Map<string, number>();

	highlightedSquares = $state<IHighlightedSquare[]>([]);
	highlightedSquaresToTimeoutMap = new Map();

	linesIndex = 0;

	constructor() {
		onDestroy(() => {
			for (const timeout of this.toastToTimeoutMap.values()) {
				clearTimeout(timeout);
			}
			this.toastToTimeoutMap.clear();

			this.highlightedSquaresToTimeoutMap.clear();
		});
	}

	public add(title: string, message: string, durationMs = 2000) {
		const id = crypto.randomUUID();
		this.toasts.push({
			id,
			title,
			message
		});

		this.toastToTimeoutMap.set(
			id,
			setTimeout(() => {
				this.remove(id);
			}, durationMs)
		);
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
		const numberOfLines = lines.length;

		const line: ILineItem[] = lines[this.linesIndex];
		this.progressThroughLine(line, gameMultiple);

		if (this.linesIndex < numberOfLines) {
			const interval = setInterval(() => {
				if (this.linesIndex === numberOfLines) {
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

	public remove(id: string) {
		const timeout = this.toastToTimeoutMap.get(id);
		if (timeout) {
			clearTimeout(timeout);
			this.toastToTimeoutMap.delete(id);
		}
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
	}

	public removeHighlight(id: string) {
		const timeout = this.highlightedSquaresToTimeoutMap.get(id);
		if (timeout) {
			clearTimeout(timeout);
			this.highlightedSquaresToTimeoutMap.delete(id);
		}
		this.highlightedSquares = this.highlightedSquares.filter((square) => square.id !== id);
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
}

const TOAST_KEY = Symbol('TOAST');

export function setToastState() {
	return setContext(TOAST_KEY, new ToastState());
}

export function getToastState() {
	return getContext<ReturnType<typeof setToastState>>(TOAST_KEY);
}