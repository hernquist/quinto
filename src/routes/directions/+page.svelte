<script lang="ts">
  function handleBack() {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }
</script>

<div class="directions__fullscreen">
  <button type="button" class="directions__back" aria-label="Return to previous page" on:click={handleBack}>
    ← Back
  </button>
  <h1>Directions</h1>
</div>

<style lang="postcss">
  .directions__fullscreen {
    position: fixed;
    top: 64px;
    width: 100%;
    min-height: 100vh;
    background: #447799;
    padding: 24px;
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
  }

  .directions__back:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .directions__fullscreen h1 {
    margin: 0;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-weight: 700;
    font-size: 28px;
    color: #fff;
  }
</style>
