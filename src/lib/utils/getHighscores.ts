import { db } from "$lib/server/db";
import { user as usersTable, highscore as highscoresTable, game as gamesTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { createNewGame } from "$lib/utils/createNewGame";
import highscoreCategories from "../../lib/constants/highscoreCategories";
import type { IHighscore } from "$lib/state/highscores/types";

export const getHighscores = async (): Promise<IHighscore[]> => {
  const highscores = await db.select().from(highscoresTable);
  let filteredHighscores: any[] = [];
  const categoriesLength = highscoreCategories.length;

  for (let i = 0; i < categoriesLength; i++) {
    const partiallyFilterHighscores = highscores.filter((score: IHighscore) => score.category === highscoreCategories[i]);
    filteredHighscores = [...filteredHighscores, ...partiallyFilterHighscores];
  }

  const filteredHighscoresLength = filteredHighscores.length;

  for (let j = 0; j < filteredHighscoresLength; j++) {  
    let highscore = filteredHighscores[j];
  
    const [game] = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, highscore.game_id));

    // TODO right now top_score is used because we don't care about who is a human and who a computer
    highscore = {
      ...highscore,
      topScore: game?.top_score || 0,
      userId: game?.user_id || 0,
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, game?.user_id || 0));

    highscore = {
      ...highscore,
      username: user?.username || user?.email || 0
    }

    filteredHighscores[j] = highscore;
  }
  // if there is a token, set user in store on the client
  return filteredHighscores;
}

export const actions = {
  // @ts-ignore-next-line
  createNewGame
};