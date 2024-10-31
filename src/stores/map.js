// This store plots the map for census, google, location and route-based data.

import mapboxgl from "mapbox-gl";
import { get, writable } from "svelte/store";
import { RegionID, fillLayer, stepcounters, showLanes, strava_track } from "./region";
import { getCurrentCoords } from "./getCoords";
import { metricToggle } from "./filterData";
import MapMarker from "../lib/components/MapMarker.svelte";

let geoCenter = [-6.266155, 53.40140],
    geoZoom = 8,
    geoBbox = [geoCenter[0] - 0.2, geoCenter[1] - 0.2, geoCenter[0] + 0.2, geoCenter[1] + 0.2];

let map = null;
let mapIsLoaded = false;
let overLayer = "bridge-rail";

export const zoomLevelNumber = writable(geoZoom);
zoomLevelNumber.set(geoZoom);

// Layer arrays
let censusLayers, googleLayers;
const layer = get(metricToggle);

// Color and boundary helpers
function getColorDivs(data) {

    console.log(data)
    
    if (data.includes('delta')) return data.includes('cycle') ? [-0.14, -0.12, -0.1, -0.08, -0.06, -0.04, -0.02, 0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14] : [-0.21, -0.18, -0.15, -0.12, -0.09, -0.06, -0.03, 0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21];
    if (data.includes('Bicycle')) return [0, 0.015, 0.03, 0.045, 0.06, 0.075, 0.09, 0.105, 0.12, 0.135, 0.15, 0.165, 0.18, 0.195, 0.21];
    if (data.includes('cycle')) return [0, 0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04, 0.045, 0.05, 0.055, 0.06, 0.065, 0.07];
    return [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7];
}

function getColors(data) {
    return data.includes('delta') ? ['#003f5c', '#1a476f', '#384c80', '#58508d', '#8178a9', '#aaa3c5', '#d4d0e2', '#ffffff', '#ffdad5', '#ffb5ad', '#ff8e86', '#ff6361', '#ff764a', '#ff8d2f', '#ffa600']
                                  : ['#003f5c', '#16466d', '#2f4b7c', '#4a4f88', '#675191', '#845195', '#a15195', '#bc5090', '#d45187', '#e9547a', '#f95d6a', '#ff6b58', '#ff7c43', '#ff912b', '#ffa600'];
}

function translateBounds(bbox) {
    let box = bbox.split(",");
    return [[parseFloat(box[0]), parseFloat(box[1])], [parseFloat(box[2]), parseFloat(box[3])]];
}

// Set up map layers and sources
export function newMapStore(el) {
    censusLayers = [
        'On foot - Total_pct', 'Bicycle - Total_pct', 'Active travel - Total_pct', 'On foot - Total_pct_16', 'Bicycle - Total_pct_16', 'Active travel - Total_pct_16',
        'delta_On foot - Total_pct', 'delta_Bicycle - Total_pct', 'delta_Active travel - Total_pct', 'On foot - Work_pct', 'Bicycle - Work_pct', 'Active travel - Work_pct',
        'On foot - Work_pct_16', 'Bicycle - Work_pct_16', 'Active travel - Work_pct_16', 'delta_On foot - Work_pct', 'delta_Bicycle - Work_pct', 'delta_Active travel - Work_pct',
        'On foot - School, college or childcare_pct', 'Bicycle - School, college or childcare_pct', 'Active travel - School, college or childcare_pct', 'On foot - School, college or childcare_pct_16',
        'Bicycle - School, college or childcare_pct_16', 'Active travel - School, college or childcare_pct_16', 'delta_On foot - School, college or childcare_pct', 'delta_Bicycle - School, college or childcare_pct',
        'delta_Active travel - School, college or childcare_pct'
    ];

    googleLayers = ['walk_pct', 'cycle_pct', 'active_pct'];
    fillLayer.set("map-layer-" + layer);

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
    }).addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    return {
        getMap: () => map,
        onLoad: () => setupMap(),
        isMapLoaded: () => mapIsLoaded,
        resetMap,
        changeActiveLayer,
    };
}

function setupMap() {
    map.on("load", () => {
        addSources();
        addLayers();
        placeMarkers();
        setMapEvents();
        mapIsLoaded = true;
    });
}

