<script>
  // right hand side if we are looking at census data

  import { RegionID, sumsGoogle } from "../../stores/region";
  import { format } from "d3";
  import { resetMap } from "../../stores/map";
  import { metricLabel } from "../../stores/filterData";

  import Donut from "./Donut.svelte";

  import Fa from "svelte-fa";
  import {
    faBicycle,
    faPersonWalking,
    faBus,
    faSmog,
    faCarSide,
  } from "@fortawesome/free-solid-svg-icons";

  let sel = "";

  let f = format(",.0f");
  let f2 = format(".2f");

  let nams = {
    "dublin-bay-north": "Dublin Bay North",
    "dublin-bay-south": "Dublin Bay South",
    "dublin-central": "Dublin Central",
    "dublin-fingal-east": "Dublin Fingal East",
    "dublin-fingal-west": "Dublin Fingal West",
    "dublin-mid-west": "Dublin Mid West",
    "dublin-north-west": "Dublin North West",
    "dublin-rathdown": "Dublin Rathdown",
    "dublin-south-central": "Dublin South Central",
    "dublin-south-west": "Dublin South West",
    "dublin-west": "Dublin West",
    "dún-laoghaire": "Dún Laoghaire",
  };

  let txt = "";
  let tit = "this data";

  $: {
    console.log($RegionID);

    if ($RegionID == "999999") {
      txt =
        'This view shows active travel data based on <a style="font-weight:bold">Google\'s modal split data of Dublin for 2023</a>, aggregated at electoral district level. This modal split data counts all trips within the Dublin boundary, in addition to those leaving and entering the Dublin boundary. Click on a <a style="font-weight:bold;color:#516dae">statistic</a> for information on how it was calculated. ';
    tit = 'this data'
      }

    if (sel == "prem_deaths") {
      txt =
        "The total number of potential premature deaths averted by walking or cycling. For cycling, <a href='https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10546027/#:~:text=Compared%20with%20non%2Dactive%20commuting,41%25%20lower%20risk%20of%20mortality.' target='_blank'>biking to work reduces the risk of premature death by 41% </a>. Walking 150 mins a week reduces this by <a href='https://bjsm.bmj.com/content/57/15/979' target='_blank'> 16%</a>. The risk of premature death between 30-70 years was estimated at 10%.";
      tit = "premature deaths";
    }

    if (sel == "health_exp") {
      txt =
        'This view shows active travel data based on <a style="font-weight:bold">Google\'s modal split data of Dublin for 2023</a>, aggregated at electoral district level. Click on a <a style="font-weight:bold;color:#516dae">statistic</a> for information on how it was calculated. ';
      tit = "";
    }

    if (sel == "co2") {
      txt =
        "Annual CO2 saved in a year by not taking a car. Assumes each person cycling or walking would otherwise have used a car. The equivalent automotive emissions per journey in Dublin has been calculated by Google. ";
      tit = "CO2 saved";
    }

    if (sel == "cong") {
      txt =
        "The annual CO2 emissions in each region by public transport (bus) and car has been calculated by Google. Note this takes into account all trips within and across all boundaries.";
      tit = "CO2 emissions";
    }
  }

  $: donutData = $RegionID == "999999" ? $sumsGoogle : $RegionID;

  $: location = $RegionID == "999999" ? "Dublin" : nams[$RegionID["ENG_NAME_VALUE"]];

  $: walk =
    $RegionID == "999999"
      ? f2((100 * $sumsGoogle["ON FOOT_trips"]) / $sumsGoogle["TOTAL_trips"]) +
        "%"
      : f2(100 * $RegionID["walk_pct"]) + "%";
  $: cycle =
    $RegionID == "999999"
      ? f2((100 * $sumsGoogle["CYCLING_trips"]) / $sumsGoogle["TOTAL_trips"]) +
        "%"
      : f2(100 * $RegionID["cycle_pct"]) + "%";
  $: drive =
    $RegionID == "999999"
      ? f2(
          (100 * $sumsGoogle["AUTOMOBILE_trips"]) / $sumsGoogle["TOTAL_trips"]
        ) + "%"
      : f2((100 * $RegionID["AUTOMOBILE_trips"]) / $RegionID["TOTAL_trips"]) +
        "%";

  $: pubs =
    $RegionID == "999999"
      ? f2((100 * $sumsGoogle["PUBLIC_trips"]) / $sumsGoogle["TOTAL_trips"]) +
        "%"
      : f2((100 * $RegionID["PUBLIC_trips"]) / $RegionID["TOTAL_trips"]) + "%";

  $: co2_saved_year =
    $RegionID == "999999"
      ? f(0.00141941108770439 * $sumsGoogle["ON FOOT_trips"])
      : f(0.00141941108770439 * $RegionID["ON FOOT_trips"]);
  $: co2_saved_year_bike =
    $RegionID == "999999"
      ? f(0.00141941108770439 * $sumsGoogle["CYCLING_trips"])
      : f(0.00141941108770439 * $RegionID["CYCLING_trips"]);

  $: co2_em_year_car =
    $RegionID == "999999"
      ? f($sumsGoogle["AUTOMOBILE_gpc_co2e_tons"])
      : f($RegionID["AUTOMOBILE_gpc_co2e_tons"]);
  $: co2_em_year_public =
    $RegionID == "999999"
      ? f($sumsGoogle["PUBLIC_gpc_co2e_tons"])
      : f($RegionID["PUBLIC_gpc_co2e_tons"]);
