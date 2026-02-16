import { db } from "$lib/server/db";
import { game as gamesTable } from "$lib/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { createNewGame } from "$lib/utils/createNewGame";
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    if (!params?.userId) {
        throw error(404, 'User not found');
    }

    const userId = Number(params.userId);

    if (isNaN(userId)) {
        throw error(400, 'Invalid user ID');
    }

    const userGames = await db.select({
        id: gamesTable.id,
        user_id: gamesTable.user_id,
        top_player: gamesTable.top_player,
        bottom_player: gamesTable.bottom_player,
        winner: gamesTable.winner,
        top_score: gamesTable.top_score,
        bottom_score: gamesTable.bottom_score,
        rows: gamesTable.rows,
        columns: gamesTable.columns,
        multiple: gamesTable.multiple,
        skill_level: gamesTable.skill_level,
        created_at: gamesTable.created_at,
        completed_at: gamesTable.completed_at,
    })
        .from(gamesTable)
        .where(eq(gamesTable.user_id, userId))
        .orderBy(desc(gamesTable.created_at));

    return { userGames };
};

export const actions = {
    // @ts-ignore-next-line
    createNewGame
};
