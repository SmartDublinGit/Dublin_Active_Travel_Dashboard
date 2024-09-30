<script>
  // right hand side if we are looking at census data

  import { RegionID,censusMode} from "../../stores/region";
  import { format } from "d3";
  import { resetMap } from "../../stores/map";

  import Fa from "svelte-fa";
  import {
    faBicycle,
    faPersonWalking,
    faHeartPulse,
    faSmog,
    faCarSide,
    faEuroSign
  } from "@fortawesome/free-solid-svg-icons";

  let sel = "";

  let f = format(",.0f");

  let f2 = format(".2f");

  let sums = 
  {
        "OBJECTID": 584222,
        "ED_PART_COUNT": 341,
        "COUNTY_CODE": 982,
        "Total": 1458154,
        "On foot - Total": 180789,
        "Bicycle - Total": 64387,
        "Bus, minibus or coach - Total": 127159,
        "Train, DART or LUAS - Total": 61401,
        "Motorcycle or scooter - Total": 5118,
        "Car driver - Total": 272279,
        "Car passenger - Total": 124443,
        "Van - Total": 21137,
        "Other (incl. lorry) - Total": 1837,
        "Work mainly at or from home - Total": 89359,
        "Not stated - Total": 98530,
        "MATCH": "                                                                                                                                                                                                                                                                                                                                 ",
        "ID": 51360,
        "working_pop": 1046439,
        "Active travel - Total": 245176,
        "On foot - Total_pct": 0.1239,
        "Bicycle - Total_pct": 0.04416,
        "Bus, minibus or coach - Total_pct": 39.1620534569,
        "Train, DART or LUAS - Total_pct": 18.9045410003,
        "Motorcycle or scooter - Total_pct": 1.6676440801,
        "Car driver - Total_pct": 80.3233413896,
        "Car passenger - Total_pct": 35.7256174189,
        "Van - Total_pct": 6.339314168,
        "Other (incl. lorry) - Total_pct": 0.5685506475,
        "Work mainly at or from home - Total_pct": 28.3701634564,
        "Not stated - Total_pct": 30.4378292711,
        "Active travel - Total_pct": 79.5009451113,
        "Total_16": 1430550,
        "On foot - Total_16": 176948,
        "Bicycle - Total_16": 57987,
        "Bus, minibus or coach - Total_16": 131253,
        "Train, DART or LUAS - Total_16": 64887,
        "Motorcycle or scooter - Total_16": 4816,
        "Car driver - Total_16": 303859,
        "Car passenger - Total_16": 112730,
        "Van - Total_16": 20058,
        "Other (incl. lorry) - Total_16": 1305,
        "Work mainly at or from home - Total_16": 15679,
        "Not stated - Total_16": 55240,
        "working_pop_16": 944762,
        "Active travel - Total_16": 234935,
        "On foot - Total_pct_16": 0.1236922862,
        "Bicycle - Total_pct_16": 0.04053,
        "Bus, minibus or coach - Total_pct_16": 46.003993782,
        "Train, DART or LUAS - Total_pct_16": 22.0224854975,
        "Motorcycle or scooter - Total_pct_16": 1.7140147825,
        "Car driver - Total_pct_16": 97.9294522262,
        "Car passenger - Total_pct_16": 35.6521318555,
        "Van - Total_pct_16": 6.6092321297,
        "Other (incl. lorry) - Total_pct_16": 0.4398650466,
        "Work mainly at or from home - Total_pct_16": 5.9825854204,
        "Not stated - Total_pct_16": 18.7587536144,
        "Active travel - Total_pct_16": 85.8874856451,
        "delta_Total": 27604,
        "delta_On foot - Total": 3841,
        "delta_On foot - Total_pct": 0.0023652276,
        "delta_Bicycle - Total": 6400,
        "delta_Bicycle - Total_pct": 0.089349398,
        "delta_Bus, minibus or coach - Total": -4094,
        "delta_Bus, minibus or coach - Total_pct": -39.6620956741,
        "delta_Train, DART or LUAS - Total": -3486,
        "delta_Train, DART or LUAS - Total_pct": null,
        "delta_Motorcycle or scooter - Total": 302,
        "delta_Motorcycle or scooter - Total_pct": null,
        "delta_Car driver - Total": -31580,
        "delta_Car driver - Total_pct": -59.5727221051,
        "delta_Car passenger - Total": 11713,
        "delta_Car passenger - Total_pct": -1.4288461979,
        "delta_Van - Total": 1079,
        "delta_Van - Total_pct": -9.9868920958,
        "delta_Other (incl. lorry) - Total": 532,
        "delta_Other (incl. lorry) - Total_pct": null,
        "delta_Work mainly at or from home - Total": 73680,
        "delta_Work mainly at or from home - Total_pct": 1620.5557982056,
        "delta_Not stated - Total": 43290,
        "delta_Not stated - Total_pct": 215.7820047281,
        "delta_Active travel - Total": 10241,
        "delta_Active travel - Total_pct": -7.1638158832
    }


  let txt = "";
  let tit = "";

  let string_16 = ''
  let string_delta = ''
  

  $: {

    // code to determine what data i am looking at.

    if($censusMode=="2016"){
      string_16='_16'
    }
    else{
      string_16=''
    }

    if($censusMode=="delta"){
      string_delta='delta_'
    }
    else{
      string_delta=''
    }




    if ($RegionID == "999999") {
      txt =
        'This view shows active travel based on the <a style="font-weight:bold"> Means of Travel data from the 2022 and 2016 census</a>, aggregated at local electoral level. Click on a <a style="font-weight:bold;color:#374c80">statistic</a> for information on how it was calculated. ';
      tit = "this view";
    }

    if (sel == "prem_deaths") {
      txt =
        "The number of premature deaths averted this year by walking or cycling to work. For cycling, <a href='https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10546027/#:~:text=Compared%20with%20non%2Dactive%20commuting,41%25%20lower%20risk%20of%20mortality.' target='_blank'>biking to work reduces the risk of premature death by 41% </a>. Walking 150 mins a week reduces this by <a href='https://bjsm.bmj.com/content/57/15/979' target='_blank'> 16%</a>. The risk of premature death between 30-70 years was estimated at 10%, which in any one year is 0.25%.";
      tit = "premature deaths";
    }

    if (sel == "health_exp") {
      txt =
        "Total money saved this year by not commuting by car. Assumes each person cycling or walking would otherwise have a 10km commute 3.5 days a week. We use the <a href='https://www.tomtom.com/traffic-index/dublin-traffic/' target = '_blank'> calculator by TomTom</a> to estimate this cost at €401.50 per person.";
      tit = "Fuel savings";
    }

    if (sel == "co2") {
      txt =
        "Annual CO2 saved this year by not commuting by car. Assumes each person cycling or walking would otherwise have a 10km commute 3.5 days a week and a <a href='https://climate.ec.europa.eu/eu-action/transport/road-transport-reducing-co2-emissions-vehicles/co2-emission-performance-standards-cars-and-vans_en' target = '_blank'> carbon footprint for a car as 95g CO2/km</a>";
      tit = "CO2 saved";
    }

    if (sel == "cong") {
      txt =
        "Total time (in years) saved by Dubliners this year by not sitting in traffic. Assumes a 10km commute 3.5 days a week. A study by Tomtom found that a daily 10km commute in Dublin resulted in <a href='https://www.tomtom.com/traffic-index/dublin-traffic/' target='_blank'> 158 hours lost to congestion. </a>";
      tit = "traffic avoided";
    }
  }



  $: location = $RegionID == "999999" ? "DUBLIN" : $RegionID.ED_ENGLISH;

  $: walk =
    $RegionID == "999999"
      ? f(100 * sums[string_delta+"On foot - Total_pct"+string_16]) + "%"
      : f(100 * $RegionID[string_delta+"On foot - Total_pct"+string_16]) + "%";

  $: cycle =
    $RegionID == "999999"
    ? f(100 * sums[string_delta+"Bicycle - Total_pct"+string_16]) + "%"
    : f(100 * $RegionID[string_delta+"Bicycle - Total_pct"+string_16]) + "%";

  $: prem_deaths_cycle =
    $RegionID == "999999"
      ? f(0.001025 * sums[string_delta+"Bicycle - Total"+string_16])
      : f(0.001025 * $RegionID[string_delta+"Bicycle - Total"+string_16]);

  $: prem_deaths_walk =
    $RegionID == "999999"
      ? f(0.001025 * sums[string_delta+"On foot - Total"+string_16])
      : f(0.001025 * $RegionID[string_delta+"On foot - Total"+string_16]);

  $: cycle_eur_saved =
    $RegionID == "999999"
      ? "€" +
        f(401.45*sums[string_delta+"Bicycle - Total"+string_16]/1000000) + 'M'
      : "€" +
      f(401.45*($RegionID[string_delta+"Bicycle - Total"+string_16]));


  $: walk_eur_saved =
  $RegionID == "999999"
      ? "€" +
        f(401.45*sums[string_delta+"On foot - Total"+string_16]/1000000) + 'M'
      : "€" +
      f(401.45*($RegionID[string_delta+"On foot - Total"+string_16]));
  

  $: co2_saved_year =
    $RegionID == "999999"
      ? f((0.3372) * sums[string_delta+"On foot - Total"+string_16])
      : f(
          (0.3372) * $RegionID[string_delta+"On foot - Total"+string_16]
        );


  $: co2_saved_year_bike =
    $RegionID == "999999"
      ? f((0.3372) * sums[string_delta+"Bicycle - Total"+string_16])
      : f(
          (0.3372) * $RegionID[string_delta+"Bicycle - Total"+string_16]
        );

  $: traffic_year_foot =
    $RegionID == "999999"
      ? f(0.00990867579908675 * sums[string_delta+"On foot - Total"+string_16])+' years'
      : f(0.00990867579908675 * $RegionID[string_delta+"On foot - Total"+string_16])+' years';
  $: traffic_year_cycle =
    $RegionID == "999999"
      ? f(0.00990867579908675 * sums[string_delta+"Bicycle - Total"+string_16])+' years'
      : "" + f(0.00990867579908675 * $RegionID[string_delta+"Bicycle - Total"+string_16])+' years';

  //source: https://www.census.gov/quickfacts/fact/table/mecklenburgcountynorthcarolina/PST045223
