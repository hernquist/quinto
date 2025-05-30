<script>
    import { fade } from 'svelte/transition';
    import { fly } from 'svelte/transition'
    import { backOut } from 'svelte/easing'

    let { toastState, playerPosition } = $props(); 
</script>

<div 
    class="message__noTiles"
    in:fly={{
        y: 75,
        delay: 300 * 1,
        easing: backOut
      }}
>No Tiles</div>

<style>
    .message__noTiles {
       background-color: darkgoldenrod; 
       font-size: 20px;
       border-radius: 4px;
       padding: 0 4px;
       display: flex;
       align-items: center;
       justify-content: center;
    }
</style>


