import mapboxgl from "mapbox-gl";
import { get, writable } from "svelte/store";
//  import { env } from '$env/dynamic/public';

import { RegionID, fillLayer, stepcounters, showLanes, strava_track } from "./region";
import { ZoomOut, getCurrentCoords } from "./ZoomOut";
import { metricToggle } from "./filterData"

import MapMarker from "../lib/components/MapMarker.svelte";

let geoCenter = [-6.266155, 53.40140],
  geoZoom = 8,
  geoBbox = [geoCenter[0] - .2, geoCenter[1] - .2, geoCenter[0] + .2, geoCenter[1] + .2]

let layer = get(metricToggle)
let layer_opa

export const zoomLevelNumber = writable(geoZoom);

zoomLevelNumber.set(geoZoom);

let map = null;
let mapIsLoaded = false;
let overLayer = "bridge-rail";

function getColorDivs(data){
 let cb
 if(data.includes('delta')){
   cb = [-0.21, -0.18, -0.15, -0.12, -0.09, -0.06, -0.03,  0.  ,  0.03,
     0.06,  0.09,  0.12,  0.15,  0.18,  0.21]
   if(data.includes('cycle')){
   cb = [-0.14, -0.12, -0.1 , -0.08, -0.06, -0.04, -0.02,  0.  ,  0.02,
     0.04,  0.06,  0.08,  0.1 ,  0.12,  0.14]
   }
 }
 else{
   cb = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7]
   if(data.includes('cycle')){
     cb = [0.   , 0.005, 0.01 , 0.015, 0.02 , 0.025, 0.03 , 0.035, 0.04 ,
      0.045, 0.05 , 0.055, 0.06 , 0.065, 0.07 ]
     }

     if(data.includes('Bicycle')){
      cb = [0., 0.015, 0.03, 0.045, 0.06, 0.075, 0.09, 0.105, 0.12,
        0.135, 0.15, 0.165, 0.18, 0.195, 0.21]
      }
 }
 return cb
}

