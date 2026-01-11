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
    const scores = highscoresByCategory[category] || [];
    
    console.log("[checkForHighScore].scores", scores);

    const foundByRowAndColumn = scores.find(score => score.rows == rows && score.columns == columns);


    if (foundByRowAndColumn) {
      console.log("category + foundByRowAndColumn:", category, foundByRowAndColumn);
      // 1. Fetch the game by ID; correct usage of drizzle-orm select/where
      const fetchedGameArr = await db
        .select()
        .from(gamesTable)
        .where(eq(gamesTable.id, foundByRowAndColumn.game_id));

      const fetchedGame = fetchedGameArr[0]; 
      console.log("[checkForHighScore].fetchedGame", fetchedGame);

      // different category business logic
      switch(category) {
        case highscoreCategories[0]: // highscoreStraight 
          // 2. compare top_scores
          if (typeof fetchedGame?.top_score === "number" && top_score > fetchedGame.top_score) {
            // 3. if current score is higher, update highscore
            await db
              .update(highscoresTable)
              .set({ game_id: gameId })
              .where(eq(highscoresTable.id, foundByRowAndColumn.id));
            console.log("[checkForHighScore] Highscore updated for highscore id", foundByRowAndColumn.id);
          } else {
            // 4. if current lower or equal, do nothing (for now)
            console.log("[checkForHighScore] No update needed; lower or equal score", foundByRowAndColumn.id);
          }
          break;
        default:
          // code block
      }
    }

    // category does not exist for a given row and column
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