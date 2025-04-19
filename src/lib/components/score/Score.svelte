<script lang="ts">
	import { getPlayer } from "../../state/state.svelte";
	import { Players } from "../../state/types";

    const { Top, Bottom } = Players;
    const topPlayer = getPlayer(Top);
    const bottomPlayer = getPlayer(Bottom);
</script>

<div>{topPlayer.score} scoreboard {bottomPlayer.score}</div>