function getColors(data){ let co
 if(data.includes('delta')){
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
 else{
  co = ['#003f5c',
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
 }
 return co
}



function translateBounds(bbox) {
  let box = bbox.split(",");
  return [
    [parseFloat(box[0]), parseFloat(box[1])],
    [parseFloat(box[2]), parseFloat(box[3])],
  ];
}

let censusLayers, googleLayers

export function newMapStore(el) {

  //function to create entire map
  censusLayers =
    ['On foot - Total_pct',
      'Bicycle - Total_pct',
      'Active travel - Total_pct',
      'On foot - Total_pct_16',
      'Bicycle - Total_pct_16',
      'Active travel - Total_pct_16',
      'delta_On foot - Total_pct',
      'delta_Bicycle - Total_pct',
      'delta_Active travel - Total_pct',

      'On foot - Work_pct',
      'Bicycle - Work_pct',
      'Active travel - Work_pct',
      'On foot - Work_pct_16',
      'Bicycle - Work_pct_16',
      'Active travel - Work_pct_16',
      'delta_On foot - Work_pct',
      'delta_Bicycle - Work_pct',
      'delta_Active travel - Work_pct',

      'On foot - School, college or childcare_pct',
      'Bicycle - School, college or childcare_pct',
      'Active travel - School, college or childcare_pct',
      'On foot - School, college or childcare_pct_16',
      'Bicycle - School, college or childcare_pct_16',
      'Active travel - School, college or childcare_pct_16',
      'delta_On foot - School, college or childcare_pct',
      'delta_Bicycle - School, college or childcare_pct',
      'delta_Active travel - School, college or childcare_pct',
    ]


  googleLayers =
    ['walk_pct', 'cycle_pct', 'active_pct']

  fillLayer.set("map-layer-" + layer);

  const zoomOut = new ZoomOut({
    className: "fit-bounds-button",
    title: "Go back to Dublin",
    eventHandler: () => {
      resetMap();
    },
  });

  map = new mapboxgl.Map({
    accessToken: process.env.PUBLIC_MAPBOX_TOKEN,
    container: el,
    style: "mapbox://styles/mapbox/streets-v12",
    bounds: geoBbox,
    minZoom: geoZoom,
    maxZoom: 12,
    antialias: true,
    dragPan: true,
    dragRotate: false,
    fitBoundsOptions: { padding: 120 },
  })
    .addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right")
    .addControl(zoomOut, "bottom-right");

  return {
    // return map object
    getMap: function () {
      return map;
    },

    // on load functionality
    onLoad: function () {
      map.on("load", () => {

        // add electoral information
        map
          .addSource("electoral-boundary-source", {
            type: "geojson",
            data: "./census_data_total.geojson"
          })

        map
          .addSource("division-boundary-source", {
            type: "geojson",
            data: "./divisions.geojson"
          })

        map.addSource('LineString', {
          'type': 'geojson',
          'data': "./segregated_lanes.geojson"
        });

        map.addSource('C2CC', {
          'type': 'geojson',
          'data': "./strava/C2CC.geojson"
        });

        map.addSource('DLR', {
          'type': 'geojson',
          'data': "./strava/DLR.geojson"
        });

        map.addSource('Dodder', {
          'type': 'geojson',
          'data': "./strava/Dodder River.geojson"
        });

        map.addSource('K2TS', {
          'type': 'geojson',
          'data': "./strava/K2TS.geojson"
        });

        map.addSource('Portmarnock', {
          'type': 'geojson',
          'data': "./strava/Portmarnock.geojson"
        });

        // toggle layers based on electoral boundary
        for (let layer of censusLayers) {
          if (layer == get(metricToggle)) {
            layer_opa = 0.8
          }
          else {
            layer_opa = 0
          }


          let colors2 = getColors(layer)
          let cb2 = getColorDivs(layer)

          map.addLayer(
            {
              id: "map-layer-" + layer,
              type: "fill",
              source: "electoral-boundary-source",
              paint: {
                "fill-outline-color": "black",
                "fill-opacity": layer_opa,
                "fill-color": ["case", ["==", ["get", layer], null], "white", [
                  "step",
                  ["get", layer],
                  colors2[0],
                  cb2[1],
                  colors2[1],
                  cb2[2],
                  colors2[2],
                  cb2[3],
                  colors2[3],
                  cb2[4],
                  colors2[4],
                  cb2[5],
                  colors2[5],
                  cb2[6],
                  colors2[6],
                  cb2[7],
                  colors2[7],
                  cb2[8],
                  colors2[8],
                  cb2[9],
                  colors2[9],
                  cb2[10],
                  colors2[10],
                  cb2[11],
                  colors2[11],
                  cb2[12],
                  colors2[12],
                  cb2[13],
                  colors2[13],
                  cb2[14],
                  colors2[14],
                ]],
              },
            }, overLayer
          )

        }

        // toggle layers based on electoral boundary
        for (let layer of googleLayers) {
          if (layer == get(metricToggle)) {
            layer_opa = 0.8

          }
          else {
            layer_opa = 0
          }

          let colors2 = getColors(layer)
          let cb2 = getColorDivs(layer)


          map.addLayer(
            {
              id: "map-layer-" + layer,
              type: "fill",
              source: "division-boundary-source",
              paint: {
                "fill-outline-color": "black",
                "fill-opacity": layer_opa,
                "fill-color": ["case", ["==", ["get", layer], null], "white", [
                  "step",
                  ["get", layer],
                  colors2[0],
                  cb2[1],
                  colors2[1],
                  cb2[2],
                  colors2[2],
                  cb2[3],
                  colors2[3],
                  cb2[4],
                  colors2[4],
                  cb2[5],
                  colors2[5],
                  cb2[6],
                  colors2[6],
                  cb2[7],
                  colors2[7],
                  cb2[8],
                  colors2[8],
                  cb2[9],
                  colors2[9],
                  cb2[10],
                  colors2[10],
                  cb2[11],
                  colors2[11],
                  cb2[12],
                  colors2[12],
                  cb2[13],
                  colors2[13],
                  cb2[14],
                  colors2[14],
                ]],
              },
            }, overLayer
          )

        }

        //cycle paths

        map.addLayer({
          'id': 'LineString',
          'type': 'line',
          'source': 'LineString',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#fff',
            'line-width': 0
          }
        });

        map.addLayer({
          'id': 'C2CC',
          'type': 'line',
          'source': 'C2CC',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#955196',
            'line-width': 0
          }
        });

        map.addLayer({
          'id': 'DLR',
          'type': 'line',
          'source': 'DLR',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#955196',
            'line-width': 0
          }
        });


        map.addLayer({
          'id': 'Dodder',
          'type': 'line',
          'source': 'Dodder',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#955196',
            'line-width': 0
          }
        });

        map.addLayer({
          'id': 'K2TS',
          'type': 'line',
          'source': 'K2TS',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#955196',
            'line-width': 0
          }
        });

        map.addLayer({
          'id': 'Portmarnock',
          'type': 'line',
          'source': 'Portmarnock',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#955196',
            'line-width': 0
          }
        });



        let counters = get(stepcounters)
        console.log(counters)

        counters.map((marker_data) => {
          let mark = document.createElement("div"); //make a markers only div 

          new MapMarker({
            target: mark,
            props: { data: marker_data }
          });

          let marker = new mapboxgl.Marker({ element: mark })
            .setLngLat([marker_data.lon, marker_data.lat])
            .addTo(map);

          return marker.getElement();
        });

        let markers = document.getElementsByClassName("marker");

        for (let i = 0; i < markers.length; i++) {
          markers[i].style.visibility = "hidden";
        }

        for (let layer of censusLayers) {
          map.setPaintProperty("map-layer-" + layer, "fill-opacity-transition", {
            duration: 500,
          });
        }

        mapIsLoaded = true;
      });

      //////* EVENTS *//////
      map.on("click", (e) => {

        if (!get(metricToggle).includes('counter')) {
          // if we are in filled map mode...

          let feats = map.queryRenderedFeatures(e.point).filter(function (d) { return d.layer.id == get(fillLayer) })

          RegionID.set(feats[0].properties);

          map.fitBounds(translateBounds(feats[0].properties.bbox), { padding: 150 });

        }


      });

      map.on('click', 'DLR', (e) => {
        strava_track.set('DLR')
      })

      map.on('click', 'C2CC', (e) => {

        strava_track.set('C2CC')
      })

      map.on('click', 'Dodder', (e) => {

        strava_track.set('Dodder')
      })

      map.on('click', 'K2TS', (e) => {
        strava_track.set('K2TS')
      })

      map.on('click', 'Portmarnock', (e) => {
        strava_track.set('Portmarnock')
      })


      // BUTTON
      map.on("zoom", () => {
        if (this.isMapLoaded()) {
          let currentCoords = getCurrentCoords(map);
          zoomLevelNumber.set(currentCoords.zoom);
        }
      });

      map.on("load", () => {
        if (this.isMapLoaded()) {

          map.resize()
          let currentCoords = getCurrentCoords(map);
          zoomOut.show();

          currentCoords = getCurrentCoords(map);
          zoomLevelNumber.set(currentCoords.zoom);
        }
      });
    },

    isMapLoaded: function () {
      return mapIsLoaded;
    },

    resetMap() {
      RegionID.set('999999');
      map.fitBounds(geoBbox, { padding: 35 });
      zoomLevelNumber.set(geoZoom);
    }
    ,

    changeActiveLayer: (toggle, options) => {
      if (!mapIsLoaded) return;
      let opts = options
      let markers = document.getElementsByClassName("marker");


        if(get(metricToggle).includes('strava')){
          map.setPaintProperty(
            "C2CC",
            "line-width",
            10
          );
          map.setPaintProperty(
            "DLR",
            "line-width",
            10
          );
          map.setPaintProperty(
            "Dodder",
            "line-width",
            10
          );
          map.setPaintProperty(
            "K2TS",
            "line-width",
            10
          );
          map.setPaintProperty(
            "Portmarnock",
            "line-width",
            10
          );
        }

        else{
          map.setPaintProperty(
            "C2CC",
            "line-width",
            0
          );
          map.setPaintProperty(
            "DLR",
            "line-width",
            0
          );
          map.setPaintProperty(
            "Dodder",
            "line-width",
            0
          );
          map.setPaintProperty(
            "K2TS",
            "line-width",
            0
          );
          map.setPaintProperty(
            "Portmarnock",
            "line-width",
            0
          );
        }

      if (toggle.includes('counter')) {

        for (let i = 0; i < markers.length; i++) {
          markers[i].style.visibility = "visible";
        }
      }

      else {
        for (let i = 0; i < markers.length; i++) {
          markers[i].style.visibility = "hidden";
        }

      }

      for (let { _, value } of opts) {

        if (!value.includes('counter')) {

          map.setPaintProperty(
            "map-layer-" + value,
            "fill-opacity",
            value === toggle ? 0.8 : 0
          );

          if (value == toggle) {
            fillLayer.set("map-layer-" + value);
          }
        }

      }
    },
  };
}



export function resetMap() {
  RegionID.set('999999');
  map.fitBounds(geoBbox, { padding: 35 });
  zoomLevelNumber.set(geoZoom);
}

export const mapStore = writable(null);

export function plotLanes(){
  if (!mapIsLoaded) return;
  if (get(showLanes) == true) {
    map.setPaintProperty(
      "LineString",
      "line-width",
      2
    );

    let tmpcol = 'white'

    if(get(metricToggle).includes('counter'))
    {tmpcol = '#324754'}

    map.setPaintProperty(
      "LineString",
      "line-color",
      tmpcol
    );
  }
  else {
    map.setPaintProperty(
      "LineString",
      "line-width",
      0
    );
  }
}


