<script>
    // right hand side if we are looking at census data

    import { format } from "d3";
    import { resetMap } from "../../stores/map";

    import LinePlot from "./LinePlot.svelte";

    import {
        strava_track,
        strava_data
    } from "../../stores/region"; 

    export let width;

    let sel = "";
    let f = format(",.0f");

    let txt =
        "The Dublin Strava Cycling Model was developed by Smart Dublin to estimate the volume of bicycle traffic along key routes in Dublin. The model uses Strava Metro data as a basis to extrapolate the total estimated volume of bicycle traffic. Initially, the model has been applied to 5 different routes across the Dublin region for 2021-2023. For more information on the modelling approach please see <a href='https://github.com/SmartDublinGit/Strava-Cycling-Modeling-for-Dublin/blob/main/DOCUMENTATION.md' target = '_blank'> this link.</a>";
    let tit = "this view ";

    let trackData
    let c= []
    let median

    let routeName 

    let counterMode = "By week (last year)"


    function summarizeAverageByMonthAsDate(data) {
  const summary = {};

  data.forEach((item) => {
    const date = new Date(item.timestamp);
    const month = date.getMonth(); // Get month index (0 for Jan, 1 for Feb, etc.)

    if (!summary[month]) {
      // Create a new Date object for each unique month, defaulting to January 1, 1970
      summary[month] = { date: new Date(1970, month, 1), totalCounts: 0, occurrences: 0 };
    }

    summary[month].totalCounts += item.counts;
    summary[month].occurrences += 1;
  });

  console.log(summary)

  // Convert summary object to an array with date objects as keys and calculate average counts
  const result = Object.values(summary).map(item => ({
    timestamp: item.date,
    counts: item.totalCounts / item.occurrences
  }));

  return result;
}

function getLastNMonths(data, numMonths) {
  // Extract the year and month for each entry and store them as strings like "2021-01"
  const monthsSeen = new Set();
  const lastNMonthsData = [];

  // Sort data by timestamp first, to ensure the most recent months come last
  const sortedData = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Traverse from the end of the sorted data to capture the last 'numMonths' distinct months
  for (let i = sortedData.length - 1; i >= 0; i--) {
    const item = sortedData[i];
    const date = new Date(item.timestamp);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    // If the current month is not yet seen, add it to the months set and the data array
    if (!monthsSeen.has(monthKey)) {
      monthsSeen.add(monthKey);
    }

    // If we've already captured 'numMonths' distinct months, break the loop
    if (monthsSeen.size <= numMonths) {
      lastNMonthsData.unshift(item);  // Add the data in reverse order for chronological output
    } else {
      break;
    }
  }

  return lastNMonthsData;
}



    $: {
        c = []

        console.log($strava_data)
        if($strava_track=='Dodder'){
            routeName = 'Dodder Greenway'
        }

        if($strava_track=='DLR'){
            routeName = 'Dun Laoghaire Coastal'
        }

        if($strava_track=='K2TS'){
            routeName = 'Kilmainham to Thomas Street'
        }

        if($strava_track=='C2CC'){
            routeName = 'Clontarf to City Center'
        }

        if($strava_track=='Portmarnock'){
            routeName = 'Portmarnock Greenway'
        }

        trackData = $strava_data.map((d) => [d['date'], d[routeName]])

        trackData.forEach(function(d){
            c.push({ timestamp: d[0], counts: d[1] });
        })

        median = calculateTot(c)/trackData.length;


        if (counterMode =="By month (average)")

       { 
        console.log(c)
        c = summarizeAverageByMonthAsDate(c)
        console.log(c)

       }

       if (counterMode == "By week (last 3 months)")
       {
        c = getLastNMonths(c,3)
        console.log(c)
       }

       if (counterMode == "By week (last year)")
       {
        c = getLastNMonths(c,12)
        console.log(c)
       }

    }

    let totalMap 


  
// Function to update the totals
function updateTotals(data) {
  data.forEach(item => {
    if (totalMap[item.timestamp]) {
      totalMap[item.timestamp].counts += item.counts; // Add to the existing total
    } else {
      totalMap[item.timestamp] = { ...item }; // Create a new entry if id doesn't exist
    }
  });
}

    function calculateTot(data) {
        const totalCounts = data.reduce((acc, obj) => acc + obj.counts, 0);
        return totalCounts
    }


    // $: {
    //     if ($metricToggle != prev_menu) {
    //         counter_name.set("Grand Canal Cycle Path - Lock C5");
    //         selected_counter.set("100043587");
    //         add($selected_counter);
    //         prev_menu = $metricToggle;
    //     }
    // }

    

    // $: {
    //     if (counterMode != prev) {
    //         c=[]
    //         add($selected_counter);
    //         prev = counterMode;
    //     }
    // }

    // $: {
      
    //     add($selected_counter);
    // }

        
