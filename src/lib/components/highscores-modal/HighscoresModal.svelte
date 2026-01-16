<script lang="ts">
    import { getHighscoresState } from "$lib/state/highscores/highscores.svelte.js";

    const { highscores = [] } = getHighscoresState();
</script>

<div>
    <ul>
        <li class="highscores-modal__headers">
            <div>
                board
            </div>
            <div>
                username
            </div>
            <div>
                score
            </div>
            <div>
                date
            </div>
        </li>
        {#each highscores.scores as highscore}
            <li class="highscores-modal__item">
                <div>
                    {highscore.rows} by {highscore.columns}
                </div>
                <div>
                    {highscore.username}
                </div>
                <div>
                    {highscore.topScore}
                </div>
                <div>
                    {new Date(highscore.created_at).toLocaleDateString()}
                </div>
            </li>
        {/each}
    </ul>
</div>

<style lang="postcss">
    .highscores-modal__headers {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #000000;
        padding: 10px;
        background-color: #f1f1f1;
    }
    .highscores-modal__item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #000000;
        padding: 10px;
        background-color: #f1f1f1;
    }
</style>