</script>

<div class='container'>
<div class="overall">
  <div class="flex-items">
    <div class="population-box item">
      {#if location != "Dublin"}
        <div
          class="text"
          on:click={function () {
            sel = "";
            resetMap();
          }}
        >
          <h2 class="dublin-header">{location}</h2>

          <p class="label">Go back</p>
        </div>
      {:else}
        <div class="text">
          <h2 class="dublin-header">Dublin</h2>
          <p class="label">{@html "\xa0"}</p>
        </div>
      {/if}
    </div>

    <div class="population-box item">
      <div
        class="text"
        on:click={function () {
          sel = "health_exp";
        }}
      >
        <p class="label">Commuters</p>
        <p class="number">{cycle} <Fa icon={faBicycle} /></p>
        <p class="number">{walk} <Fa icon={faPersonWalking} /></p>
      </div>
    </div>


  </div>
</div>



<div class="flex-items2">
  <div class="overall2">
  

    <h2 class="dublin-header"><Fa icon={faHeartPulse} /> Health</h2>
    <div class="flex-items">
      <div class="population-box item">
        <div
          class="text"
          on:click={function () {
            sel = "prem_deaths";
          }}
        >
          <p class="label">Annual premature deaths avoided</p>
          <p class="number">
            {prem_deaths_cycle}
            <Fa icon={faBicycle} style="color:black" />
          </p>
          <p class="number">{prem_deaths_walk} <Fa icon={faPersonWalking} /></p>
        </div>
      </div>
      </div>

   
  </div>

  <div class="overall2">
    <h2 class="dublin-header"><Fa icon={faEuroSign} /> Financial</h2>
    <div
    class="text"
    on:click={function () {
      sel = "health_exp";
    }}
  >
    <p class="label">Annual fuel savings</p>
    <p class="number">{cycle_eur_saved} <Fa icon={faBicycle} /></p>
    <p class="number">{walk_eur_saved} <Fa icon={faPersonWalking} /></p>
  </div>
  </div>
</div>






<!-- 
<div class="overall">
  <h2 class="dublin-header"><Fa icon={faHeartPulse} /> Health</h2>
  <div class="flex-items">
    <div class="population-box item">
      <div
        class="text"
        on:click={function () {
          sel = "prem_deaths";
        }}
      >
        <p class="label">Annual premature deaths avoided</p>
        <p class="number">
          {prem_deaths_cycle}
          <Fa icon={faBicycle} style="color:black" />
        </p>
        <p class="number">{prem_deaths_walk} <Fa icon={faPersonWalking} /></p>
      </div>
    </div>

 <div class="population-box item">
      <div
        class="text"
        on:click={function () {
          sel = "health_exp";
        }}
      >
        <p class="label">Annual fuel savings</p>
        <p class="number">{cycle_eur_saved} <Fa icon={faBicycle} /></p>
        <p class="number">{walk_eur_saved} <Fa icon={faPersonWalking} /></p>
      </div>
    </div> 

  </div>
</div> -->

<div class="flex-items2">
  <div class="overall2">
    <h2 class="dublin-header"><Fa icon={faSmog} /> CO<sub>2</sub></h2>
    <div
      class="text"
      on:click={function () {
        sel = "co2";
      }}
    >
      <p class="label">Annual CO<sub>2</sub> saved (Tonnes)</p>
      <p class="number">{co2_saved_year_bike} <Fa icon={faBicycle} /></p>
      <p class="number">{co2_saved_year} <Fa icon={faPersonWalking} /></p>
    </div>
  </div>

  <div class="overall2">
    <h2 class="dublin-header"><Fa icon={faCarSide} /> Congestion</h2>
    <div
      class="text"
      on:click={function () {
        sel = "cong";
      }}
    >
      <p class="label">Annual time savings </p>
      <p class="number">{traffic_year_cycle} <Fa icon={faBicycle} /></p>
      <p class="number">{traffic_year_foot} <Fa icon={faPersonWalking} /></p>
    </div>
  </div>
</div>

<div class="overall">
  <div class="text2">
    <h2 class="dublin-header">{"About " + tit}</h2>
    <div class="number2">{@html txt}</div>
  </div>
</div>

</div>

<style>

.container{
  height: 100svh;
}

  .overall {
    border: 0px solid #f5f5f5;
    background: white;
    border-radius: 30px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0);
    padding: 18px 18px;
    margin-bottom: 10px;
  }

  .dublin-header {
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
    margin-bottom: 10px;
  }

  .flex-items {
    display: flex;
    gap: 10px;
  }

  .flex-items2 {
    display: flex;
    gap: 10px;
  }

  .overall2 {
    border: 0px solid #f5f5f5;
    background: white;
    width: 100%;
    height: 100%;
    border-radius: 30px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0);
    padding: 18px 18px;
    margin-bottom: 10px;
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
    font-size: 20px;
    font-style: normal;
    text-transform: none;

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
    color: #374c80;
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
      font-size: 1px;
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
