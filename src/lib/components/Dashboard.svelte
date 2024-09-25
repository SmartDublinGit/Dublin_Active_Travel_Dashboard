<script>
  import Sidebar from "./Sidebar.svelte";
  import MapComponent from "./MapComponent.svelte";
  import Menu from "./Menu.svelte";

  let width = 0;

  import { mapStore } from "../../stores/map";
  import {
    metricToggle,
    metricToggleOptions,
    visMode,
    censusMode,
    dataMode
    
  } from "../../stores/filterData";
  import { RegionID } from "../../stores/region";

  // when i change one of the options.

  $: if ($metricToggle && $mapStore != null && $metricToggleOptions != null) {
    RegionID.set("999999");
    $mapStore.changeActiveLayer($metricToggle, $metricToggleOptions);
    $mapStore.resetMap();
  }
</script>

<main>
  <Menu />
  <div class="container"  bind:clientWidth={width}>
    <div class="map-element" >
      <MapComponent selected={$visMode} bind:cmode={$censusMode} bind:dmode={$dataMode} />
      <Sidebar width={width} bind:cmode={$censusMode} bind:dmode={$dataMode} />
    </div>
    <div class="dashboard-title">{"Dublin Active Travel"}</div>
  </div>
</main>

<style>
  main {
    display: grid;
    grid-template: "nav content" min-content;
  }

  .dashboard-title {
    font-family: var(--font-family-sans);
    font-size: var(--font-size-3xl);
    font-style: normal;
    color: #324754;
    font-weight: 300;
    line-height: 125%; /* 45px */
    position: absolute;
    top: 10px;
    left: 20px;
  }

  .container {
    width: 100%;
    height: 100%;
    position: relative;
    grid-area: content;
  }

  .map-element {
    width: calc(100% - 40px);
    display: flex;
    gap: 20px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 70px;
    padding-bottom: 20px;
  }

  @media screen and (max-width: 768px) {
    .map-element {
      flex-direction: column;
    }

  .dashboard-title {
    font-size: var(--font-size-2xl);  
    
  }}
</style>
