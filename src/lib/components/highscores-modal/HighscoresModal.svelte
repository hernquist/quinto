<script lang="ts">
    import { getHighscoresState } from "$lib/state/highscores/highscores.svelte.js";

    const { highscores = [] } = getHighscoresState();
    console.log("highscores", highscores);
</script>

<div>
    <ul>
        {#each highscores.scores as highscore}
            <li>{highscore.rows} by {highscore.columns}</li>
        {/each}
    </ul>
</div>