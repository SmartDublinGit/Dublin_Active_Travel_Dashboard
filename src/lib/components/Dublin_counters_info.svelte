<script>
    // right hand side if we are looking at census data

    import { format } from "d3";
    import { resetMap } from "../../stores/map";

    import LinePlot from "./LinePlot.svelte";

    import { dataMode, metricToggle } from "../../stores/filterData";
    import {
        selected_counter,
        counter_data,
        counter_name,
    } from "../../stores/region";

    export let width;

    let sel = "";
    let f = format(",.0f");

    let txt =
        "This is a live view of pedestrian and cycling counters in Dublin, accessed through the Eco-visio API. Click on a counter for pedestrian and/or cycling footfall over different time periods. Note: there are issues with some counters, which Eco-Visio are investigating.";
    let tit = "this view ";


    async function add(a) {
        console.log("adding");
        const response = await fetch("api/", {
            method: "POST",
            body: JSON.stringify({ a }),
            headers: {
                "content-type": "application/json",
            },
        });
        let total = await response.json();


        counter_data.set(total);
     

        if (counterMode == "By month (last 3 years)") {
            prep_data(total, "sixMonths_yearly",(12*3));
           
        }

        if (counterMode == "By week (last year)") {
            prep_data(total, "sixMonths_weekly",12);
        }

        if (counterMode == "By week (last 3 months)") {
            prep_data(total, "sixMonths",3);
        }

        if (counterMode == "By hour (last 30 days)") {
            prep_data(total, "lastMonth",1);
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


    $: {
        if ($metricToggle != prev_menu) {
            counter_name.set("Grand Canal Cycle Path - Lock C5");
            selected_counter.set("100043587");
            add($selected_counter);
            prev_menu = $metricToggle;
        }
    }

    $: {
        if (counterMode != prev) {
            c=[]
            add($selected_counter);
            prev = counterMode;
        }
    }

    $: {
      
        add($selected_counter);
    }


    let a;
    let w = 500;
    let filtData = [];
    let filtData2 = [];
    let b = [];
    let c = [];
    let groups = {};
    let ttype = "";
    let median = "";

    let prev_menu = "";

    let counterMode = "By week (last 3 months)";
    let prev = "By week (last 3 months)";


    function prep_data(a, timeseries,div) {
        filtData = [];
        filtData2 = [];
        groups = {};
        b = [];
        c = [];

        if (timeseries == "lastMonth") {
            a["lastMonth"].forEach(function (d) {
                if (
                    d.travelMode == "pedestrian" &&
                    $metricToggle == "walk_counter"
                ) {
                    filtData.push(d);
                    ttype = d.travelMode;

                }

                if (
                    d.travelMode == "bike" &&
                    $metricToggle == "cycle_counter"
                ) {
                    filtData.push(d);
                    ttype = d.travelMode;

                }

                if ($metricToggle == "active_counter") {
                    filtData.push(d);
                    ttype = d.travelMode;

                }
            });

            if (filtData.length > 0) {
                totalMap = {}
       
                filtData.forEach(function(dd){
                    updateTotals(dd.data)
                })

                b = Object.values(totalMap);

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
                    c.push({ time: jj, counts: groups[jj] });
                }

                median = calculateTot(c)/div;

            }
        } else {
            a[timeseries].forEach(function (d) {

                if (
                    d.travelMode == "pedestrian" &&
                    $metricToggle == "walk_counter"
                ) {
                    filtData2.push(d);
                    ttype = d.travelMode;

                }

                if (
                    d.travelMode == "bike" &&
                    $metricToggle == "cycle_counter"
                    
                ) {
                    filtData2.push(d);
                    ttype = d.travelMode;

                }

                if ($metricToggle == "active_counter") {
                    filtData2.push(d);
                    ttype = d.travelMode;

                }
            });

            if (filtData2.length > 0) {

                totalMap = {}
                console.log(filtData2)
                console.log('filtData2')


                filtData2.forEach(function(dd){
                    updateTotals(dd.data)
                })

                c = Object.values(totalMap);
                c = filtData2[0].data;
                c.forEach(function (o) {
                    o.counts = o.traffic.counts;
                });
            }

            median = calculateTot(c)/div;
        }
    }
</script>

<div class="container">
    <div
        class="overall2"
        on:click={function () {
            sel = "";
            resetMap();
        }}
    >
        <h2 class="dublin-header">{"Pedestrian & Cycle counter data"}</h2>

        <div class="flex-items3">
            <div class="a1">
                <div class="text">
                    <p class="label">Counter name</p>
                    <p class="loc">{$counter_name}</p>
                </div>
            </div>
            <div class="a1">
                <div class="text">
                    <p class="label">{'Daily '+ (ttype=='pedestrian'?'Pedestrians':"Cyclists")} </p>
                    <p class="number" style='color:{ttype!='pedestrian'?'#955196':'#374c80'}'>{f(median/30)}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="overall2" style="min-width:100px">
        <div class="text2">
            <h2 class="dublin-header">{"Time Series"}</h2>
            <div class="text">
                    <div class="a1">
                        <p class="label" style="margin-bottom: 0px;">
                            {"Historical "+(ttype=='pedestrian'?'Pedestrian ':"Cyclist ")+'counts'}
                        </p>
                    </div>

                    <div class="a2">
                        <select class="sel" bind:value={counterMode}>
                            {#each ["By hour (last 30 days)", "By week (last 3 months)", "By week (last year)", "By month (last 3 years)"] as question}
                                <option value={question}>
                                    {question}
                                </option>
                            {/each}
                        </select>
                    </div>
                
            </div>
            {#if c.length > 0}
                <LinePlot data={c} width={width / 2} {ttype} plot_type={counterMode} />
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
