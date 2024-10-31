<script>
import { format } from "d3";
import { resetMap } from "../../stores/map";
import LinePlot from "./LinePlot.svelte";
import { metricToggle } from "../../stores/filterData";
import {
    selected_counter,
    counter_data,
    counter_name,
} from "../../stores/region";

// Constants
const DEFAULT_VIEW_MODE = "By week (last 3 months)";
const DEFAULT_LOCATION = "Grand Canal Cycle Path - Lock C5";
const DEFAULT_COUNTER_ID = "100043587";
const HOURS_IN_DAY = 24;
const MONTHS_IN_YEAR = 12;

const TIME_PERIOD_CONFIG = {
    "By month (last 3 years)": {
        apiKey: "sixMonths_yearly",
        divisor: MONTHS_IN_YEAR * 3
    },
    "By week (last year)": {
        apiKey: "sixMonths_weekly",
        divisor: MONTHS_IN_YEAR
    },
    "By week (last 3 months)": {
        apiKey: "sixMonths",
        divisor: 3
    },
    "By hour (last 30 days)": {
        apiKey: "lastMonth",
        divisor: 1
    }
};

// Exported props
export let width;

// State variables
let selectedLocation = "";
let numberFormatter = format(",.0f");
let descriptionText = "This is a live view of pedestrian and cycling counters in Dublin, accessed through the Eco-visio API. Click on a counter for pedestrian and/or cycling footfall over different time periods. Note: there are issues with some counters, which Eco-Visio are investigating.";
let viewTitle = "this view";
let timeSeriesData = [];
let currentTimeMode = DEFAULT_VIEW_MODE;
let previousTimeMode = DEFAULT_VIEW_MODE;
let previousMetricMode = "";
let travelModeType = "";
let averageCount = "";

// Data processing state
let aggregatedCounts = {};
let temporaryData = [];
let processedData = [];
let hourlyGroups = {};
let dailyDataPoints = [];

async function fetchCounterData(counterId) {
    const response = await fetch("api/", {
        method: "POST",
        body: JSON.stringify({ a: counterId }),
        headers: {
            "content-type": "application/json",
        },
    });
    const data = await response.json();
    counter_data.set(data);

    const config = TIME_PERIOD_CONFIG[currentTimeMode];
    if (config) {
        processTimeSeriesData(data, config.apiKey, config.divisor);
    }
}

function updateAggregatedCounts(data) {
    data.forEach(item => {
        if (aggregatedCounts[item.timestamp]) {
            aggregatedCounts[item.timestamp].counts += item.counts;
        } else {
            aggregatedCounts[item.timestamp] = { ...item };
        }
    });
}

function calculateTotal(data) {
    return data.reduce((acc, obj) => acc + obj.counts, 0);
}

function filterByTravelMode(data, mode) {
    const modeMap = {
        "walk_counter": "pedestrian",
        "cycle_counter": "bike"
    };
    
    return data.filter(d => 
        mode === "active_counter" || d.travelMode === modeMap[mode]
    );
}

function processHourlyData(filteredData) {
    aggregatedCounts = {};
    filteredData.forEach(record => updateAggregatedCounts(record.data));
    
    const timestampData = Object.values(aggregatedCounts);
    hourlyGroups = {};
    
    timestampData.forEach(record => {
        const date = new Date(record.timestamp);
        const hour = date.getHours();
        hourlyGroups[hour] = (hourlyGroups[hour] || 0) + record.counts;
    });
    
    timeSeriesData = Array.from({ length: HOURS_IN_DAY }, (_, hour) => ({
        time: hour,
        counts: hourlyGroups[hour] || 0
    }));
}

function processTimeSeriesData(data, timePeriod, divisor) {
    temporaryData = [];
    processedData = [];
    hourlyGroups = {};
    dailyDataPoints = [];
    timeSeriesData = [];

    if (timePeriod === "lastMonth") {
        const filteredData = filterByTravelMode(data.lastMonth, $metricToggle);
        if (filteredData.length > 0) {
            processHourlyData(filteredData);
            travelModeType = filteredData[0].travelMode;
            averageCount = calculateTotal(timeSeriesData) / divisor;
        }
    } else {
        const filteredData = filterByTravelMode(data[timePeriod], $metricToggle);
        if (filteredData.length > 0) {
            aggregatedCounts = {};
            filteredData.forEach(record => updateAggregatedCounts(record.data));
            timeSeriesData = filteredData[0].data.map(record => ({
                ...record,
                counts: record.traffic.counts
            }));
            travelModeType = filteredData[0].travelMode;
            averageCount = calculateTotal(timeSeriesData) / divisor;
        }
    }
}

// Reactive statements
$: {
    if ($metricToggle !== previousMetricMode) {
        counter_name.set(DEFAULT_LOCATION);
        selected_counter.set(DEFAULT_COUNTER_ID);
        fetchCounterData($selected_counter);
        previousMetricMode = $metricToggle;
    }
}

$: {
    if (currentTimeMode !== previousTimeMode) {
        timeSeriesData = [];
        fetchCounterData($selected_counter);
        previousTimeMode = currentTimeMode;
    }
}

$: {
    fetchCounterData($selected_counter);
}

</script>

<div class="container">
    <div
        class="overall2"
        on:click={function () {
            selectedLocation = "";
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
                    <p class="label">{'Daily '+ (travelModeType=='pedestrian'?'Pedestrians':"Cyclists")} </p>
                    <p class="number" style='color:{travelModeType!='pedestrian'?'#955196':'#374c80'}'>{numberFormatter(averageCount/30)}</p>
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
                            {"Historical "+(travelModeType=='pedestrian'?'Pedestrian ':"Cyclist ")+'counts'}
                        </p>
                    </div>

                    <div class="a2">
                        <select class="sel" bind:value={currentTimeMode}>
                            {#each ["By hour (last 30 days)", "By week (last 3 months)", "By week (last year)", "By month (last 3 years)"] as question}
                                <option value={question}>
                                    {question}
                                </option>
                            {/each}
                        </select>
                    </div>
                
            </div>
            {#if timeSeriesData.length > 0}
                <LinePlot data={timeSeriesData} width={width / 2} ttype={travelModeType} plot_type={currentTimeMode} />
            {:else}
            <div class="text">
                <p class="loc">{"fetching data..."}</p>
            </div>
            {/if}

        </div>
    </div>

    <div class="overall2">
        <div class="text2">
            <h2 class="dublin-header">{"About " + viewTitle}</h2>
            <div class="number2">{@html descriptionText}</div>
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
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
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
