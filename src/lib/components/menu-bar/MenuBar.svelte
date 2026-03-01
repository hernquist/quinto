<script>
    import { page } from '$app/stores';
    import ViewList from './menu-items/view-list/ViewList.svelte';
    import MenuBarTiles from './menu-items/menu-bar-tiles/MenuBarTiles.svelte';
    import GameMultiple from './menu-items/game-multiple/GameMultiple.svelte';
	import Level from './menu-items/level/Level.svelte';
	import User from './menu-items/user/User.svelte';
</script>

<ul>
    <li class:inactive={$page.url.pathname === '/directions'}><ViewList inactive={$page.url.pathname === '/directions'} /></li>
    <li><MenuBarTiles /> </li>
    <li><GameMultiple /></li>
    <li><Level /></li>
    <li><User /></li>
</ul>

<style>
    ul {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        list-style-type: none;
        padding: 0;
        margin: 0;
        background-color: #333; /* Example background color */
        overflow: hidden; /* Handles content overflow */
        position: fixed; /* Makes the navbar fixed at the top */
        top: 0; /* Positions the navbar at the top */
        width: 100%; /* Makes the navbar span the full width */
        height: 64px; /* Sets a fixed height for the navbar */
    }

    li {
        background-color: lemonchiffon;
        border-radius: 5px;
        display: block; /* Allows for padding and margin */
        text-align: center;
        padding: 0px 2px;
        text-decoration: none;
        margin: 4px 0;
    }

    li:hover {
        background-color: #e0e0e0;
        color: black;
    }

    li.inactive {
        opacity: 0.6;
        pointer-events: none;
    }
</style>
    
