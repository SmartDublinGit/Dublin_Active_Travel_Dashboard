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
            </div>
            {#if c.length > 0}
                <LinePlot data={c} width={width / 2} ttype={'cycle'} plot_type={'By week (last year)'} />
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

    .a2 {
        display: flex;
        flex: 0 0 50%;
        align-items: right;
        justify-content: right;
        flex-direction: column;
        padding: 0px;
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

    .sel {
        font-family: "Work Sans";
        border-radius: 5px;
        border-color: #aaa;
        border: 2px solid #aaaaaa88;
        background-color: #ffffffdd;
        font-size: 0.9rem;
        margin-bottom: 6px;
        right: 50px;
        position: absolute;
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
