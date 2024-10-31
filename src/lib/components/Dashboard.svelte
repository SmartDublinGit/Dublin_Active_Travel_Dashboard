<script>
  // Component and asset imports
  import Sidebar from "./Sidebar.svelte";
  import MapComponent from "./MapComponent.svelte";
  import Menu from "./Menu.svelte";
  import img from '$lib/images/Smart-Dublin-Large.png';

  // State variables and stores
  let width = 0;
  let subname = '';

  // Store imports
  import { mapStore } from "../../stores/map";
  import { metricToggle, metricToggleOptions, visMode, censusMode, dataMode } from "../../stores/filterData";
  import { RegionID } from "../../stores/region";

  // Reactive statement to set subname based on visMode
  $: subname = ['google', 'census'].includes($visMode) ? 'boundary data' : 'route-based data';

  // Update map layer and reset map when options change
  $: if ($metricToggle && $mapStore && $metricToggleOptions) {
    RegionID.set("999999");
    $mapStore.changeActiveLayer($metricToggle, $metricToggleOptions);
    $mapStore.resetMap();
  }
</script>

<main>
  <Menu />
  <div class="container" bind:clientWidth={width}>
    <div class="dashboard-title">{"Dublin Region Active Travel Dashboard"}</div>
    <a href="https://smartdublin.ie/" target="_blank">
      <img class="img" src={img} alt="Smart Dublin Logo" />
    </a>
    <div class="map-element">
      <MapComponent selected={$visMode} bind:cmode={$censusMode} bind:dmode={$dataMode} />
      <Sidebar {width} bind:cmode={$censusMode} bind:dmode={$dataMode} />
    </div>
  </div>
</main>

<style>
  .img {
    position: absolute;
    width: 150px;
    top: 7px;
    right: 0;
  }

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
    padding: 10px 0 0 20px;
    width: calc(100% - 160px);
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
    padding: 20px;
  }

  @media screen and (max-width: 768px) {
    .map-element {
      flex-direction: column;
    }

    .img {
      width: 110px;
    }

    .dashboard-title {
      font-size: var(--font-size-2xl);
    }
  }
</style>
