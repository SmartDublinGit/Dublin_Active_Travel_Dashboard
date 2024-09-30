<script>
  import "../app.css";
  import Dashboard from "$components/Dashboard.svelte";
  import { stepcounters, jsonData, sums, sumsGoogle,strava_data } from "../stores/region";
  import { onMount } from "svelte";

  export let data;
  let filteredData = [];

  let json_data;

    // Fetch the JSON file from the static folder
    const fetchJson = async () => {
        const res = await fetch('/census_data_total.json');
        if (res.ok) {
            json_data = await res.json();
            jsonData.set(json_data['features'])
        } else {
            console.error("Failed to fetch the JSON file");
        }

        const res2 = await fetch('/sums.json');
        if (res2.ok) {
            json_data = await res2.json();
            sums.set(json_data['Census'][0])
            sumsGoogle.set(json_data['Google'][0])
        } else {
            console.error("Failed to fetch the second JSON file");
        }

        const res3 = await fetch('/strava.json');
        if (res3.ok) {
            json_data = await res3.json();
            json_data.forEach(function(d){
              let times = d['date'].split('/');
              d.date = new Date(Date.parse(times[2]+'-'+times[1]+'-'+times[0]))
            })
            strava_data.set(json_data)
        } else {
            console.error("Failed to fetch the second JSON file");
        }


    };

    // Fetch the JSON data when the component is created

  onMount(function () {

    fetchJson();


    //start by getting all of our counters data through the API.

    if (data.traffic) {
      console.log(data);
      data["traffic"].forEach((element) => {
        if (element.value) {
          let tmp = data["sites"].filter(function (d) {
            return d.id == element.siteId;
          })[0];
          let tmp2 = {
            mode: element.travelMode,
            value: element.value,
            lat: tmp.location.lat,
            lon: tmp.location.lon,
            name: tmp.name,
            id: tmp.id,
          };

          filteredData.push(tmp2);
        }
      });
    }

    stepcounters.set(filteredData);
  });
</script>

<Dashboard />


