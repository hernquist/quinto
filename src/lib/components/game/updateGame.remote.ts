import { command } from '$app/server';
import * as v from 'valibot';
import { db } from '$lib/server/db';
import { game as gamesTable, highscore as highscoresTable } from "$lib/server/db/schema";
import { eq } from 'drizzle-orm';
import highscoreCategories from "../../constants/highscoreCategories";

function groupBy<T extends Record<string, any>>(array: T[], field: string): Record<string, T[]> {
  return array.reduce((acc: Record<string, T[]>, item: T) => {
    const key = item[field];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

const checkForHighScore = async (
  rows: number, 
  columns: number, 
  gameId: number, 
  top_score: number
) => {
  const highscores = await db.select().from(highscoresTable);

  console.log("[checkForHighScore].highscores", highscores);
  console.log("[checkForHighScore].args", rows, columns, gameId, top_score);
  
  const categoriesLength = highscoreCategories.length;

  const highscoresByCategory = groupBy(highscores, "category");
  console.log("[checkForHighScore].highscoresByCategory", highscoresByCategory)

  for (let i = 0; i < categoriesLength; i++) {
    const category = highscoreCategories[i];
    const scores = highscoresByCategory[category];
    
    console.log("[checkForHighScore].scores", scores);

    const foundByRowAndColumn = scores.find(score => score.rows == rows && score.columns == columns)
    if (foundByRowAndColumn) {
      console.log("category + foundByRowAndColumn:", category, foundByRowAndColumn);
      // TODO: need to check scores and make insert call based on that
      // 1. fetch game
      // 2. compare existing game score with current
      // 3. if current higher, update highscore
      // 4. if current lower, do nothing (for now)
    }
    if (!foundByRowAndColumn) {
      console.log(`${category} category does not exist for ${rows} rows and ${columns} columns`);
      // make insert for category by rowAndColumn if does not exist
      await db.insert(highscoresTable).values({ rows, columns, game_id: gameId, category })
    }
  }
}

export const updateScoreOnGameComplete = command(v.object({
    gameId: v.number(),
    top_score: v.number(),
    bottom_score: v.number(),
    rows: v.number(),
    columns: v.number(),
  }), async (requestData) => {
    const { top_score, bottom_score, gameId, rows, columns } = requestData;
	await db.update(gamesTable).set({top_score, bottom_score}).where(eq(gamesTable.id, gameId));

  // we need to check top_score and bottom_score
  await checkForHighScore(rows, columns, gameId, top_score);
  // not return anything at this time 
});