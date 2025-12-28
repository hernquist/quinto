import { setContext, getContext } from 'svelte';

export class HighscoresState {
    highscores = $state({
        scores: [],
    })
    
    constructor() {
    }

    public getHighscores(): never[] {
        return this.highscores.scores;
    }

    public setHighscores(scores: []) {
		this.highscores.scores = scores;
	}
}

const KEY = Symbol("HIGHSCORES");

export function setHighscoresState() {
    return setContext(KEY, new HighscoresState());
}

export function getHighscoresState() {
    return getContext<ReturnType<typeof setHighscoresState>>(KEY)
}