</script>

<div class="container">
    <div
        class="overall2"
        on:click={function () {
            sel = "";
            resetMap();
        }}
    >
        <h2 class="dublin-header">{"Route-based estimates"}</h2>

        <div class="flex-items3">
            <div class="a1">
                <div class="text">
                    <p class="label">Route</p>
                    <p class="loc">{routeName}</p>
                </div>
            </div>
            <div class="a1">
                <div class="text">
                    <p class="label">{'estimated Daily '+ "Cyclists"} </p>
                    <p class="number" style='color:{'#955196'}'>{f(median/7)}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="overall2" style="min-width:100px">
        <div class="text2">
            <h2 class="dublin-header">{"Time Series"}</h2>
            <div class="text">
                <div class="flex-items3">
                    <div class="a1">
                        <p class="label" style="margin-bottom: 0px;">
                            {"estimated Weekly cyclists"}
                        </p>
                    </div>

                   
                </div>


                <div class="a2">
                    <select class="sel" bind:value={counterMode}>
                        {#each ["By week (last 3 months)", "By week (last year)", "By week (last 3 years)","By month (average)"] as question}
                            <option value={question}>
                                {question}
                            </option>
                        {/each}
                    </select>
                </div>
            </div>

            {#if c.length > 0}
                <LinePlot data={c} width={width / 2} ttype={'cycle'} plot_type={counterMode} />
            {:else}
            <div class="text">
                <p class="loc">{"fetching data..."}</p>
            </div>
            {/if}

        </div>
    </div>

    <div class="overall2">
        <div class="text2">
            <h2 class="dublin-header">{"About " + tit}</h2>
            <div class="number2">{@html txt}</div>
        </div>
    </div>
</div>

<style>
    .container {
        height: 100svh;
        min-height: 100svh;
        flex: 1;
    }

    .dublin-header {
        font-size: 1.2rem;
        font-style: normal;
        font-weight: 500;
        background-color: #a7c9de;
        padding: 5px 0px 5px 5px;
        -moz-border-radius: 0px;
        -webkit-border-radius: 15px 15px 0px 0px;
        border-radius: 15px 15px 0px 0px;
        text-indent: 10px;
        color: #324754;
    }

    .flex-items {
        display: flex;
        gap: 10px;
    }

    .flex-items2 {
        display: flex;
        gap: 20px;
    }

    .flex-items3 {
        display: flex;
        gap: 5px;
    }

    .overall2 {
        background: white;
        width: 100%;
        border-radius: 15px;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0);
        padding-bottom: 2px;
        margin-bottom: 20px;
        cursor: pointer;
    }

    .item {
        display: flex;
        flex: 1 1 50%;
        gap: 6px;
    }

    .a1 {
        display: flex;
        flex: 1 1 50%;
    }

   

    .text {
        flex: 0 1 auto;
        text-transform: uppercase;
        padding: 10px;
        padding-left: 15px;
        padding-right: 15px;
        margin-bottom: 0px;
    }

    .text2 {
        min-width: 100px;
    }

    .number-green {
        font-size: 1.3rem;
        font-style: normal;
        text-transform: none;
        font-weight: 400;
        line-height: 137.5%; /* 41.25px */
        margin-bottom: 0;
        color: #955196;
    }

    .number {
        font-size: 1.5rem;
        font-style: normal;
        text-transform: none;
        font-weight: 400;
        line-height: 137.5%; /* 41.25px */
        margin-bottom: 0;
        color: #374c80;
    }

    .number2 {
        font-size: 1rem;
        font-style: 300px;
        font-weight: 300;
        line-height: 137.5%; /* 41.25px */
        margin-bottom: 0;
        padding: 15px;
    }

    .loc {
        font-size: 1.1rem;
        font-style: normal;
        color: #374c80;
        font-weight: normal;
        line-height: 120%;
        margin-bottom: 5px;
    }

    .label {
        font-size: 0.9rem;
        font-style: normal;
        color: #6d8495;
        font-weight: 700;
        line-height: 130%; /* 24px */
        margin-bottom: 6px;
        margin-top: 2px;
    }

    .a2 {
        display: flex;
        flex: 0 0 50%;
        align-items: right;
        justify-content: right;
        flex-direction: column;
        padding: 0px;
    }

    

    .sel {
        font-family: "Work Sans";
        border-radius: 5px;
        border-color: #aaa;
        border: 2px solid #aaaaaa88;
        background-color: #ffffffdd;
        font-size: 0.9rem;
        margin-top: 10px;
        width: fit-content;
    
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
            font-size: 1px;
            line-height: 150%; /* 24px */
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
