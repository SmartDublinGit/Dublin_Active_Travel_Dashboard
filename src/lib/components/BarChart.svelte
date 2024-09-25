<script>
    // Your JSON data (this would typically be passed as a prop or fetched from an API)
    let data = [
      {
        AUTOMOBILE_trips: 477816310,
        AUTOMOBILE_full_distance_km: 6858249436,
        AUTOMOBILE_gpc_distance_km: 3731595088.0,
        AUTOMOBILE_full_co2e_tons: 1246487.4985999998,
        AUTOMOBILE_gpc_co2e_tons: 678217.7682999999,
        CYCLING_trips: 30512997,
        CYCLING_full_distance_km: 130597099,
        CYCLING_gpc_distance_km: 82458101.0,
        CYCLING_full_co2e_tons: 0.0,
        CYCLING_gpc_co2e_tons: 0.0,
        ON_FOOT_trips: 297928392,
        ON_FOOT_full_distance_km: 307468417,
        ON_FOOT_gpc_distance_km: 248582587.5,
        ON_FOOT_full_co2e_tons: 0.0,
        ON_FOOT_gpc_co2e_tons: 0.0,
        TOTAL_trips: 840757176,
        walk_pct: 0.3543572395,
        cycle_pct: 0.0362922826,
        active_pct: 0.3906495221,
        PUBLIC_trips: 65012474,
        PUBLIC_full_distance_km: 991490058,
        PUBLIC_gpc_distance_km: 517739050.5,
        PUBLIC_full_co2e_tons: 170052.1914,
        PUBLIC_gpc_co2e_tons: 95849.3202,
      },
    ];
  
    // Extract GPC emissions for the relevant transport modes
    let gpcEmissions = [
      { label: "AUTOMOBILE", value: data[0].AUTOMOBILE_gpc_co2e_tons },
      { label: "PUBLIC", value: data[0].PUBLIC_gpc_co2e_tons },
      { label: "CYCLING", value: data[0].CYCLING_gpc_co2e_tons },
      { label: "ON FOOT", value: data[0].ON_FOOT_gpc_co2e_tons }
    ];
  
    // Calculate the max value for scaling the bar lengths
    let maxValue = Math.max(...gpcEmissions.map(emission => emission.value));
  </script>
  
  <div class="chart-container">
    <svg width="100%" height={gpcEmissions.length * 50}>
      {#each gpcEmissions as emission, i}
        <!-- Label for the axis -->
        <text
          x="100"
          y={(i + 1) * 50 - 15}
          class="label"
          style="text-anchor: end;"
        >
          {emission.label}
        </text>
  
        <!-- Bar for each emission value -->
        <rect
          class="bar"
          x="110"
          y={(i * 50) + 30}
          width={(emission.value / maxValue) * 400}
          height="20"
        />
  
        <!-- Value next to the bar -->
        <text
          x={120 + (emission.value / maxValue) * 400}
          y={(i + 1) * 50 - 15}
          class="value"
        >
          {emission.value.toFixed(2)} tons
        </text>
      {/each}
    </svg>
  </div>


  <style>
    .chart-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
  
    .bar {
      fill: steelblue;
    }
  
    .label {
      font-size: 14px;
      text-anchor: end;
      alignment-baseline: middle;
    }
  
    .value {
      font-size: 14px;
      text-anchor: start;
      alignment-baseline: middle;
    }
  
    svg {
      font-family: sans-serif;
    }
  </style>
  