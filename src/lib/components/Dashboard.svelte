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

let subname = ''

$: {if(['google','census'].includes($visMode))
{subname='boundary data'}
else{
  subname= 'route-based data'
}

}

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


    <div class="dashboard-title">{"Dublin Region Active Travel Dashboard"}</div>
    <!-- <div class="dashboard-subtitle">{subname}</div> -->

    <div class="map-element" >
      <MapComponent selected={$visMode} bind:cmode={$censusMode} bind:dmode={$dataMode} />
      <Sidebar width={width} bind:cmode={$censusMode} bind:dmode={$dataMode} />
    </div>
  </div>
</main>

<style>
  main {
    display: grid;
    grid-template: "nav content" min-content;
  }

  .dashboard-title {
    font-family: var(--font-family-sans);
    font-size: var(--font-size-2xl);
    font-style: normal;
    color: #324754;
    font-weight: 300;
    line-height: 125%; /* 45px */
    padding-top:10px;
    padding-left: 20px;
    padding-bottom:5px;
  }

  .dashboard-subtitle {
    font-family: 1.2rem;
    font-size: var(--font-size-1xl);
    font-style: normal;
    color: #324754;
    font-weight: 600;
    line-height: 125%; /* 45px */
    padding-top:4px;
    padding-left: 22px;
    padding-bottom:10px;
    text-transform: uppercase;
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
    padding-top: 10px;
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
