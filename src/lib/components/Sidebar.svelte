<script>
  import Dublin_info from "./Dublin_info.svelte";
  import Dublin_district_info from "./Dublin_district_info.svelte";
  import Dublin_counters_info from "./Dublin_counters_info.svelte";
  import Dublin_strava_info from "./Dublin_strava_info.svelte";

  import { visMode } from "../../stores/filterData";

  export let cmode;
  export let dmode;
  export let width;
</script>

<div class="map-info">
  {#if $visMode == "census"}
    <Dublin_info bind:cmode bind:dmode />
  {:else if $visMode == "google"}
    <Dublin_district_info />
  {:else if $visMode == "strava"}
    <Dublin_strava_info {width} />
  {:else}
    <Dublin_counters_info {width} />
  {/if}
</div>

<style>
  .map-info {
    flex: 1 1 50%;
  }
</style>
