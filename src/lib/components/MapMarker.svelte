<script>
  import { scaleSqrt } from "d3";
  import { zoomLevelNumber } from "../../stores/map";
  import { selected_counter, counter_name } from "../../stores/region";
  import { metricToggle } from "../../stores/filterData";

  export let data;

  // Define a responsive scale for marker size based on value range and zoom level
  let h = 0;
  $: rScale = scaleSqrt()
    .domain([0, 50000])
    .range([$zoomLevelNumber, $zoomLevelNumber * 4]);

  // Update marker size `h` based on current metric toggle and mode
  $: {
    const isPedestrianMode =
      data.mode === "pedestrian" && $metricToggle === "walk_counter";
    const isBikeMode =
      data.mode === "bike" && $metricToggle === "cycle_counter";
    const isActiveCounterMode = $metricToggle === "active_counter";

    h =
      isPedestrianMode || isBikeMode || isActiveCounterMode
        ? rScale(data.value)
        : 0;
  }

  // Define marker background color based on mode
  $: backgroundColor = data.mode === "pedestrian" ? "#374c80" : "#955196";

  // Handle marker click to update selected counter and name
  function handleMarkerClick() {
    selected_counter.set(data.id);
    counter_name.set(data.name);
  }
</script>

<div
  class="marker"
  style="
    opacity: 0.7;
    background-color: {backgroundColor};
    background-size: {h}px {h}px;
    height: {h}px;
    width: {h}px;
  "
  on:click={handleMarkerClick}
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
</style>
