import { getContext, setContext } from 'svelte';
import { ModalScreen, type IModalState } from './types';

let initState: IModalState = {
	name : ModalScreen.Settings, 
}

export class ModalState {
	screen = $state<IModalState>(initState); 
	showModal = $state(false);

	constructor() {
	}
	
	public changeScreen(ms: ModalScreen): void {
		this.screen.name = ms;
	}

	public toggleModalOn() {
		this.showModal = true;
	}

	toggleModalOff() {
		this.showModal = false;
	}

	public getShowModal(): boolean {
		return this.showModal;
	}
}

const MODAL_KEY = Symbol('MODAL');

export function setModalState() {
	return setContext(MODAL_KEY, new ModalState());
}

export function getModalState() {
	return getContext<ReturnType<typeof setModalState>>(MODAL_KEY);
}