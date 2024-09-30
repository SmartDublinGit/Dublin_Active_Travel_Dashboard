//contains info on the regions being selected

import { writable} from "svelte/store";

export let RegionID = writable("999999"); 
export let fillLayer = writable(""); 
export let which_data = writable("census"); 
export let stepcounters = writable('asdf')
export let selected_counter = writable('100043587')
export let counter_data = writable('');
export let counter_name = writable('Select a counter to begin.');
export let censusMode = writable("2022"); 
export let showLanes = writable(true)
export let selected = writable('Census')
export let jsonData = writable('')
export let sums = writable('')
export let sumsGoogle = writable('')
export let strava_track = writable('DLR')
export let strava_data = writable('')


