type IHighscore = {
    category: String;
    columns: Number;
    rows: Number;
    game_id: Number;
    id: Number;
    username?: String;
    userId?: Number;
    topScore?: Number; 
}

type IHighscores = {
    scores: IHighscore[]
}

export type { IHighscore, IHighscores };