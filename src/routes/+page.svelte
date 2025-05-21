<script>
	import Game from "$lib/components/game/Game.svelte";
    import { signIn, signOut } from "@auth/sveltekit/client";

    import { page } from "$app/state";
    // old syntax, fix or remove
    export let data;

    console.log("page", page)
    console.log("page", page.data.session)

</script>

<div style="margin: 100px 20px;">
    {#if page.data.session}
        you are logged in
        <button>SIGN OUT</button>
    {:else}
        you are logged out
        <button onclick={()=> signIn("resend")}>SIGN IN</button>
    {/if}
    <h1>Database Version</h1>
    <p>{data.version}</p>

    <Game/>
</div>

<style lang="postcss">
    @reference "tailwindcss";
</style>

