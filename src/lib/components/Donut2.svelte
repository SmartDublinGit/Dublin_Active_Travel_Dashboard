<script>
    import * as d3 from "d3";
  
    export let data = [];

  let finalData, keys

let pct 

console.log(data)
console.log('dataaa')

keys = Object.keys(data)
pct = []
finalData = []

console.log(keys)

keys.forEach(function(d){
if ((d.includes('trips')) & ~(d.includes('TOTAL'))){

  finalData.push({ label: d, value: data[d] })
}})

console.log('finalData')
console.log(finalData)  


    let chartElement;
    let width = 300;
    let height = 300;
    let radius = Math.min(width, height) / 2;
    let innerRadius = radius - 60;
    let selectedPercentage = "";

      const color = d3.scaleOrdinal(d3.schemeCategory10);
  
      const pie = d3.pie().value(d => d.value)(finalData);
      const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);
  
      const svg = d3
        .select(chartElement)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);
  
      // Draw arcs
      svg
        .selectAll("path")
        .data(pie)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label))
        .on("click", function (event, d) {
          const percentage = ((d.data.value / d3.sum(data, d => d.value)) * 100).toFixed(2);
          selectedPercentage = `${percentage}%`;
        });
  
      // Add text in the center for selected percentage
      svg
        .append("text")
        .attr("class", "percentage-text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("font-size", "24px")
        .text(selectedPercentage);
    
    
  </script>
  
  <style>
    .legend {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      font-family: Arial, sans-serif;
    }
  
    .legend-item {
      margin-right: 20px;
      font-size: 14px;
    }
  
    svg {
      display: block;
      margin: 0 auto;
    }
  </style>
  
  <div>
    <!-- Donut Chart -->
    <svg bind:this={chartElement}></svg>
  
    <!-- Legend -->

  </div>










  