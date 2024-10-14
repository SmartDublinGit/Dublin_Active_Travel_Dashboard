<script>
  import * as d3 from "d3";

  export let data;

  let width = 250;
  let height = 250;
  let margin = 0;

  let final_data = {};
  let data_ready;
  let pct;
  let summ;

  let color = d3
    .scaleOrdinal()
    .domain([
      "AUTOMOBILE_trips",
      "PUBLIC_trips",
      "CYCLING_trips",
      "ON FOOT_trips",
    ])
    .range(["#e9547a", "#ff912b", "#955196", "#374c80"]);

  let labs = ["Car", "", "Bike", "Walk", "", ""];
  $: {
    let keys = Object.keys(data);
    pct = [];
    summ = 0;

    keys.forEach(function (d) {
      if (d.includes("trips") && !d.includes("TOTAL")) {
        pct.push(d);
        summ += data[d];
        final_data[d] = data[d];
      }
    });

    const dataArray = Object.entries(final_data);
    const sortedDataArray = dataArray.sort((a, b) => b[1] - a[1]);
    final_data = Object.fromEntries(sortedDataArray);
    data_ready = pie(Object.entries(final_data));
  }

  let radius = Math.min(width, height) / 2 - margin;

  // Compute the position of each group on the pie:
  const pie = d3
    .pie()
    .sort(null) // Do not sort group by size
    .value((d) => d[1]);

  function calculatePercentage(slice) {
    let dd = (slice.data[1] / summ) * 100;
    if (dd > 4) {
      return dd.toFixed(0) + "%";
    } else {
      return "";
    }
  }

  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  // The arc generator with corner radius (border-radius effect)
  const arc = d3
    .arc()
    .innerRadius(radius * 0.6)  // Inner radius for the donut hole
    .outerRadius(radius * 0.9)  // Outer radius for the arcs
    .cornerRadius(4);           // Rounded corners with 2px radius

  // Another arc that won't be drawn. Just for labels positioning
  const outerArc = d3
    .arc()
    .innerRadius(radius * 0.75)
    .outerRadius(radius * 0.75);
</script>

<svg
  {width}
  {height}
  viewBox="{-width / 2}, {-height / 2}, {width}, {height}"
  style:max-width="100%"
  style:height="auto"
>
  <g class="chart-inner">
    {#each data_ready as slice}
      <path d={arc(slice)} fill={color(slice.data[0])} stroke="white" />
    {/each}

    {#each data_ready as slice}
      <text
        transform={`translate(${outerArc.centroid(slice)})`}
        x={0}
        dy="0.35rem"
        text-anchor={midAngle(slice) < Math.PI ? "middle" : "middle"}
        font-size="16px"
        fill="#fff"
      >
        {calculatePercentage(slice)}
      </text>
    {/each}
  </g>
</svg>

<style>
  :global(body) {
    margin: 0;
  }

  .chart-inner {
    display: flex;
  }

</style>
