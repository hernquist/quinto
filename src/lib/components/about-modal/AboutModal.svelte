<script lang="ts">
</script>

<div class="about-modal__container">
    <h2>Quinto </h2>
    <div class="about-modal__content">
        <p>Quinto is a numbers puzzle game where players place tiles to form vertical and horizontal sums. Scoring is dependent on a players ability to form sum that are multiples of the game multiple. It is a game of strategy and deduction.</p>
        <p>Developed, Designed, and Engineered by David Hernquist</p>
    </div>
</div>

<style lang="postcss">
    .about-modal__container {
        padding: 1rem 0;
        max-width: 332px;
        display: flex;
        flex-direction: column;
        min-height: 0;

        @media screen and (min-width: 600px) {
            max-width: 392px;
        }
    }
    .about-modal__content {
        overflow-y: auto;
        min-height: 0;
        max-height: 12rem;
    }
    h2 {
        margin: 0 0 0.5rem;
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    p {
        margin: 0;
        font-size: 14px;
    }
</style>
