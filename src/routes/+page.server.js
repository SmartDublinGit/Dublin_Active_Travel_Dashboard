
import { ECO_COUNTER_API } from "$env/static/private";

export async function load({params}){

  const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY':process.env.ECO_COUNTER_API}
  };

  const dailyTraffic = fetch('https://api.eco-counter.com/api/v2/statistical/adt/by/site?dateRange=currentMonth&groupBy=siteAndTravelMode&travelModes=pedestrian&travelModes=bike', options)
    .then(response => response.json())

  const fetchSites = 
    fetch('https://api.eco-counter.com/api/v2/sites?page=1&pageSize=100&sortBy=id&orderBy=asc', options)
    .then(response => response.json())

  return {
    sites: await fetchSites,
    traffic: await dailyTraffic
  }

}


