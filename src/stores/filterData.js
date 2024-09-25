import { writable, readable, derived } from "svelte/store";


//holds all possible active variables
export const metricToggleOptions = readable([
  { label: "Walking 2022: Total", value: "On foot - Total_pct", group: 'census' },
  { label: "Cycling 2022: Total", value: "Bicycle - Total_pct", group: 'census' },
  { label: "Walking and Cycling 2022: Total", value: "Active travel - Total_pct", group: 'census' },
  { label: "Walking 2016: Total", value: "On foot - Total_pct_16", group: 'census' },
  { label: "Cycling 2016: Total", value: "Bicycle - Total_pct_16", group: 'census' },
  { label: "Walking and Cycling 2016: Total", value: "Active travel - Total_pct_16", group: 'census' },
  { label: "Change in Walking 2016-2022: Total", value: "delta_On foot - Total_pct", group: 'census' },
  { label: "Change in Cycling 2016-2022: Total", value: "delta_Bicycle - Total_pct", group: 'census' },
  { label: "Change in Walking & Cycling 2016-2022: Total", value: 'delta_Active travel - Total_pct', group: 'census' },

  { label: "Walking 2022: Work", value: "On foot - Work_pct", group: 'census' },
  { label: "Cycling 2022: Work", value: "Bicycle - Work_pct", group: 'census' },
  { label: "Walking and Cycling 2022: Work", value: "Active travel - Work_pct", group: 'census' },
  { label: "Walking 2016: Work", value: "On foot - Work_pct_16", group: 'census' },
  { label: "Cycling 2016: Work", value: "Bicycle - Work_pct_16", group: 'census' },
  { label: "Walking and Cycling 2016: Work", value: "Active travel - Work_pct_16", group: 'census' },
  { label: "Change in Walking 2016-2022: Work", value: "delta_On foot - Work_pct", group: 'census' },
  { label: "Change in Cycling 2016-2022: Work", value: "delta_Bicycle - Work_pct", group: 'census' },
  { label: "Change in Walking & Cycling 2016-2022: Work", value: 'delta_Active travel - Work_pct', group: 'census' },
  
  { label: "Walking 2022: School/college", value: "On foot - School, college or childcare_pct", group: 'census' },
  { label: "Cycling 2022: School/college", value: "Bicycle - School, college or childcare_pct", group: 'census' },
  { label: "Walking and Cycling 2022: School/college", value: "Active travel - School, college or childcare_pct", group: 'census' },
  { label: "Walking 2016: School/college", value: "On foot - School, college or childcare_pct_16", group: 'census' },
  { label: "Cycling 2016: School/college", value: "Bicycle - School, college or childcare_pct_16", group: 'census' },
  { label: "Walking and Cycling School/college: Total", value: "Active travel - School, college or childcare_pct_16", group: 'census' },
  { label: "Change in Walking 2016-2022: School/college", value: "delta_On foot - School, college or childcare_pct", group: 'census' },
  { label: "Change in Cycling 2016-2022: School/college", value: "delta_Bicycle - School, college or childcare_pct", group: 'census' },
  { label: "Change in Walking & Cycling 2016-2022: School/college", value: 'delta_Active travel - School, college or childcare_pct', group: 'census' },

  { label: "Walking 2023", value: "walk_pct", group: 'google' },
  { label: "Cycling 2023", value: "cycle_pct", group: 'google' },
  { label: "Walking and Cycling 2023", value: "active_pct", group: 'google' },

  { label: "Walking", value: "walk_counter", group: 'temp' },
  { label: "Cycling", value: "cycle_counter", group: 'temp' },
  { label: "Walking and Cycling", value: "active_counter", group: 'temp' },
]);

export const modeToggleOptions = readable(['Walking', 'Cycling', 'Walking and Cycling'])

export const visModeOptions = readable([
  { label: "Census", value: "census" },
  { label: "Google Trips", value: "google" },
  { label: "Eco Counters Data", value: "temp" },
  // { label: "Strava", value: "strava" },
])

export const censusOptions = readable(['2022','2016',"Change"])
// what screen we are in (left hand bar)
export const visMode = writable("census");

// what mode of transport
export const modeToggle = writable("Walking");

// what year we are showing
export const censusMode = writable("2022");

export const dataOptions = readable(['Total','Work',"School or College"]);

