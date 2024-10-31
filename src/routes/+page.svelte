<script>
  // Import styles, components, and stores
  import "../app.css";
  import Dashboard from "$components/Dashboard.svelte";
  import { stepcounters, jsonData, sums, sumsGoogle, strava_data } from "../stores/region";
  import { onMount } from "svelte";

  export let data; // Data passed as a prop
  let filteredData = []; // Array to hold filtered traffic data
  let json_data; // Placeholder for fetched JSON data

  // Function to fetch and process JSON files
  const fetchJson = async () => {
    try {
      // Fetch census data and update store
      const res = await fetch('/census_data_total.json');
      if (res.ok) {
        json_data = await res.json();
        jsonData.set(json_data['features']);
      } else {
        console.error("Failed to fetch census data JSON file");
      }

      // Fetch sums data and update relevant stores
      const res2 = await fetch('/sums.json');
      if (res2.ok) {
        json_data = await res2.json();
        sums.set(json_data['Census'][0]);
        sumsGoogle.set(json_data['Google'][0]);
      } else {
        console.error("Failed to fetch sums data JSON file");
      }

      // Fetch and process Strava data, converting dates to Date objects, and update store
      const res3 = await fetch('/strava.json');
      if (res3.ok) {
        json_data = await res3.json();
        json_data.forEach(d => {
          let times = d['date'].split('/');
          d.date = new Date(Date.parse(`${times[2]}-${times[1]}-${times[0]}`));
        });
        strava_data.set(json_data);
      } else {
        console.error("Failed to fetch Strava data JSON file");
      }

    } catch (error) {
      console.error("An error occurred while fetching JSON data:", error);
    }
  };

  // Process and filter the traffic data from the API
  const processTrafficData = () => {
    if (data.traffic) {
      console.log(data.traffic);
      data["traffic"].forEach(element => {
        if (element.value) {
          // Find the site details corresponding to traffic data
          const site = data["sites"].find(d => d.id === element.siteId);
          if (site) {
            // Create an object with traffic data and site details
            const trafficInfo = {
              mode: element.travelMode,
              value: element.value,
              lat: site.location.lat,
              lon: site.location.lon,
              name: site.name,
              id: site.id,
            };

            // Exclude sites with specific IDs and add to filtered data
            if (![100063162, 100063165].includes(site.id)) {
              filteredData.push(trafficInfo);
            }
          }
        }
      });
      stepcounters.set(filteredData); // Update store with filtered data
    }
  };

  // Fetch JSON data and process traffic data on component mount
  onMount(() => {
    fetchJson();          // Load JSON files and populate stores
    processTrafficData(); // Filter and process traffic data
  });
</script>

<!-- Render the Dashboard component -->
<Dashboard />