</script>

<div class="container">
  <div
    class="overall2"
    style="min-width:300px;"
    on:click={function () {
      sel = "";
      resetMap();
    }}
  >
    <h2 class="dublin-header">{"Regional information: 2023"}</h2>

    <div class="flex-items3">
      <div class="a1">
        {#if location === "Dublin"}
          <div class="text">
            <p class="label">Region</p>
            <p class="loc">{location}</p>
            <p class="label" />

            <!-- .range(['#a7c9de','#6d8495','#955196','#374c80','#6d8495','#6d8495',]); -->

            <br />
            <p class="number" style="color:#955196">
              {cycle + " "}<span style="font-size:1.2rem">
                <Fa icon={faBicycle} /></span
              >
            </p>
            <p class="number" style="color:#374c80">
              {walk + " "}<span style="font-size:1.2rem">
                <Fa icon={faPersonWalking} /></span
              >
            </p>
            <p class="number" style="color:#e9547a">
              {drive + " "}<span style="font-size:1.2rem">
                <Fa icon={faCarSide} /></span
              >
            </p>
            <p class="number" style='color:#ff912b'>
              {pubs + " "}<span style="font-size:1.2rem">
                <Fa icon={faBus} /></span
              >
            </p>
          </div>
        {:else}
          <div class="text">
            <p class="label">Region</p>
            <p class="loc">{location}</p>
            <p class="label">{@html "&#9204;"}</p>

            <br />
            <p class="number" style="color:#955196">
              {cycle + " "}<span style="font-size:1.2rem">
                <Fa icon={faBicycle} /></span
              >
            </p>
            <p class="number" style="color:#374c80">
              {walk + " "}<span style="font-size:1.2rem">
                <Fa icon={faPersonWalking} /></span
              >
            </p>
            <p class="number" style="color:#e9547a">
              {drive + " "}<span style="font-size:1.2rem">
                <Fa icon={faCarSide} /></span
              >
            </p>
            <p class="number" style='color:#ff912b'>
              {pubs + " "}<span style="font-size:1.2rem">
                <Fa icon={faBus} /></span
              >
            </p>
          </div>
        {/if}
      </div>

      <div class="a2">
        <div class="text" style="padding-left:0px">
          <Donut data={donutData} />
        </div>
      </div>
    </div>
  </div>

  <div class="flex-items2">

    <div
      class="overall2"
      style="background-color:{sel == 'co2' ? '#a7c9de44' : 'white'}"
      on:click={function () {
        sel = "co2";
        resetMap();
      }}
    >
      <h2 class="dublin-header"><Fa icon={faSmog} /> CO2</h2>
      <div class="text">
        <p class="label">Annual CO2 saved (Tonnes)</p>
        <p class="number-green">
          {co2_saved_year_bike + " "}<span style="font-size:1.2rem"><Fa icon={faBicycle} /></span
          >
        </p>
        <p class="number">
          {co2_saved_year + " "}<span style="font-size:1.2rem"
            ><Fa icon={faPersonWalking} /></span
          >
        </p>
       
      </div>
    </div>
   
    <div
      class="overall2"
      style="background-color:{sel == 'cong' ? '#a7c9de44' : 'white'}"
      on:click={function () {
        sel = "cong";
        resetMap();
      }}
    >
      <h2 class="dublin-header"><Fa icon={faSmog} /> Emissions</h2>
      <div class="text">
        <p class="label">Annual emissions (Tonnes)</p>
        <p class="number-green" style='color:#e9547a'>
          {co2_em_year_car + " "}<span style="font-size:1.2rem"><Fa icon={faCarSide} /></span
          >
        </p>
        <p class="number" style='color:#ff912b'>
          {co2_em_year_public + " "}<span style="font-size:1.2rem"
            ><Fa icon={faBus} /></span
          >
        </p>
      </div>
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
  }

  .overall {
    border: 0px solid #f5f5f5;
    background: white;
    border-radius: 15px;
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
    padding: 18px;
    margin-bottom: 20px;
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
    flex: 0 0 33%;
  }

  .a2 {
    display: flex;
    flex: 0 0 66%;
    align-items: center;
    flex-direction: column;
    justify-content: center;
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
    flex: 0 1 auto;
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
    font-size: 1.3rem;
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
    font-size: 1.2rem;
    font-style: normal;
    color: #374c80;
    font-weight: normal;
    line-height: 120%;
    margin-bottom: 5px;
  
  }

  .label {
    font-size: 0.9rem;
    font-style: normal;
    color: #324754;
    font-weight: 700;
    line-height: 130%; /* 24px */
    margin-bottom: 6px;
    margin-top: 2px;
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
