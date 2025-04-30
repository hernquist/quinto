export type IToast = {
	id: string;
	title: string;
	message: string;
};

export interface IToastState {
	toasts: IToast[],
	toastToTimeMap?: Record<string, number>,
	add: (title: string, message: string, durationMs?: number) => void,
	remove: (id: string) => void,
}
