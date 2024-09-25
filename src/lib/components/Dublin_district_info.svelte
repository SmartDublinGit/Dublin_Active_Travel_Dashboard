<script>
  // right hand side if we are looking at modal split data

  import { RegionID } from "../../stores/region";

  import { format, html } from "d3";

  import Donut from "./Donut.svelte";
  import { resetMap } from "../../stores/map";
  import { visMode } from "../../stores/filterData";
  import { get } from "svelte/store";

  import Fa from "svelte-fa";
  import {
    faBicycle,
    faPersonWalking,
    faCar,
    faBus,
    faHeartPulse,
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

  let sums = {
    ENG_NAME_VALUE:
      "dublin-bay-northdublin-bay-southdublin-centraldublin-fingal-eastdublin-fingal-westdublin-mid-westdublin-north-westdublin-rathdowndublin-south-centraldublin-south-westdublin-westdún-laoghaire",
    AUTOMOBILE_trips: 477816310,
    AUTOMOBILE_full_distance_km: 6858249436,
    AUTOMOBILE_gpc_distance_km: 3731595088.0,
    AUTOMOBILE_full_co2e_tons: 1246487.4985999998,
    AUTOMOBILE_gpc_co2e_tons: 678217.7682999999,
    BUS_trips: 34418387,
    BUS_full_distance_km: 263615321,
    BUS_gpc_distance_km: 148585849.5,
    BUS_full_co2e_tons: 170052.19139999998,
    BUS_gpc_co2e_tons: 95849.3202,
    CYCLING_trips: 30512997,
    CYCLING_full_distance_km: 130597099,
    CYCLING_gpc_distance_km: 82458101.0,
    CYCLING_full_co2e_tons: 0.0,
    CYCLING_gpc_co2e_tons: 0.0,
    "ON FOOT_trips": 297928392,
    "ON FOOT_full_distance_km": 307468417,
    "ON FOOT_gpc_distance_km": 248582587.5,
    "ON FOOT_full_co2e_tons": 0.0,
    "ON FOOT_gpc_co2e_tons": 0.0,
    RAIL_trips: 20258273,
    RAIL_full_distance_km: 654093262,
    RAIL_gpc_distance_km: 327758795.5,
    RAIL_full_co2e_tons: 0.0,
    RAIL_gpc_co2e_tons: 0.0,
    TRAM_trips: 10335814,
    TRAM_full_distance_km: 73781475,
    TRAM_gpc_distance_km: 41394405.5,
    TRAM_full_co2e_tons: 0.0,
    TRAM_gpc_co2e_tons: 0.0,
    TOTAL_trips: 840757176,
    walk_pct: 3.7206267368608152,
    cycle_pct: 0.3924169840688221,
    active_pct: 4.113043720929637,
    bbox: "-6.24321924199892, 53.3506819994009, -6.04399767815255, 53.4330259224588-6.30276292052489, 53.2988821167231, -6.15109589823447, 53.3478669231554-6.3114210781472, 53.3446826713745, -6.18906350638237, 53.379546600456-6.28318591084293, 53.4004357839733, -5.9944947388966, 53.5140245238599-6.43575948126345, 53.3970351983446, -6.00220266805465, 53.6347253423409-6.54688533611748, 53.2251968863402, -6.34526811455715, 53.3684838843113-6.32223582125997, 53.373873528866, -6.21471457488802, 53.4066460314349-6.29927527984443, 53.2021740275367, -6.14935955995504, 53.3148151342376-6.38705783052269, 53.3120250122297, -6.27162822882173, 53.3548669118305-6.45356146642099, 53.1781973864789, -6.26941320507924, 53.3258737322453-6.4749498717587, 53.346295012984, -6.29497608533574, 53.4629900910459-6.21998163954759, 53.19862687875, -6.07569901611732, 53.3127424275615",
  };

  let txt = "";
  let tit = "";

  $: {
    console.log($RegionID);

    if ($RegionID == "999999") {
      
      txt =
        'This view shows active travel data based on <a style="font-weight:bold">Google\'s modal split data of Dublin for 2023</a>, aggregated at electoral district level. This modal split data counts all trips within the Dublin boundary, in addition to those leaving and entering the Dublin boundary. Click on a <a style="font-weight:bold;color:#516dae">statistic</a> for information on how it was calculated. ';
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
        "Annual CO2 saved in a year by not taking a car. Assumes each person cycling or walking would otherwise have used a car. The equivalent automotive emissions per journey in Dublin has been calculated by Google.";
      tit = "CO2 saved";
    }

    if (sel == "cong") {
      txt =
        "Annual CO2 emissions in Dublin by bus and car has been calculated by Google.";
      tit = "CO2 emissions";
    }
  }

  let donutData

  $: donutData =
  $RegionID == "999999" ? sums : $RegionID;

  $: location =
    $RegionID == "999999" ? "Dublin" : nams[$RegionID["ENG_NAME_VALUE"]];
  $: walk =
    $RegionID == "999999"
      ? f2((100 * sums["ON FOOT_trips"]) / sums["TOTAL_trips"]) + "%"
      : f2(100 * $RegionID["walk_pct"]) + "%";
  $: cycle =
    $RegionID == "999999"
      ? f2((100 * sums["CYCLING_trips"]) / sums["TOTAL_trips"]) + "%"
      : f2(100 * $RegionID["cycle_pct"]) + "%";
  $: drive =
    $RegionID == "999999"
      ? f2((100 * sums["AUTOMOBILE_trips"]) / sums["TOTAL_trips"]) + "%"
      : f2((100 * $RegionID["AUTOMOBILE_trips"]) / $RegionID["TOTAL_trips"]) +
        "%";

  $: co2_saved_year =
    $RegionID == "999999"
      ? f(0.00141941108770439 * sums["ON FOOT_trips"])
      : f(0.00141941108770439 * $RegionID["ON FOOT_trips"]);
  $: co2_saved_year_bike =
    $RegionID == "999999"
      ? f(0.00141941108770439 * sums["CYCLING_trips"])
      : f(0.00141941108770439 * $RegionID["CYCLING_trips"]);

  $: co2_em_year_car =
    $RegionID == "999999"
      ? f(sums["AUTOMOBILE_gpc_co2e_tons"])
      : f($RegionID["AUTOMOBILE_gpc_co2e_tons"]);
  $: co2_em_year_bus =
    $RegionID == "999999"
      ? f(sums["BUS_gpc_co2e_tons"])
      : f($RegionID["BUS_gpc_co2e_tons"]);


</script>

<!-- 
<div class="overall" >
  <h2 class="dublin-header">{location}</h2>
  {#if location!='Dublin'}
  <div class="text" on:click={function(){ sel=''
    resetMap()}}>
    <p class="label">Go back </p>
  </div>

  {:else}
  <div class="text">
    <p class="label">{@html '\xa0'} </p>
  </div>
  {/if}
  
  
  </div>


  <br> -->
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


          <p class="label">{'Trips'}</p>
        <p style="color: #374c80" class="number">{walk} <Fa icon={faPersonWalking} /></p>
        <p style="color: #ffa600" class="number">{cycle} <Fa icon={faBicycle} /></p>
        <p style="color: #777" class="number">{drive} <Fa icon={faCar} /></p>
        <p class="label">{@html "\xa0"}</p>

        <p class="label">Go back</p>

        </div>
      {:else}
        <div class="text">
          <h2 class="dublin-header">Dublin</h2>
          <p class="label">{'Trips'}</p>
          <p style="color: #374c80" class="number">{walk} <Fa icon={faPersonWalking} /></p>
          <p style="color: #ffa600" class="number">{cycle} <Fa icon={faBicycle} /></p>
          <p style="color: #777" class="number">{drive} <Fa icon={faCar} /></p>
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
      

        <Donut data={donutData}></Donut>

      </div>
    </div>
  </div>
</div>

<br />

<!-- 

<div class="overall" >
  <h2 class="dublin-header"><Fa icon={faHeartPulse} /> Health</h2>
  <div class="flex-items">
    <div class="population-box item">
      <div class="text" on:click={function(){sel = 'prem_deaths'}}>
        <p class="label">Premature deaths avoided</p>
        <p class="number"> {prem_deaths_cycle}  <Fa icon={faBicycle} style='color:black' /></p>
        <p class="number"> {prem_deaths_walk}  <Fa icon={faPersonWalking} /></p>

      </div>
    </div>

    <div class="population-box item">
      <div class="text" on:click={function(){sel = 'health_exp'}}>
        <p class="label">Healthcare expenditure saved</p>
        <p class="number"> {aqi_cycle_saved}  <Fa icon={faBicycle} /></p>
        <p class="number"> {aqi_walk_saved}  <Fa icon={faPersonWalking} /></p>

      </div>
    </div>
    

  </div>
  
</div> -->
<!-- <br> -->

<div class="flex-items2">
  <div class="overall2">
    <h2 class="dublin-header"><Fa icon={faSmog} /> CO<sub>2</sub> Savings</h2>
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
    <h2 class="dublin-header"><Fa icon={faSmog} /> CO<sub>2</sub> Emissions</h2>
    <div
      class="text"
      on:click={function () {
        sel = "cong";
      }}
    >
      <p class="label">Annual CO<sub>2</sub> emissions (Tonnes)</p>
      <p class="number">{co2_em_year_car} <Fa icon={faCar} /></p>
      <p class="number">{co2_em_year_bus} <Fa icon={faBus} /></p>
    </div>
  </div>
</div>

<br />

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
    background: whitesmoke;
    border-radius: 30px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0);
    padding: 18px 18px;
  }

  .dublin-header {
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
    margin-bottom: 10px;
  }

  .flex-items {
    display: flex;
    gap: 54px;
  }

  .flex-items2 {
    display: flex;
    gap: 15px;
  }

  .overall2 {
    border: 0px solid #f5f5f5;
    background: whitesmoke;
    width: 100%;
    border-radius: 30px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0);
    padding: 18px 18px;
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
    font-size: 24px;
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
    text-transform: uppercase;

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
      font-size: 16px;
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
