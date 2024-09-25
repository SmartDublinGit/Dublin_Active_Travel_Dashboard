<script>

  export let data
  import {scaleSqrt} from 'd3'
  import { zoomLevelNumber } from "../../stores/map";
  import {selected_counter,counter_data,counter_name } from "../../stores/region";
  import {metricToggle} from "../../stores/filterData";

  import {get} from "svelte/store";



$: rScale = scaleSqrt()
			.domain([0,50000])
			.range([$zoomLevelNumber,$zoomLevelNumber*3])

let total = ''




let h = 0

$:  { 
    if (((data.mode=='pedestrian')&&($metricToggle=='walk_counter'))||((data.mode=='bike')&&($metricToggle=='cycle_counter'))||($metricToggle=='active_counter')){
      h=rScale(data.value)
    }
    else{
      h=0
    }
} 

</script>




<div
  class="marker"
  style="opacity: {.7}; 
  background-color: {data.mode=='pedestrian'?'#374c80':'#955196'};
  background-size: {h}px {h}px; height: {h}px; width: {h}px;"
  on:click={function(){
  selected_counter.set(data.id)
  counter_name.set(data.name)
  }}
/>


<style>
  .marker {
    z-index: 4;
    transition: ease-in-out 250ms;
    border-radius: 40px;
    background-position: top;
    background-repeat: no-repeat;
    opacity: 0.7;
  }

  .marker.selected {
    border: 3px solid white;
  }
</style>
