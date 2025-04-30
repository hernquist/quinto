import { getContext, setContext } from 'svelte';
import { ModalScreen } from './types';

export class ModalState {
	screen = $state({ name : ModalScreen.Settings});

	constructor() {
        this.screen.name = ModalScreen.Settings;
	}

	changeScreen(ms: ModalScreen): void {
		this.screen.name = ms;
	}
}

const MODAL_KEY = Symbol('MODAL');

export function setModalState() {
	return setContext(MODAL_KEY, new ModalState());
}

export function getModalState() {
	return getContext<ReturnType<typeof setModalState>>(MODAL_KEY);
}