<script lang="ts">
    import { getHighscoresState } from "$lib/state/highscores/highscores.svelte.js";

    const { highscores = [] } = getHighscoresState();
</script>

<div>
    <ul>
        {#each highscores.scores as highscore}
            <li>{highscore.rows} by {highscore.columns} -- {highscore.username} -- {highscore.topScore} </li>
        {/each}
    </ul>
</div>