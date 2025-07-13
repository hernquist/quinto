<script>
	import Tiles from './menu-items/tiles/Tiles.svelte';
    import ViewList from './menu-items/view-list/ViewList.svelte';
</script>

<ul>
    <li><ViewList /></li>
    <li><Tiles /> </li>
    <li>level   </li>
   <li>USER</li>
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
    }
    li {
        background-color: #f0f0f0;
        border-radius: 5px;
        display: block; /* Allows for padding and margin */
        text-align: center;
        padding: 8px 8px;
        text-decoration: none;
        margin: 4px 0;
    }
    li:hover {
        background-color: #e0e0e0;
        color: black;
    }
</style>
    
