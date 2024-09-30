<script>
  import { onMount } from "svelte";
  import "../../../node_modules/mapbox-gl/dist/mapbox-gl.css";

  import { newMapStore, mapStore,plotLanes} from "../../stores/map";
  import { modeToggle, modeToggleOptions, censusOptions, dataOptions, visMode, metricLabel} from "../../stores/filterData";
  import {showLanes} from "../../stores/region";
  import MapLegend from "./MapLegend.svelte";
   
  export let selected;
  export let cmode;
  export let dmode;

  let val = false

  $: {
    showLanes.set(val)
    plotLanes()
  }



  // declare map element
  let mapEl;


  // on mount, initialize and load map
  onMount(() => {
    $mapStore = newMapStore(mapEl);
    $mapStore.onLoad();
  });

</script>

<div class="im-the-map-box" >
  <div id="mapbox-map" bind:this={mapEl} />
  <div class="top-banner">
    <h2 class="dublin-header">{$metricLabel}</h2>
    </div>


<div class="toggles">
  {#if $visMode!='strava'}
  <select class='sel' bind:value={$modeToggle}>
    {#each $modeToggleOptions as question}
      <option value={question}>
        {question}
      </option>
    {/each}
  </select>
  <br>
  {/if}
  {#if $visMode=='census'}
  <select class='sel' bind:value={cmode}>
    {#each $censusOptions as question}
      <option value={question}>
        {question}
      </option>
    {/each}
  </select>
  <br>
  <select class='sel' bind:value={dmode}>
    {#each $dataOptions as question}
      <option value={question}>
        {question}
      </option>
    {/each}
  </select>
  <br>
  {/if}

  <label class='check'> {'Show bike lanes '} </label>
    <input
      type="checkbox" class='box' bind:checked={val}
 />

</div>

  {#if (selected!='temp' && selected !='strava') }

<div class='toggle-box'>
  <div class="legend-box">
    <MapLegend/>
  </div>
</div>
{/if}

</div>

<style>

input[type=checkbox] {
    transform: scale(1.2);
}


  .dublin-header {
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 500;
    color: #324754;
  }



  .sel{
    font-family: 'Work Sans';
    border-radius: 5px;
    border-color: #aaa;
    border: 2px solid #aaaaaa88;
    background-color: #ffffffdd;
    font-size: .9rem;
    margin-bottom: 6px;
  }


  .check{
    font-family: 'Work Sans';
    font-size: .9rem;
  
  }


  .im-the-map-box {
    flex: 1 1 50% !important;
    display: flex;
    position: relative;
    
  }

  #mapbox-map {
    height: calc(100svh - 90px);
    max-height: calc(100svh - 90px);
    width: 100%;
    flex: 0 1 100%;
    border-radius: 15px;
    box-sizing: border-box;
    border: 5px solid #ffffff;
    min-height: 450px;



  }
  :global(.mapboxgl-canvas-container){
    width: 100% !important;
  }
  
  .legend-box{
    width: 96%;
    bottom: 0px;
    
  }

  

  @media screen and (max-width: 768px) {
    #mapbox-map {
      min-height: 550px;
      max-height: 625px;
    }


    .toggle-box{
bottom: 40px !important;
width: 75% !important;

    }


  }


  .top-banner {
    position: absolute;
    left: 0px;
    top: 0px;
    width: calc(100% - 20px);
    background-color: #a7c9de;
    min-height: 16px;
    height: fit-content;
    padding-left:10px;
    padding-right:10px;
    padding-top: 5px;
    padding-bottom: 5px;

    -moz-border-radius: 0px;
-webkit-border-radius: 15px 15px 0px 0px;
border-radius: 15px 15px 0px 0px;     font-size: 1rem;

    /* padding: 16px 25px 25px 25px; */
  }


  .toggles {
    position: absolute;
    left: 20px;
    top: 70px;
    background-color: #ffffffaa;
    padding:10px;
    border-radius: 15px;
    margin: 5px;
    font-size: 1rem;
    /* padding: 16px 25px 25px 25px; */
  }

  .toggle-box{
    position: absolute;
    width: 80%;
    margin-left:5%;
    margin-right:5%;
    height: 100px;
    background: #ffffffbb;
    bottom: 145px;
    border-radius: 15px;
  }

</style>
