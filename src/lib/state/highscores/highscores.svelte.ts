import { setContext, getContext } from 'svelte';
import type { IHighscore, IHighscores } from './types';

export class HighscoresState {
    highscores = $state<IHighscores>({
        scores: [],
    })
    
    constructor() {
    }

    public getHighscores(): IHighscore[] {
        return this.highscores.scores;
    }

    public setHighscores(scores: IHighscore[]) {
        // TODO: filter by highscore types
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