function addSources() {
    const sources = [
        { id: "electoral-boundary-source", url: "./census_data_total.geojson" },
        { id: "division-boundary-source", url: "./divisions.geojson" },
        { id: "LineString", url: "./segregated_lanes.geojson" },
        { id: "C2CC", url: "./strava/C2CC.geojson" },
        { id: "DLR", url: "./strava/DLR.geojson" },
        { id: "Dodder", url: "./strava/Dodder River.geojson" },
        { id: "K2TS", url: "./strava/K2TS.geojson" },
        { id: "Portmarnock", url: "./strava/Portmarnock.geojson" },
    ];
    sources.forEach(({ id, url }) => {
        map.addSource(id, { type: "geojson", data: url });
    });
}

function addLayers() {
    censusLayers.forEach(layer => addLayer(layer, "electoral-boundary-source"));
    googleLayers.forEach(layer => addLayer(layer, "division-boundary-source"));
    addLineLayers();
}

function addLayer(layer, source) {
    const opacity = layer === get(metricToggle) ? 0.8 : 0;
    map.addLayer({
        id: "map-layer-" + layer,
        type: "fill",
        source,
        paint: {
            "fill-outline-color": "black",
            "fill-opacity": opacity,
            "fill-color": ["case", ["==", ["get", layer], null], "white", ["step", ["get", layer], ...buildColorSteps(layer)]],
        }
    }, overLayer);
}

function buildColorSteps(layer) {
  const colors = getColors(layer);
  const divs = getColorDivs(layer);
  
  // Create an array that starts with the first color (the initial fill color) 
  // and pairs each division threshold with a corresponding color
  const colorSteps = [colors[0]]; // Base color
  for (let i = 1; i < divs.length; i++) {
      colorSteps.push(divs[i], colors[i]);
  }
  return colorSteps;
}

function addLineLayers() {
    const lineLayers = ["LineString", "C2CC", "DLR", "Dodder", "K2TS", "Portmarnock"];
    lineLayers.forEach(layer => {
        map.addLayer({
            id: layer,
            type: 'line',
            source: layer,
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#955196', 'line-width': 0 }
        });
    });
}

function placeMarkers() {
    get(stepcounters).forEach(markerData => {
        const markerElement = document.createElement("div");
        new MapMarker({ target: markerElement, props: { data: markerData } });
        new mapboxgl.Marker({ element: markerElement })
            .setLngLat([markerData.lon, markerData.lat])
            .addTo(map);
    });
    toggleMarkersVisibility("hidden");
}

function toggleMarkersVisibility(visibility) {
    Array.from(document.getElementsByClassName("marker")).forEach(marker => {
        marker.style.visibility = visibility;
    });
}

function setMapEvents() {
    map.on("click", handleClick);
    map.on("zoom", () => zoomLevelNumber.set(getCurrentCoords(map).zoom));
}

function handleClick(e) {
    const toggle = get(metricToggle);
    if (!toggle.includes("counter")) {
        const features = map.queryRenderedFeatures(e.point).filter(d => d.layer.id === get(fillLayer));
        if (features.length) {
            RegionID.set(features[0].properties);
            map.fitBounds(translateBounds(features[0].properties.bbox), { padding: 150 });
        }
    }
    ["DLR", "C2CC", "Dodder", "K2TS", "Portmarnock"].forEach(layer => {
        map.on("click", layer, () => strava_track.set(layer));
    });
}

export function resetMap() {
    RegionID.set("999999");
    map.fitBounds(geoBbox, { padding: 35 });
    zoomLevelNumber.set(geoZoom);
}

export function plotLanes() {
    if (!mapIsLoaded) return;
    const laneWidth = get(showLanes) ? 2 : 0;
    const laneColor = get(metricToggle).includes("counter")||get(metricToggle).includes("delta") ? "#324754" : "white";
    map.setPaintProperty("LineString", "line-width", laneWidth);
    map.setPaintProperty("LineString", "line-color", laneColor);
}

function changeActiveLayer(toggle, options) {
  if (!mapIsLoaded) return;

  // Show or hide markers based on the presence of 'counter' in toggle
  toggle.includes("counter") ? toggleMarkersVisibility("visible") : toggleMarkersVisibility("hidden");

  // Adjust the fill opacity for the relevant map layers
  options.forEach(({ _, value }) => {
      if (!value.includes("counter")) {
          map.setPaintProperty("map-layer-" + value, "fill-opacity", value === toggle ? 0.8 : 0);
          if (value === toggle) fillLayer.set("map-layer-" + value);
      }
  });

  // Set line width for specific layers if 'strava' is present in metricToggle
  const stravaLayers = ["C2CC", "DLR", "Dodder", "K2TS", "Portmarnock"];
  const lineWidth = get(metricToggle).includes("strava") ? 10 : 0;

  stravaLayers.forEach(layer => {
      map.setPaintProperty(layer, "line-width", lineWidth);
  });
}
export const mapStore = writable(null);
