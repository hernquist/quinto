import { command } from '$app/server';
import * as v from 'valibot';
import { db } from '$lib/server/db';
import { game as gamesTable } from "$lib/server/db/schema";
import { eq } from 'drizzle-orm';

export const updateScore = command(v.object({
    gameId: v.number(),
    top_score: v.number(),
    bottom_score: v.number(),
  }), async (requestData) => {
    const { top_score, bottom_score, gameId } = requestData;
	await db.update(gamesTable).set({top_score, bottom_score}).where(eq(gamesTable.id, gameId));
    // not return anything at this time 
});