<script>
  import Dublin_info_redux from "./Dublin_info_redux.svelte";
  import Dublin_district_info_redux from "./Dublin_district_info_redux.svelte";
  import Dublin_counters_info_redux from "./Dublin_counters_info_redux.svelte";
  import Dublin_strava_info_redux from "./Dublin_strava_info_redux.svelte";

  import { visMode } from "../../stores/filterData";
  
  export let cmode
  export let dmode
  export let width
</script>


<div class="map-info">
  {#if $visMode == "census"}
    <Dublin_info_redux bind:cmode={cmode} bind:dmode={dmode}/>
  {:else if $visMode == "google"}
    <Dublin_district_info_redux />
    {:else if $visMode == "strava"}
    <Dublin_strava_info_redux width={width}  />
  {:else}
    <Dublin_counters_info_redux width={width} />
  {/if}
</div>

<style>
  .map-info {
    flex: 1 1 50%;
  }
</style>
