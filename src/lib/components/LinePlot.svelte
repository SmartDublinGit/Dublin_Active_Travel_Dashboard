<script>
  // draws the line for the time series plots
  import * as d3 from "d3";

  // Receive plot data as prop.
  export let data;

  // The chart dimensions and margins as optional props.
  export let height = 200;
  export let marginTop = 15;
  export let marginRight = 30;
  export let marginBottom = 30;
  export let marginLeft = 80;
  export let ttype;
  export let width;
  export let plot_type;

  let formatTime

  $: {if(plot_type=='By month (average)'){
    formatTime=d3.utcFormat("%b")}
    else{
      formatTime=d3.utcFormat("%b '%y")}}

  let f = d3.format(",.0f");

  let color = "";
  let st = "";

  let line, area;

  $: {
    if (ttype == "pedestrian") {
      st = "pedestrians";
      color = "#374c80";
    } else {
      st = "cyclists";
      color = "#955196";
    }
  }

  let xScale;

  $: {
    if (plot_type == "By hour (last 30 days)") {
      xScale = d3.scaleLinear([0, 23], [marginLeft, width - marginRight]);
    } else {
      // Create the x (horizontal position) scale.
      xScale = d3.scaleUtc(
        d3.extent(data, (d) => new Date(d.timestamp)),
        [marginLeft, width - marginRight]
      );
    }
  }

  // Create the y (vertical position) scale.
  $: yScale = d3.scaleLinear(
    [0, d3.max(data, (d) => d.counts)],
    [height - marginBottom, marginTop]
  );

  // Define the line and area generators
  $: {
    if (plot_type == "By hour (last 30 days)"){
      line = d3
        .line()
        .x((d) => xScale(d.time))
        .y((d) => yScale(d.counts));

      area = d3
        .area()
        .x((d) => xScale(d.time))
        .y1((d) => yScale(d.counts))
        .y0(height - marginBottom);  // The bottom of the area
    }
    else {
      line = d3
        .line()
        .x((d) => xScale(new Date(d.timestamp)))
        .y((d) => yScale(d.counts));

      area = d3
        .area()
        .x((d) => xScale(new Date(d.timestamp)))
        .y1((d) => yScale(d.counts))
        .y0(height - marginBottom);  // The bottom of the area
    }
  }
</script>

{#if data}
<div bind:clientWidth={width}>
  <svg {width} {height}>
    <!-- X-Axis -->
    <g transform="translate(0,{height - marginBottom})">
      <line
        stroke="currentColor"
        x1={marginLeft - 6}
        x2={width - marginRight}
      />

      {#each xScale.ticks(4) as tick}
        <!-- X-Axis Ticks -->
        <line
          stroke="currentColor"
          x1={xScale(tick)}
          x2={xScale(tick)}
          y1={0}
          y2={6}
        />

        <!-- X-Axis Tick Labels -->
        <text fill="currentColor" text-anchor="middle" x={xScale(tick)} y={22}>
          {#if plot_type!="By hour (last 30 days)"}
          {formatTime(tick)}
          {:else}
          {tick+':00'}
          {/if}
        </text>
      {/each}
    </g>

    <!-- Y-Axis and Grid Lines -->
    <g transform="translate({marginLeft},0)">
      {#each yScale.ticks(4) as tick}
        {#if tick !== 0}
          <!-- Grid Lines. -->
          <line
            stroke="currentColor"
            stroke-opacity="0.1"
            stroke-width="1.5px"
            x1={0}
            x2={width - marginLeft - marginRight}
            y1={yScale(tick)}
            y2={yScale(tick)}
          />

          <!-- Y-Axis Ticks. -->
          <line
            stroke="currentColor"
            x1={0}
            x2={-6}
            y1={yScale(tick)}
            y2={yScale(tick)}
          />
        {/if}

        <!-- Y-Axis Tick Labels -->
        <text
          fill="currentColor"
          text-anchor="end"
          dominant-baseline="middle"
          x={-9}
          y={yScale(tick)}
        >
          {f(tick)}
        </text>
      {/each}
    </g>

    <!-- Area Under the Line -->
    <path fill={color} fill-opacity="0.4" d={area(data)} />

    <!-- Line Plot -->
    <path fill="none" stroke={color} stroke-width="2.5" d={line(data)} />
  </svg>
</div>
{/if}
