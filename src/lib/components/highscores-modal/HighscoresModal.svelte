<script lang="ts">
    import { getHighscoresState } from "$lib/state/highscores/highscores.svelte.js";

    const { highscores = [] } = getHighscoresState();
</script>

<div class="highscores-modal__container">
    <table>
        <thead>
            <tr>
                <th>
                    board
                </th>
                <th>
                    username
                </th>
                <th>
                    score
                </th>
                <th>
                    date
                </th>
            </tr>
        </thead>
        <tbody>
            {#each highscores.scores as highscore}
                <tr>
                    <td>{highscore.rows} by {highscore.columns}</td>
                    <td>{highscore.username}</td>
                    <td>{highscore.topScore}</td>
                    <td>{new Date(highscore.created_at).toLocaleDateString()}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="postcss"> 
    .highscores-modal__container {
        padding-top: 2x;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid #000000;
        padding: 6px;
        text-align: left;
        font-size: 14px;
    }
</style>