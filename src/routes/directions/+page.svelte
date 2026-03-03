<script lang="ts">
  function handleBack() {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }
</script>

<div class="directions__fullscreen">
  <div class="directions__header">
    <h1>Directions</h1>
    <button type="button" class="directions__back" aria-label="Return to previous page" on:click={handleBack}>
      ← Back
    </button>
  </div>

  <div class="directions__content">
    <p><strong>Quinto</strong> is a numbers puzzle game. Place tiles on the board to form horizontal and vertical lines. Your score depends on whether each line’s sum is a multiple of the game multiple (defaulted to 5).</p>

    <h2>How to play</h2>
    <ul>
      <li><strong>Starting square:</strong> On the first move of the game, place one or more of your tiles adjacent to the starting square (the square with the dashed border in the center of the board).</li>
      <li><strong>Placing tiles:</strong> On your turn, place one or more tiles from your hand onto empty squares. New tiles must be placed next to tiles already on the board (horizontally or vertically adjacent).</li>
      <li><strong>Scoring:</strong> When you finish your turn, every new horizontal and vertical line that includes your placed tiles is scored. If a line’s sum is a multiple of the game multiple (e.g. 5), you gain that sum as points. If it is not a multiple, you lose that sum as points.</li>
      <li><strong>Finish turn:</strong> When you’re done placing tiles for the turn, tap “Finish turn” to score and pass play to your opponent.</li>
    </ul>

    <h2>Tips</h2>
    <p>Try to form lines that sum to a multiple of the game multiple (5, 10, 15, …) to score points, and avoid leaving lines that don’t sum to a multiple, or you’ll lose points.</p>
  </div>
</div>

<style lang="postcss">
  .directions__fullscreen {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    background: #447799;
    padding: 24px;
    overflow: hidden;
  }

  .directions__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .directions__back {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    margin-bottom: 16px;
    max-width: 100px;
  }

  .directions__back:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .directions__fullscreen h1 {
    margin: 0 0 20px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-weight: 700;
    font-size: 28px;
    color: #fff;
  }

  .directions__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #fff;
  }

  .directions__content p {
    margin: 0 0 16px;
  }

  .directions__content h2 {
    margin: 24px 0 12px;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }

  .directions__content ul {
    margin: 0 0 16px;
    padding-left: 24px;
  }

  .directions__content li {
    margin-bottom: 10px;
  }
</style>
