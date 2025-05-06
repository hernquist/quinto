import { getContext, onDestroy, setContext } from 'svelte';
import type { IToast } from './types';

export class ToastState {
	toasts = $state<IToast[]>([]);
	toastToTimeoutMap = new Map<string, number>();

	constructor() {
		onDestroy(() => {
			for (const timeout of this.toastToTimeoutMap.values()) {
				clearTimeout(timeout);
			}
			this.toastToTimeoutMap.clear();
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
}

const TOAST_KEY = Symbol('TOAST');

export function setToastState() {
	return setContext(TOAST_KEY, new ToastState());
}

export function getToastState() {
	return getContext<ReturnType<typeof setToastState>>(TOAST_KEY);
}