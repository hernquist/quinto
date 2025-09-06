<script>
	import Game from "$lib/components/game/Game.svelte";

    export let data;
    console.log("data from +page.svelte-----------------", data);
    console.log("token from +page.svelte-----------------", data?.token);

</script>

<Game/>

<style lang="postcss">
    @reference "tailwindcss";
</style>