export const dataMode = writable('Total');

//holds currently active variable

export const metricToggle = derived([visMode, 
  censusMode, 
  modeToggle,
  dataMode
 ], ([$visMode, 
  $censusMode, 
  $modeToggle,
  $dataMode
]) => {
  
  let val = ''

  let this_st = 'Total'
  console.log('data mode')
  console.log($dataMode)


    if ($dataMode=='School or College')
      {
        this_st = 'School, college or childcare'
      }

      if ($dataMode=='Work')
        {
          this_st = 'Work'
        }

    if ($visMode == "census") {
        if ($modeToggle == "Walking") {
          val = "On foot - "+this_st+"_pct";
        }
        if ($modeToggle == "Cycling") {
          val = "Bicycle - "+this_st+"_pct";
        }
        if ($modeToggle == "Walking and Cycling") {
          val = "Active travel - "+this_st+"_pct";
        }

      if ($censusMode == "Change") {
        if ($modeToggle == "Walking") {
          val = "delta_On foot - "+this_st+"_pct";
        }
        if ($modeToggle == "Cycling") {
          val = "delta_Bicycle - "+this_st+"_pct";
        }
        if ($modeToggle == "Walking and Cycling") {
          val = "delta_Active travel - "+this_st+"_pct";
        }
      }

      if ($censusMode == "2016") {
        val = val + "_16";
      }

    }

    if ($visMode == "google") {
      if ($modeToggle == "Walking") {
        val = "walk_pct";
      }
      if ($modeToggle == "Cycling") {
        val = "cycle_pct";            
      }
      if ($modeToggle == "Walking and Cycling") {
        val = "active_pct";
      }
    }

    if ($visMode == "temp") {
      if ($modeToggle == "Walking") {
        val = "walk_counter";
      }
      if ($modeToggle == "Cycling") {
        val = "cycle_counter";
      }
      if ($modeToggle == "Walking and Cycling") {
        val = "active_counter";
      }
    }

    console.log('val:')
    console.log(val)

    return val
  
  })


  export const colorBreaks2 = derived([metricToggle
  ], ([$metricToggle]) => {
  
    let cb = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7]

   if($metricToggle.includes('delta')){
  
     cb = [-0.21, -0.18, -0.15, -0.12, -0.09, -0.06, -0.03,  0.  ,  0.03,
       0.06,  0.09,  0.12,  0.15,  0.18,  0.21]
  
     if($metricToggle.includes('Bicycle')){
     cb = [-0.14, -0.12, -0.1 , -0.08, -0.06, -0.04, -0.02,  0.  ,  0.02,
       0.04,  0.06,  0.08,  0.1 ,  0.12,  0.14]
     }
   }
   else{
     if($metricToggle.includes('Bicycle')){
       cb = [0., 0.015, 0.03, 0.045, 0.06, 0.075, 0.09, 0.105, 0.12,
         0.135, 0.15, 0.165, 0.18, 0.195, 0.21]
       }
   }
   return cb
  })
  
  
  export const cols2 = derived([metricToggle
  ], ([$metricToggle]) => {
  
   let co = ['#003f5c',
    '#16466d',
    '#2f4b7c',
    '#4a4f88',
    '#675191',
    '#845195',
    '#a15195',
    '#bc5090',
    '#d45187',
    '#e9547a',
    '#f95d6a',
    '#ff6b58',
    '#ff7c43',
    '#ff912b',
    '#ffa600']
  
   if($metricToggle.includes('delta')){
  
    co = ['#003f5c',
      ' #1a476f',
   '    #384c80',
   '    #58508d',
   '    #8178a9',
   '    #aaa3c5',
   '    #d4d0e2',
   '    #ffffff',
   '    #ffdad5',
   '    #ffb5ad',
   '    #ff8e86',
   '    #ff6361',
   '    #ff764a',
   '    #ff8d2f',
       '#ffa600']
   }
  
   return co
  
  })
  
  
  
  
  

export const metricLabel = derived([metricToggle, metricToggleOptions], ([$metricToggle, $metricToggleOptions]) => {
  return $metricToggleOptions.filter((d) => d.value == $metricToggle)[0].label
})


export let metricFormat = derived(metricToggle, ($metricToggle) => {
  let format = new Intl.NumberFormat('en-US', { style: "percent" })
  return format;
})