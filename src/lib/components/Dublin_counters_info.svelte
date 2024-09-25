<script>
  // right hand side if we are looking at counters

  import LinePlot from "./LinePlot.svelte";
  import LinePlot_hourly from "./LinePlot_hourly.svelte";

  import { metricToggle } from "../../stores/filterData";
  import {
    selected_counter,
    counter_data,
    counter_name,
  } from "../../stores/region";


  let a;
  let w = 175;
  let filtData = [];
  let filtData2 = [];
  let b = [];
  let c = [];
  let groups = {};
  let ttype = ''

  let g = [];

  let prev = "val";

  $: {

    if ($metricToggle == "walk_counter") {
      prev = "val";
    }

    if ($metricToggle == "cycle_counter") {
      prev = "val";
    }

    if ($metricToggle == "active_counter") {
      prev = "val";
    }

  }


  $: a = $counter_data;

  $: {
    if (a != prev) {
      console.log($selected_counter);

      filtData = [];
      filtData2 = [];
      g = [];
      groups = {};
      b = [];
      c = [];

      console.log(a["sixMonths"]);

      a["lastMonth"].forEach(function (d) {
        if (d.travelMode == "pedestrian" && $metricToggle == "walk_counter") {
          filtData.push(d);
        }

        if (d.travelMode == "bike" && $metricToggle == "cycle_counter") {
          filtData.push(d);
        }

        if ($metricToggle == "active_counter") {
          filtData.push(d);
        }
      });

      if (filtData.length > 0) {
        b = filtData[0].data;
        console.log(b);

        b.forEach(function (o) {
          o.date = new Date(o.timestamp);
          let hour = o.date.getHours();
          if (hour in groups) {
            groups[hour] += o.counts;
          } else {
            groups[hour] = o.counts;
          }
        });

        for (let jj = 0; jj < 24; jj++) {
          g.push({ time: jj, counts: groups[jj] / 180 });
        }

        console.log("g");
        console.log(g);
      }

      a["sixMonths"].forEach(function (d) {
        ttype = d.travelMode

        if (d.travelMode == "pedestrian" && $metricToggle == "walk_counter") {
          filtData2.push(d);
        }

        if (d.travelMode == "bike" && $metricToggle == "cycle_counter") {
          filtData2.push(d);
        }

        if ( $metricToggle == "active_counter") {
          filtData2.push(d);
          
        }
      });

      if (filtData2.length > 0) {
        c = filtData2[0].data;
        c.forEach(function (o) {
          o.counts = o.traffic.counts;
        });
      }
      prev = a;
    }




    
  }
</script>

<div class="overall2" bind:clientWidth={w}>
  <h2 class="dublin-header">{$counter_name}</h2>
</div>
<br />
<div class="overall2" bind:clientWidth={w}>
  {#if c.length > 0 && prev != "val"}
    <div>
      <LinePlot data={c} width={w}  {ttype} />
    </div>
  {/if}
</div>
<br />
<div class="overall2" bind:clientWidth={w}>
  {#if g.length > 0 && prev != "val"}
    <div>
      <LinePlot_hourly data={g} width={w} {ttype} />
    </div>
  {/if}
</div>

<style>
  .overall {
    border: 0px solid #f5f5f5;
    background: whitesmoke;
    border-radius: 30px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0);
    padding: 18px 18px;
  }

  .dublin-header {
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
    margin-bottom: 10px;
  }

  .flex-items {
    display: flex;
    gap: 54px;
  }

  .flex-items2 {
    display: flex;
    gap: 15px;
  }

  .overall2 {
    border: 0px solid #f5f5f5;
    background: whitesmoke;
    max-width: 50vw;
    width: 50vw;
    border-radius: 30px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0);
    padding: 18px 18px;
  }

  .item {
    display: flex;
    flex: 1 1 50%;
    gap: 6px;
  }

  .icon {
    flex: 0 1 30px;
    width: 32px;
    height: 32px;
    margin-top: 6px;
  }

  .text {
    flex: 0 1 auto;
    text-transform: uppercase;
    cursor: pointer;
  }

  .text2 {
    flex: 0 1 auto;
    cursor: pointer;
  }

  .number {
    font-size: 24px;
    font-style: normal;
    font-weight: 300;
    line-height: 137.5%; /* 41.25px */
    margin-bottom: 0;
  }

  .number2 {
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    line-height: 137.5%; /* 41.25px */
    margin-bottom: 0;
  }

  .label {
    font-size: 14px;
    font-style: normal;
    color: #516dae;
    font-weight: 700;
    line-height: 150%; /* 24px */
    margin-bottom: 0;
  }

  @media screen and (max-width: 450px) {
    .dublin-header {
      font-size: 24px;
      line-height: 137.5%;
    }

    .number {
      font-size: 24px;
      line-height: 150%; /* 36px */
    }

    .label {
      font-size: 16px;
      line-height: 150%; /* 24px */
      cursor: pointer;
    }
    .flex-items {
      flex-direction: column;
      gap: 9px;
    }
    .item:not(:first-of-type) {
      border-top: 1px solid #ececec;
      padding-top: 10px;
    }
  }
</style>
