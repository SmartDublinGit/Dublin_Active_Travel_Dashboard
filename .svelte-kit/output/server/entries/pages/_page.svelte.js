import { b as get_store_value, c as create_ssr_component, d as add_attribute, e as escape, a as subscribe, v as validate_component, f as add_styles, h as each } from "../../chunks/ssr.js";
import { w as writable, r as readable, d as derived } from "../../chunks/index2.js";
import * as d3 from "d3";
import { format } from "d3";
import "mapbox-gl";
import { faBicycle, faPersonWalking, faHeartPulse, faEuroSign, faSmog, faCarSide, faBus } from "@fortawesome/free-solid-svg-icons";
const app = "";
let RegionID = writable("999999");
let selected_counter = writable("100043587");
let counter_data = writable("");
let counter_name = writable("Select a counter to begin.");
let showLanes = writable(true);
let sums = writable("");
let sumsGoogle = writable("");
const metricToggleOptions = readable([
  { label: "Walking 2022: Total", value: "On foot - Total_pct", group: "census" },
  { label: "Cycling 2022: Total", value: "Bicycle - Total_pct", group: "census" },
  { label: "Walking and Cycling 2022: Total", value: "Active travel - Total_pct", group: "census" },
  { label: "Walking 2016: Total", value: "On foot - Total_pct_16", group: "census" },
  { label: "Cycling 2016: Total", value: "Bicycle - Total_pct_16", group: "census" },
  { label: "Walking and Cycling 2016: Total", value: "Active travel - Total_pct_16", group: "census" },
  { label: "Change in Walking 2016-2022: Total", value: "delta_On foot - Total_pct", group: "census" },
  { label: "Change in Cycling 2016-2022: Total", value: "delta_Bicycle - Total_pct", group: "census" },
  { label: "Change in Walking & Cycling 2016-2022: Total", value: "delta_Active travel - Total_pct", group: "census" },
  { label: "Walking 2022: Work", value: "On foot - Work_pct", group: "census" },
  { label: "Cycling 2022: Work", value: "Bicycle - Work_pct", group: "census" },
  { label: "Walking and Cycling 2022: Work", value: "Active travel - Work_pct", group: "census" },
  { label: "Walking 2016: Work", value: "On foot - Work_pct_16", group: "census" },
  { label: "Cycling 2016: Work", value: "Bicycle - Work_pct_16", group: "census" },
  { label: "Walking and Cycling 2016: Work", value: "Active travel - Work_pct_16", group: "census" },
  { label: "Change in Walking 2016-2022: Work", value: "delta_On foot - Work_pct", group: "census" },
  { label: "Change in Cycling 2016-2022: Work", value: "delta_Bicycle - Work_pct", group: "census" },
  { label: "Change in Walking & Cycling 2016-2022: Work", value: "delta_Active travel - Work_pct", group: "census" },
  { label: "Walking 2022: School/college", value: "On foot - School, college or childcare_pct", group: "census" },
  { label: "Cycling 2022: School/college", value: "Bicycle - School, college or childcare_pct", group: "census" },
  { label: "Walking and Cycling 2022: School/college", value: "Active travel - School, college or childcare_pct", group: "census" },
  { label: "Walking 2016: School/college", value: "On foot - School, college or childcare_pct_16", group: "census" },
  { label: "Cycling 2016: School/college", value: "Bicycle - School, college or childcare_pct_16", group: "census" },
  { label: "Walking and Cycling School/college: Total", value: "Active travel - School, college or childcare_pct_16", group: "census" },
  { label: "Change in Walking 2016-2022: School/college", value: "delta_On foot - School, college or childcare_pct", group: "census" },
  { label: "Change in Cycling 2016-2022: School/college", value: "delta_Bicycle - School, college or childcare_pct", group: "census" },
  { label: "Change in Walking & Cycling 2016-2022: School/college", value: "delta_Active travel - School, college or childcare_pct", group: "census" },
  { label: "Walking 2023", value: "walk_pct", group: "google" },
  { label: "Cycling 2023", value: "cycle_pct", group: "google" },
  { label: "Walking and Cycling 2023", value: "active_pct", group: "google" },
  { label: "Walking", value: "walk_counter", group: "temp" },
  { label: "Cycling", value: "cycle_counter", group: "temp" },
  { label: "Walking and Cycling", value: "active_counter", group: "temp" }
]);
const modeToggleOptions = readable(["Walking", "Cycling", "Walking and Cycling"]);
const visModeOptions = readable([
  { label: "Census", value: "census" },
  { label: "Google Trips", value: "google" },
  { label: "Eco Counters Data", value: "temp" }
  // { label: "Strava", value: "strava" },
]);
const censusOptions = readable(["2022", "2016", "Change"]);
const visMode = writable("census");
const modeToggle = writable("Walking");
const censusMode = writable("2022");
const dataOptions = readable(["Total", "Work", "School or College"]);
const dataMode = writable("Total");
const metricToggle = derived([
  visMode,
  censusMode,
  modeToggle,
  dataMode
], ([
  $visMode,
  $censusMode,
  $modeToggle,
  $dataMode
]) => {
  let val = "";
  let this_st = "Total";
  console.log("data mode");
  console.log($dataMode);
  if ($dataMode == "School or College") {
    this_st = "School, college or childcare";
  }
  if ($dataMode == "Work") {
    this_st = "Work";
  }
  if ($visMode == "census") {
    if ($modeToggle == "Walking") {
      val = "On foot - " + this_st + "_pct";
    }
    if ($modeToggle == "Cycling") {
      val = "Bicycle - " + this_st + "_pct";
    }
    if ($modeToggle == "Walking and Cycling") {
      val = "Active travel - " + this_st + "_pct";
    }
    if ($censusMode == "Change") {
      if ($modeToggle == "Walking") {
        val = "delta_On foot - " + this_st + "_pct";
      }
      if ($modeToggle == "Cycling") {
        val = "delta_Bicycle - " + this_st + "_pct";
      }
      if ($modeToggle == "Walking and Cycling") {
        val = "delta_Active travel - " + this_st + "_pct";
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
  console.log("val:");
  console.log(val);
  return val;
});
const colorBreaks2 = derived([
  metricToggle
], ([$metricToggle]) => {
  let cb = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7];
  if ($metricToggle.includes("delta")) {
    cb = [
      -0.21,
      -0.18,
      -0.15,
      -0.12,
      -0.09,
      -0.06,
      -0.03,
      0,
      0.03,
      0.06,
      0.09,
      0.12,
      0.15,
      0.18,
      0.21
    ];
    if ($metricToggle.includes("Bicycle")) {
      cb = [
        -0.14,
        -0.12,
        -0.1,
        -0.08,
        -0.06,
        -0.04,
        -0.02,
        0,
        0.02,
        0.04,
        0.06,
        0.08,
        0.1,
        0.12,
        0.14
      ];
    }
  } else {
    if ($metricToggle.includes("Bicycle")) {
      cb = [
        0,
        0.015,
        0.03,
        0.045,
        0.06,
        0.075,
        0.09,
        0.105,
        0.12,
        0.135,
        0.15,
        0.165,
        0.18,
        0.195,
        0.21
      ];
    }
  }
  return cb;
});
const cols2 = derived([
  metricToggle
], ([$metricToggle]) => {
  let co = [
    "#003f5c",
    "#16466d",
    "#2f4b7c",
    "#4a4f88",
    "#675191",
    "#845195",
    "#a15195",
    "#bc5090",
    "#d45187",
    "#e9547a",
    "#f95d6a",
    "#ff6b58",
    "#ff7c43",
    "#ff912b",
    "#ffa600"
  ];
  if ($metricToggle.includes("delta")) {
    co = [
      "#003f5c",
      " #1a476f",
      "    #384c80",
      "    #58508d",
      "    #8178a9",
      "    #aaa3c5",
      "    #d4d0e2",
      "    #ffffff",
      "    #ffdad5",
      "    #ffb5ad",
      "    #ff8e86",
      "    #ff6361",
      "    #ff764a",
      "    #ff8d2f",
      "#ffa600"
    ];
  }
  return co;
});
const metricLabel = derived([metricToggle, metricToggleOptions], ([$metricToggle, $metricToggleOptions]) => {
  return $metricToggleOptions.filter((d) => d.value == $metricToggle)[0].label;
});
let metricFormat = derived(metricToggle, ($metricToggle) => {
  let format2 = new Intl.NumberFormat("en-US", { style: "percent" });
  return format2;
});
const MapMarker_svelte_svelte_type_style_lang = "";
let geoZoom = 8;
get_store_value(metricToggle);
const zoomLevelNumber = writable(geoZoom);
zoomLevelNumber.set(geoZoom);
const mapStore = writable(null);
function getTransform(scale, translateX, translateY, rotate, flip, translateTimes = 1, translateUnit = "", rotateUnit = "") {
  let flipX = 1;
  let flipY = 1;
  if (flip) {
    if (flip == "horizontal") {
      flipX = -1;
    } else if (flip == "vertical") {
      flipY = -1;
    } else {
      flipX = flipY = -1;
    }
  }
  if (typeof scale === "string") {
    scale = parseFloat(scale);
  }
  if (typeof translateX === "string") {
    translateX = parseFloat(translateX);
  }
  if (typeof translateY === "string") {
    translateY = parseFloat(translateY);
  }
  const x = `${translateX * translateTimes}${translateUnit}`;
  const y = `${translateY * translateTimes}${translateUnit}`;
  let output = `translate(${x},${y}) scale(${flipX * scale},${flipY * scale})`;
  if (rotate) {
    output += ` rotate(${rotate}${rotateUnit})`;
  }
  return output;
}
const fa_svelte_svelte_type_style_lang = "";
const css$9 = {
  code: ".svelte-fa-base{height:1em;overflow:visible;transform-origin:center;vertical-align:-0.125em}.svelte-fa-fw{text-align:center;width:1.25em}.svelte-fa-pull-left.svelte-bvo74f{float:left}.svelte-fa-pull-right.svelte-bvo74f{float:right}.svelte-fa-size-lg.svelte-bvo74f{font-size:1.33333em;line-height:0.75em;vertical-align:-0.225em}.svelte-fa-size-sm.svelte-bvo74f{font-size:0.875em}.svelte-fa-size-xs.svelte-bvo74f{font-size:0.75em}.spin.svelte-bvo74f{animation:svelte-bvo74f-spin 2s 0s infinite linear}.pulse.svelte-bvo74f{animation:svelte-bvo74f-spin 1s infinite steps(8)}@keyframes svelte-bvo74f-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
  map: null
};
const Fa = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let i;
  let transform;
  let { class: clazz = void 0 } = $$props;
  let { id = void 0 } = $$props;
  let { style = void 0 } = $$props;
  let { icon } = $$props;
  let { size = void 0 } = $$props;
  let { color = void 0 } = $$props;
  let { fw = false } = $$props;
  let { pull = void 0 } = $$props;
  let { scale = 1 } = $$props;
  let { translateX = 0 } = $$props;
  let { translateY = 0 } = $$props;
  let { rotate = void 0 } = $$props;
  let { flip = void 0 } = $$props;
  let { spin = false } = $$props;
  let { pulse = false } = $$props;
  let { primaryColor = "" } = $$props;
  let { secondaryColor = "" } = $$props;
  let { primaryOpacity = 1 } = $$props;
  let { secondaryOpacity = 0.4 } = $$props;
  let { swapOpacity = false } = $$props;
  let svgElement;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0)
    $$bindings.icon(icon);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.fw === void 0 && $$bindings.fw && fw !== void 0)
    $$bindings.fw(fw);
  if ($$props.pull === void 0 && $$bindings.pull && pull !== void 0)
    $$bindings.pull(pull);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  if ($$props.translateX === void 0 && $$bindings.translateX && translateX !== void 0)
    $$bindings.translateX(translateX);
  if ($$props.translateY === void 0 && $$bindings.translateY && translateY !== void 0)
    $$bindings.translateY(translateY);
  if ($$props.rotate === void 0 && $$bindings.rotate && rotate !== void 0)
    $$bindings.rotate(rotate);
  if ($$props.flip === void 0 && $$bindings.flip && flip !== void 0)
    $$bindings.flip(flip);
  if ($$props.spin === void 0 && $$bindings.spin && spin !== void 0)
    $$bindings.spin(spin);
  if ($$props.pulse === void 0 && $$bindings.pulse && pulse !== void 0)
    $$bindings.pulse(pulse);
  if ($$props.primaryColor === void 0 && $$bindings.primaryColor && primaryColor !== void 0)
    $$bindings.primaryColor(primaryColor);
  if ($$props.secondaryColor === void 0 && $$bindings.secondaryColor && secondaryColor !== void 0)
    $$bindings.secondaryColor(secondaryColor);
  if ($$props.primaryOpacity === void 0 && $$bindings.primaryOpacity && primaryOpacity !== void 0)
    $$bindings.primaryOpacity(primaryOpacity);
  if ($$props.secondaryOpacity === void 0 && $$bindings.secondaryOpacity && secondaryOpacity !== void 0)
    $$bindings.secondaryOpacity(secondaryOpacity);
  if ($$props.swapOpacity === void 0 && $$bindings.swapOpacity && swapOpacity !== void 0)
    $$bindings.swapOpacity(swapOpacity);
  $$result.css.add(css$9);
  i = icon && icon.icon || [0, 0, "", [], ""];
  transform = getTransform(scale, translateX, translateY, rotate, flip, 512);
  return `${i[4] ? ` <svg${add_attribute("id", id, 0)} class="${[
    "svelte-fa svelte-fa-base " + escape(clazz, true) + " svelte-bvo74f",
    (pulse ? "pulse" : "") + " " + (size === "lg" ? "svelte-fa-size-lg" : "") + " " + (size === "sm" ? "svelte-fa-size-sm" : "") + " " + (size === "xs" ? "svelte-fa-size-xs" : "") + " " + (fw ? "svelte-fa-fw" : "") + " " + (pull === "left" ? "svelte-fa-pull-left" : "") + " " + (pull === "right" ? "svelte-fa-pull-right" : "") + " " + (spin ? "spin" : "")
  ].join(" ").trim()}"${add_attribute("style", style, 0)} viewBox="${"0 0 " + escape(i[0], true) + " " + escape(i[1], true)}" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"${add_attribute("this", svgElement, 0)}><g transform="${"translate(" + escape(i[0] / 2, true) + " " + escape(i[1] / 2, true) + ")"}" transform-origin="${escape(i[0] / 4, true) + " 0"}"><g${add_attribute("transform", transform, 0)}>${typeof i[4] == "string" ? `<path${add_attribute("d", i[4], 0)}${add_attribute("fill", color || primaryColor || "currentColor", 0)} transform="${"translate(" + escape(i[0] / -2, true) + " " + escape(i[1] / -2, true) + ")"}"></path>` : ` <path${add_attribute("d", i[4][0], 0)}${add_attribute("fill", secondaryColor || color || "currentColor", 0)}${add_attribute("fill-opacity", swapOpacity != false ? primaryOpacity : secondaryOpacity, 0)} transform="${"translate(" + escape(i[0] / -2, true) + " " + escape(i[1] / -2, true) + ")"}"></path> <path${add_attribute("d", i[4][1], 0)}${add_attribute("fill", primaryColor || color || "currentColor", 0)}${add_attribute("fill-opacity", swapOpacity != false ? secondaryOpacity : primaryOpacity, 0)} transform="${"translate(" + escape(i[0] / -2, true) + " " + escape(i[1] / -2, true) + ")"}"></path>`}</g></g></svg>` : ``}`;
});
const faLayers_svelte_svelte_type_style_lang = "";
const faLayersText_svelte_svelte_type_style_lang = "";
const Dublin_info_redux_svelte_svelte_type_style_lang = "";
const css$8 = {
  code: ".container.svelte-tnuu5p{height:100svh;min-height:100svh}.dublin-header.svelte-tnuu5p{font-size:1.2rem;font-style:normal;font-weight:500;background-color:#a7c9de;padding:5px 0px 5px 5px;-moz-border-radius:0px;-webkit-border-radius:15px 15px 0px 0px;border-radius:15px 15px 0px 0px;text-indent:10px;color:#324754}.flex-items.svelte-tnuu5p{display:flex;gap:10px}.flex-items2.svelte-tnuu5p{display:flex;gap:20px}.overall2.svelte-tnuu5p{background:white;width:100%;border-radius:15px;box-shadow:0px 4px 4px 0px rgba(0, 0, 0, 0);padding-bottom:2px;margin-bottom:20px;cursor:pointer}.item.svelte-tnuu5p{display:flex;flex:1 1 50%;gap:6px}.text.svelte-tnuu5p{flex:0 1 auto;text-transform:uppercase;padding:10px;padding-left:15px;padding-right:15px;margin-bottom:0px}.text2.svelte-tnuu5p{flex:0 1 auto}.number-green.svelte-tnuu5p{font-size:1.5rem;font-style:normal;text-transform:none;font-weight:400;line-height:137.5%;margin-bottom:0;color:#955196}.number.svelte-tnuu5p{font-size:1.5rem;font-style:normal;text-transform:none;font-weight:400;line-height:137.5%;margin-bottom:0;color:#374c80\n  }.number2.svelte-tnuu5p{font-size:1rem;font-style:300px;font-weight:300;line-height:137.5%;margin-bottom:0;padding:15px}.loc.svelte-tnuu5p{font-size:1.3rem;font-style:normal;color:#6d8495;font-weight:normal;line-height:120%;margin-bottom:5px}.label.svelte-tnuu5p{font-size:.9rem;font-style:normal;color:#6d8495;font-weight:700;line-height:130%;margin-bottom:6px;margin-top:2px}@media screen and (max-width: 450px){.dublin-header.svelte-tnuu5p{font-size:24px;line-height:137.5%}.number.svelte-tnuu5p{font-size:24px;line-height:150%}.label.svelte-tnuu5p{font-size:1px;line-height:150%}.flex-items.svelte-tnuu5p{flex-direction:column;gap:9px}.item.svelte-tnuu5p:not(:first-of-type){border-top:1px solid #ececec;padding-top:10px}}",
  map: null
};
const Dublin_info_redux = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let walk;
  let cycle;
  let prem_deaths_cycle;
  let prem_deaths_walk;
  let cycle_eur_saved;
  let walk_eur_saved;
  let co2_saved_year;
  let co2_saved_year_bike;
  let traffic_year_foot;
  let traffic_year_cycle;
  let $RegionID, $$unsubscribe_RegionID;
  let $sums, $$unsubscribe_sums;
  let $metricLabel, $$unsubscribe_metricLabel;
  $$unsubscribe_RegionID = subscribe(RegionID, (value) => $RegionID = value);
  $$unsubscribe_sums = subscribe(sums, (value) => $sums = value);
  $$unsubscribe_metricLabel = subscribe(metricLabel, (value) => $metricLabel = value);
  let f = format(",.0f");
  let f2 = format(".2f");
  let { cmode } = $$props;
  let { dmode } = $$props;
  let txt2 = "";
  let tit2 = "";
  let string_16 = "";
  let string_delta = "";
  let location = "Dublin";
  let mode;
  if ($$props.cmode === void 0 && $$bindings.cmode && cmode !== void 0)
    $$bindings.cmode(cmode);
  if ($$props.dmode === void 0 && $$bindings.dmode && dmode !== void 0)
    $$bindings.dmode(dmode);
  $$result.css.add(css$8);
  {
    {
      console.log(cmode);
      console.log(dmode);
      console.log("summzzz");
      console.log($sums);
    }
  }
  {
    {
      if (cmode == "2016") {
        string_16 = "_16";
      } else {
        string_16 = "";
      }
      if (cmode == "Change") {
        string_delta = "delta_";
      } else {
        string_delta = "";
      }
      if ($RegionID == "999999") {
        txt2 = 'This data shows active travel based on the <a style="font-weight:bold"> Means of Travel data from the 2022 and 2016 census</a>, aggregated at local electoral level. Click on a <a style="font-weight:bold;color:#374c80">statistic</a> for information on how it was calculated. ';
        tit2 = "this data";
      }
    }
  }
  {
    {
      if (dmode == "School or College") {
        mode = "School, college or childcare";
      } else {
        mode = dmode;
      }
    }
  }
  location = $RegionID == "999999" ? "Dublin" : $RegionID.ED_ENGLISH;
  walk = $RegionID == "999999" ? f2(100 * $sums[string_delta + "On foot - " + mode + "_pct" + string_16]) + "%" : f2(100 * $RegionID[string_delta + "On foot - " + mode + "_pct" + string_16]) + "%";
  cycle = $RegionID == "999999" ? f2(100 * $sums[string_delta + "Bicycle - " + mode + "_pct" + string_16]) + "%" : f2(100 * $RegionID[string_delta + "Bicycle - " + mode + "_pct" + string_16]) + "%";
  prem_deaths_cycle = $RegionID == "999999" ? f(1025e-6 * $sums[string_delta + "Bicycle - " + mode + string_16]) : f2(1025e-6 * $RegionID[string_delta + "Bicycle - " + mode + string_16]);
  prem_deaths_walk = $RegionID == "999999" ? f(1025e-6 * $sums[string_delta + "On foot - " + mode + string_16]) : f2(1025e-6 * $RegionID[string_delta + "On foot - " + mode + string_16]);
  cycle_eur_saved = $RegionID == "999999" ? "€" + f(401.45 * $sums[string_delta + "Bicycle - " + mode + string_16] / 1e6) + "m " : "€" + f(401.45 * $RegionID[string_delta + "Bicycle - " + mode + string_16]);
  walk_eur_saved = $RegionID == "999999" ? "€" + f(401.45 * $sums[string_delta + "On foot - " + mode + string_16] / 1e6) + "m " : "€" + f(401.45 * $RegionID[string_delta + "On foot - " + mode + string_16]);
  co2_saved_year = $RegionID == "999999" ? f(0.3372 * $sums[string_delta + "On foot - " + mode + string_16]) : f(0.3372 * $RegionID[string_delta + "On foot - " + mode + string_16]);
  co2_saved_year_bike = $RegionID == "999999" ? f(0.3372 * $sums[string_delta + "Bicycle - " + mode + string_16]) : f(0.3372 * $RegionID[string_delta + "Bicycle - " + mode + string_16]);
  traffic_year_foot = $RegionID == "999999" ? f(0.00990867579908675 * $sums[string_delta + "On foot - " + mode + string_16]) : f2(0.00990867579908675 * $RegionID[string_delta + "On foot - " + mode + string_16]);
  traffic_year_cycle = $RegionID == "999999" ? f(0.00990867579908675 * $sums[string_delta + "Bicycle - " + mode + string_16]) : "" + f2(0.00990867579908675 * $RegionID[string_delta + "Bicycle - " + mode + string_16]);
  $$unsubscribe_RegionID();
  $$unsubscribe_sums();
  $$unsubscribe_metricLabel();
  return `<div class="container svelte-tnuu5p"><div class="overall2 svelte-tnuu5p"><h2 class="dublin-header svelte-tnuu5p">${escape("Regional info: " + $metricLabel)}</h2> <div class="flex-items2 svelte-tnuu5p"><div class="population-box item svelte-tnuu5p">${location === "Dublin" ? `<div class="text svelte-tnuu5p"><p class="label svelte-tnuu5p" data-svelte-h="svelte-vv3ej7">Region</p> <p class="loc svelte-tnuu5p">${escape(location)}</p> <p class="label svelte-tnuu5p"></p></div>` : `<div class="text svelte-tnuu5p"><p class="label svelte-tnuu5p" data-svelte-h="svelte-vv3ej7">Region</p> <p class="loc svelte-tnuu5p">${escape(location)}</p> <p class="label svelte-tnuu5p"><!-- HTML_TAG_START -->&#9204;<!-- HTML_TAG_END --></p></div>`}</div> <div class="population-box item svelte-tnuu5p"><div class="text svelte-tnuu5p"><p class="label svelte-tnuu5p" data-svelte-h="svelte-gpswxs">Commuters</p> <p class="number-green svelte-tnuu5p">${escape(cycle + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faBicycle }, {}, {})}</span></p> <p class="number svelte-tnuu5p">${escape(walk + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faPersonWalking }, {}, {})}</span></p></div></div></div></div> <div class="flex-items2 svelte-tnuu5p"><div class="overall2 svelte-tnuu5p" style="${"background-color:" + escape("white", true)}"><h2 class="dublin-header svelte-tnuu5p">${validate_component(Fa, "Fa").$$render($$result, { icon: faHeartPulse }, {}, {})} Health</h2> <div class="flex-items svelte-tnuu5p"><div class="population-box item svelte-tnuu5p"><div class="text svelte-tnuu5p"><p class="label svelte-tnuu5p" data-svelte-h="svelte-svrreq">Annual premature deaths avoided</p> <p class="number-green svelte-tnuu5p">${escape(prem_deaths_cycle + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faBicycle }, {}, {})}</span></p> <p class="number svelte-tnuu5p">${escape(prem_deaths_walk + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faPersonWalking }, {}, {})}</span></p></div></div></div></div> <div class="overall2 svelte-tnuu5p" style="${"background-color:" + escape("white", true)}"><h2 class="dublin-header svelte-tnuu5p">${validate_component(Fa, "Fa").$$render($$result, { icon: faEuroSign }, {}, {})} Financial</h2> <div class="text svelte-tnuu5p"><p class="label svelte-tnuu5p" data-svelte-h="svelte-kfri9i">Annual money saved on fuel</p> <p class="number-green svelte-tnuu5p">${escape(cycle_eur_saved + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faBicycle }, {}, {})}</span></p> <p class="number svelte-tnuu5p">${escape(walk_eur_saved + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faPersonWalking }, {}, {})}</span></p></div></div></div> <div class="flex-items2 svelte-tnuu5p"><div class="overall2 svelte-tnuu5p" style="${"background-color:" + escape("white", true)}"><h2 class="dublin-header svelte-tnuu5p">${validate_component(Fa, "Fa").$$render($$result, { icon: faSmog }, {}, {})} CO2</h2> <div class="text svelte-tnuu5p"><p class="label svelte-tnuu5p" data-svelte-h="svelte-ryza63">Annual CO2 saved (Tonnes)</p> <p class="number-green svelte-tnuu5p">${escape(co2_saved_year_bike + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faBicycle }, {}, {})}</span></p> <p class="number svelte-tnuu5p">${escape(co2_saved_year + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faPersonWalking }, {}, {})}</span></p></div></div> <div class="overall2 svelte-tnuu5p" style="${"background-color:" + escape("white", true)}"><h2 class="dublin-header svelte-tnuu5p">${validate_component(Fa, "Fa").$$render($$result, { icon: faCarSide }, {}, {})} Congestion</h2> <div class="text svelte-tnuu5p"><p class="label svelte-tnuu5p" data-svelte-h="svelte-1cnj7bt">Annual time savings (years)</p> <p class="number-green svelte-tnuu5p">${escape(traffic_year_cycle + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faBicycle }, {}, {})}</span></p> <p class="number svelte-tnuu5p">${escape(traffic_year_foot + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faPersonWalking }, {}, {})}</span></p></div></div></div> <div class="overall2 svelte-tnuu5p"><div class="text2 svelte-tnuu5p"><h2 class="dublin-header svelte-tnuu5p">${escape("About " + tit2)}</h2> <div class="number2 svelte-tnuu5p"><!-- HTML_TAG_START -->${txt2}<!-- HTML_TAG_END --></div></div></div> </div>`;
});
const Donut_svelte_svelte_type_style_lang = "";
const css$7 = {
  code: "body{margin:0}.chart-inner.svelte-pann8v{display:flex}",
  map: null
};
let width = 250;
let height = 250;
let margin = 0;
function midAngle(d) {
  return d.startAngle + (d.endAngle - d.startAngle) / 2;
}
const Donut = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let final_data = {};
  let data_ready;
  let pct;
  let summ;
  let color = d3.scaleOrdinal().domain(["AUTOMOBILE_trips", "PUBLIC_trips", "CYCLING_trips", "ON FOOT_trips"]).range(["#e9547a", "#ff912b", "#955196", "#374c80"]);
  let radius = Math.min(width, height) / 2 - margin;
  const pie = d3.pie().sort(null).value(
    (d) => d[1]
  );
  function calculatePercentage(slice) {
    let dd = slice.data[1] / summ * 100;
    if (dd > 4) {
      return dd.toFixed(0) + "%";
    } else {
      return "";
    }
  }
  const arc = d3.arc().innerRadius(radius * 0.6).outerRadius(
    radius * 0.9
  );
  const outerArc = d3.arc().innerRadius(radius * 0.75).outerRadius(radius * 0.75);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$7);
  {
    {
      let keys = Object.keys(data);
      pct = [];
      summ = 0;
      keys.forEach(function(d) {
        if (d.includes("trips") & ~d.includes("TOTAL")) {
          pct.push(d);
          summ += data[d];
          final_data[d] = data[d];
        }
      });
      const dataArray = Object.entries(final_data);
      const sortedDataArray = dataArray.sort((a, b) => b[1] - a[1]);
      final_data = Object.fromEntries(sortedDataArray);
      data_ready = pie(Object.entries(final_data));
    }
  }
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} viewBox="${escape(-width / 2, true) + ", " + escape(-height / 2, true) + ", " + escape(width, true) + ", " + escape(height, true)}"${add_styles({ "max-width": `100%`, "height": `auto` })}><g class="chart-inner svelte-pann8v">${each(data_ready, (slice) => {
    return `<path${add_attribute("d", arc(slice), 0)}${add_attribute("fill", color(slice.data[0]), 0)} stroke="white"></path>`;
  })}${each(data_ready, (slice) => {
    return `<text${add_attribute("transform", `translate(${outerArc.centroid(slice)})`, 0)}${add_attribute("x", 0, 0)} dy="0.35rem"${add_attribute("text-anchor", midAngle(slice) < Math.PI ? "middle" : "middle", 0)} font-size="16px" fill="#fff">${escape(calculatePercentage(slice))}</text>`;
  })}</g></svg>`;
});
const Dublin_district_info_redux_svelte_svelte_type_style_lang = "";
const css$6 = {
  code: ".container.svelte-1p3kfkh{height:100svh;min-height:100svh}.dublin-header.svelte-1p3kfkh{font-size:1.2rem;font-style:normal;font-weight:500;background-color:#a7c9de;padding:5px 0px 5px 5px;-moz-border-radius:0px;-webkit-border-radius:15px 15px 0px 0px;border-radius:15px 15px 0px 0px;text-indent:10px;color:#324754}.flex-items2.svelte-1p3kfkh{display:flex;gap:20px}.flex-items3.svelte-1p3kfkh{display:flex;gap:5px}.overall2.svelte-1p3kfkh{background:white;width:100%;border-radius:15px;box-shadow:0px 4px 4px 0px rgba(0, 0, 0, 0);padding-bottom:2px;margin-bottom:20px;cursor:pointer}.a1.svelte-1p3kfkh{display:flex;flex:0 0 33%}.a2.svelte-1p3kfkh{display:flex;flex:0 0 66%;align-items:center;flex-direction:column;justify-content:center;padding:0px}.text.svelte-1p3kfkh{flex:0 1 auto;text-transform:uppercase;padding:10px;padding-left:15px;padding-right:15px;margin-bottom:0px}.text2.svelte-1p3kfkh{flex:0 1 auto}.number-green.svelte-1p3kfkh{font-size:1.3rem;font-style:normal;text-transform:none;font-weight:400;line-height:137.5%;margin-bottom:0;color:#955196}.number.svelte-1p3kfkh{font-size:1.3rem;font-style:normal;text-transform:none;font-weight:400;line-height:137.5%;margin-bottom:0;color:#374c80}.number2.svelte-1p3kfkh{font-size:1rem;font-style:300px;font-weight:300;line-height:137.5%;margin-bottom:0;padding:15px}.loc.svelte-1p3kfkh{font-size:1.2rem;font-style:normal;color:#374c80;font-weight:normal;line-height:120%;margin-bottom:5px}.label.svelte-1p3kfkh{font-size:0.9rem;font-style:normal;color:#324754;font-weight:700;line-height:130%;margin-bottom:6px;margin-top:2px}@media screen and (max-width: 450px){.dublin-header.svelte-1p3kfkh{font-size:24px;line-height:137.5%}.number.svelte-1p3kfkh{font-size:24px;line-height:150%}.label.svelte-1p3kfkh{font-size:1px;line-height:150%}}",
  map: null
};
const Dublin_district_info_redux = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let donutData;
  let location;
  let walk;
  let cycle;
  let drive;
  let pubs;
  let co2_saved_year;
  let co2_saved_year_bike;
  let co2_em_year_car;
  let co2_em_year_public;
  let $RegionID, $$unsubscribe_RegionID;
  let $sumsGoogle, $$unsubscribe_sumsGoogle;
  $$unsubscribe_RegionID = subscribe(RegionID, (value) => $RegionID = value);
  $$unsubscribe_sumsGoogle = subscribe(sumsGoogle, (value) => $sumsGoogle = value);
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
    "dún-laoghaire": "Dún Laoghaire"
  };
  let txt2 = "";
  let tit2 = "this data";
  $$result.css.add(css$6);
  {
    {
      console.log($RegionID);
      if ($RegionID == "999999") {
        txt2 = `This view shows active travel data based on <a style="font-weight:bold">Google's modal split data of Dublin for 2023</a>, aggregated at electoral district level. This modal split data counts all trips within the Dublin boundary, in addition to those leaving and entering the Dublin boundary. Click on a <a style="font-weight:bold;color:#516dae">statistic</a> for information on how it was calculated. `;
        tit2 = "this data";
      }
    }
  }
  donutData = $RegionID == "999999" ? $sumsGoogle : $RegionID;
  location = $RegionID == "999999" ? "Dublin" : nams[$RegionID["ENG_NAME_VALUE"]];
  walk = $RegionID == "999999" ? f2(100 * $sumsGoogle["ON FOOT_trips"] / $sumsGoogle["TOTAL_trips"]) + "%" : f2(100 * $RegionID["walk_pct"]) + "%";
  cycle = $RegionID == "999999" ? f2(100 * $sumsGoogle["CYCLING_trips"] / $sumsGoogle["TOTAL_trips"]) + "%" : f2(100 * $RegionID["cycle_pct"]) + "%";
  drive = $RegionID == "999999" ? f2(100 * $sumsGoogle["AUTOMOBILE_trips"] / $sumsGoogle["TOTAL_trips"]) + "%" : f2(100 * $RegionID["AUTOMOBILE_trips"] / $RegionID["TOTAL_trips"]) + "%";
  pubs = $RegionID == "999999" ? f2(100 * $sumsGoogle["PUBLIC_trips"] / $sumsGoogle["TOTAL_trips"]) + "%" : f2(100 * $RegionID["PUBLIC_trips"] / $RegionID["TOTAL_trips"]) + "%";
  co2_saved_year = $RegionID == "999999" ? f(0.00141941108770439 * $sumsGoogle["ON FOOT_trips"]) : f(0.00141941108770439 * $RegionID["ON FOOT_trips"]);
  co2_saved_year_bike = $RegionID == "999999" ? f(0.00141941108770439 * $sumsGoogle["CYCLING_trips"]) : f(0.00141941108770439 * $RegionID["CYCLING_trips"]);
  co2_em_year_car = $RegionID == "999999" ? f($sumsGoogle["AUTOMOBILE_gpc_co2e_tons"]) : f($RegionID["AUTOMOBILE_gpc_co2e_tons"]);
  co2_em_year_public = $RegionID == "999999" ? f($sumsGoogle["PUBLIC_gpc_co2e_tons"]) : f($RegionID["PUBLIC_gpc_co2e_tons"]);
  $$unsubscribe_RegionID();
  $$unsubscribe_sumsGoogle();
  return `<div class="container svelte-1p3kfkh"><div class="overall2 svelte-1p3kfkh" style="min-width:300px;"><h2 class="dublin-header svelte-1p3kfkh">${escape("Regional information: 2023")}</h2> <div class="flex-items3 svelte-1p3kfkh"><div class="a1 svelte-1p3kfkh">${location === "Dublin" ? `<div class="text svelte-1p3kfkh"><p class="label svelte-1p3kfkh" data-svelte-h="svelte-vv3ej7">Region</p> <p class="loc svelte-1p3kfkh">${escape(location)}</p> <p class="label svelte-1p3kfkh"></p>  <br> <p class="number svelte-1p3kfkh" style="color:#955196">${escape(cycle + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faBicycle }, {}, {})}</span></p> <p class="number svelte-1p3kfkh" style="color:#374c80">${escape(walk + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faPersonWalking }, {}, {})}</span></p> <p class="number svelte-1p3kfkh" style="color:#e9547a">${escape(drive + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faCarSide }, {}, {})}</span></p> <p class="number svelte-1p3kfkh" style="color:#ff912b">${escape(pubs + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faBus }, {}, {})}</span></p></div>` : `<div class="text svelte-1p3kfkh"><p class="label svelte-1p3kfkh" data-svelte-h="svelte-vv3ej7">Region</p> <p class="loc svelte-1p3kfkh">${escape(location)}</p> <p class="label svelte-1p3kfkh"><!-- HTML_TAG_START -->&#9204;<!-- HTML_TAG_END --></p> <br> <p class="number svelte-1p3kfkh" style="color:#955196">${escape(cycle + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faBicycle }, {}, {})}</span></p> <p class="number svelte-1p3kfkh" style="color:#374c80">${escape(walk + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faPersonWalking }, {}, {})}</span></p> <p class="number svelte-1p3kfkh" style="color:#e9547a">${escape(drive + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faCarSide }, {}, {})}</span></p> <p class="number svelte-1p3kfkh" style="color:#ff912b">${escape(pubs + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faBus }, {}, {})}</span></p></div>`}</div> <div class="a2 svelte-1p3kfkh"><div class="text svelte-1p3kfkh" style="padding-left:0px">${validate_component(Donut, "Donut").$$render($$result, { data: donutData }, {}, {})}</div></div></div></div> <div class="flex-items2 svelte-1p3kfkh"><div class="overall2 svelte-1p3kfkh" style="${"background-color:" + escape("white", true)}"><h2 class="dublin-header svelte-1p3kfkh">${validate_component(Fa, "Fa").$$render($$result, { icon: faSmog }, {}, {})} CO2</h2> <div class="text svelte-1p3kfkh"><p class="label svelte-1p3kfkh" data-svelte-h="svelte-ryza63">Annual CO2 saved (Tonnes)</p> <p class="number-green svelte-1p3kfkh">${escape(co2_saved_year_bike + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faBicycle }, {}, {})}</span></p> <p class="number svelte-1p3kfkh">${escape(co2_saved_year + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faPersonWalking }, {}, {})}</span></p></div></div> <div class="overall2 svelte-1p3kfkh" style="${"background-color:" + escape("white", true)}"><h2 class="dublin-header svelte-1p3kfkh">${validate_component(Fa, "Fa").$$render($$result, { icon: faSmog }, {}, {})} Emissions</h2> <div class="text svelte-1p3kfkh"><p class="label svelte-1p3kfkh" data-svelte-h="svelte-1fztbli">Annual emissions (Tonnes)</p> <p class="number-green svelte-1p3kfkh" style="color:#e9547a">${escape(co2_em_year_car + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faCarSide }, {}, {})}</span></p> <p class="number svelte-1p3kfkh" style="color:#ff912b">${escape(co2_em_year_public + " ")}<span style="font-size:1.2rem">${validate_component(Fa, "Fa").$$render($$result, { icon: faBus }, {}, {})}</span></p></div></div></div> <div class="overall2 svelte-1p3kfkh"><div class="text2 svelte-1p3kfkh"><h2 class="dublin-header svelte-1p3kfkh">${escape("About " + tit2)}</h2> <div class="number2 svelte-1p3kfkh"><!-- HTML_TAG_START -->${txt2}<!-- HTML_TAG_END --></div></div></div> </div>`;
});
const LinePlot = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let yScale;
  let { data } = $$props;
  let { height: height2 = 200 } = $$props;
  let { marginTop = 15 } = $$props;
  let { marginRight = 30 } = $$props;
  let { marginBottom = 30 } = $$props;
  let { marginLeft = 80 } = $$props;
  let { ttype } = $$props;
  let { width: width2 } = $$props;
  let { plot_type } = $$props;
  let formatTime;
  console.log(plot_type);
  let f = d3.format(",.0f");
  let color = "";
  let line;
  let xScale;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.height === void 0 && $$bindings.height && height2 !== void 0)
    $$bindings.height(height2);
  if ($$props.marginTop === void 0 && $$bindings.marginTop && marginTop !== void 0)
    $$bindings.marginTop(marginTop);
  if ($$props.marginRight === void 0 && $$bindings.marginRight && marginRight !== void 0)
    $$bindings.marginRight(marginRight);
  if ($$props.marginBottom === void 0 && $$bindings.marginBottom && marginBottom !== void 0)
    $$bindings.marginBottom(marginBottom);
  if ($$props.marginLeft === void 0 && $$bindings.marginLeft && marginLeft !== void 0)
    $$bindings.marginLeft(marginLeft);
  if ($$props.ttype === void 0 && $$bindings.ttype && ttype !== void 0)
    $$bindings.ttype(ttype);
  if ($$props.width === void 0 && $$bindings.width && width2 !== void 0)
    $$bindings.width(width2);
  if ($$props.plot_type === void 0 && $$bindings.plot_type && plot_type !== void 0)
    $$bindings.plot_type(plot_type);
  {
    {
      if (plot_type == "3 months") {
        formatTime = d3.utcFormat("%b");
      } else {
        formatTime = d3.utcFormat("%b '%y");
      }
    }
  }
  {
    {
      if (ttype == "pedestrian") {
        color = "#374c80";
      } else {
        color = "#955196";
      }
    }
  }
  {
    {
      console.log("width");
      console.log(width2);
    }
  }
  {
    {
      if (plot_type == "By hour (last 30 days)") {
        xScale = d3.scaleLinear([0, 23], [marginLeft, width2 - marginRight]);
      } else {
        xScale = d3.scaleUtc(d3.extent(data, (d) => new Date(d.timestamp)), [marginLeft, width2 - marginRight]);
      }
    }
  }
  yScale = d3.scaleLinear([0, d3.max(data, (d) => d.counts)], [height2 - marginBottom, marginTop]);
  {
    {
      if (plot_type == "By hour (last 30 days)") {
        line = d3.line().x((d) => xScale(d.time)).y((d) => yScale(d.counts));
      } else {
        line = d3.line().x((d) => xScale(new Date(d.timestamp))).y((d) => yScale(d.counts));
      }
    }
  }
  return `${data ? `<div><svg${add_attribute("width", width2, 0)}${add_attribute("height", height2, 0)}><g transform="${"translate(0," + escape(height2 - marginBottom, true) + ")"}"><line stroke="currentColor"${add_attribute("x1", marginLeft - 6, 0)}${add_attribute("x2", width2 - marginRight, 0)}></line>${each(xScale.ticks(5), (tick) => {
    return ` <line stroke="currentColor"${add_attribute("x1", xScale(tick), 0)}${add_attribute("x2", xScale(tick), 0)}${add_attribute("y1", 0, 0)}${add_attribute("y2", 6, 0)}></line>  <text fill="currentColor" text-anchor="middle"${add_attribute("x", xScale(tick), 0)}${add_attribute("y", 22, 0)}>${plot_type != "By hour (last 30 days)" ? `${escape(formatTime(tick))}` : `${escape(tick + ":00")}`}</text>`;
  })}</g><g transform="${"translate(" + escape(marginLeft, true) + ",0)"}">${each(yScale.ticks(4), (tick) => {
    return `${tick !== 0 ? ` <line stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5px"${add_attribute("x1", 0, 0)}${add_attribute("x2", width2 - marginLeft - marginRight, 0)}${add_attribute("y1", yScale(tick), 0)}${add_attribute("y2", yScale(tick), 0)}></line>  <line stroke="currentColor"${add_attribute("x1", 0, 0)}${add_attribute("x2", -6, 0)}${add_attribute("y1", yScale(tick), 0)}${add_attribute("y2", yScale(tick), 0)}></line>` : ``}  <text fill="currentColor" text-anchor="end" dominant-baseline="middle"${add_attribute("x", -9, 0)}${add_attribute("y", yScale(tick), 0)}>${escape(f(tick))}</text>`;
  })}</g><path fill="none"${add_attribute("stroke", color, 0)} stroke-width="2"${add_attribute("d", line(data), 0)}></path></svg></div>` : ``}`;
});
const Dublin_counters_info_redux_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: '.container.svelte-1ih4gwg{height:100svh;min-height:100svh;flex:1}.dublin-header.svelte-1ih4gwg{font-size:1.2rem;font-style:normal;font-weight:500;background-color:#a7c9de;padding:5px 0px 5px 5px;-moz-border-radius:0px;-webkit-border-radius:15px 15px 0px 0px;border-radius:15px 15px 0px 0px;text-indent:10px;color:#324754}.flex-items3.svelte-1ih4gwg{display:flex;gap:5px}.overall2.svelte-1ih4gwg{background:white;width:100%;border-radius:15px;box-shadow:0px 4px 4px 0px rgba(0, 0, 0, 0);padding-bottom:2px;margin-bottom:20px;cursor:pointer}.a1.svelte-1ih4gwg{display:flex;flex:1 1 50%}.a2.svelte-1ih4gwg{display:flex;flex:0 0 50%;align-items:right;justify-content:right;flex-direction:column;padding:0px}.text.svelte-1ih4gwg{flex:0 1 auto;text-transform:uppercase;padding:10px;padding-left:15px;padding-right:15px;margin-bottom:0px}.text2.svelte-1ih4gwg{min-width:100px}.number.svelte-1ih4gwg{font-size:1.5rem;font-style:normal;text-transform:none;font-weight:400;line-height:137.5%;margin-bottom:0;color:#374c80}.number2.svelte-1ih4gwg{font-size:1rem;font-style:300px;font-weight:300;line-height:137.5%;margin-bottom:0;padding:15px}.loc.svelte-1ih4gwg{font-size:1.1rem;font-style:normal;color:#374c80;font-weight:normal;line-height:120%;margin-bottom:5px}.label.svelte-1ih4gwg{font-size:0.9rem;font-style:normal;color:#324754;font-weight:700;line-height:130%;margin-bottom:6px;margin-top:2px}.sel.svelte-1ih4gwg{font-family:"Work Sans";border-radius:5px;border-color:#aaa;border:2px solid #aaaaaa88;background-color:#ffffffdd;font-size:0.9rem;margin-bottom:6px;right:50px;position:absolute}@media screen and (max-width: 450px){.dublin-header.svelte-1ih4gwg{font-size:24px;line-height:137.5%}.number.svelte-1ih4gwg{font-size:24px;line-height:150%}.label.svelte-1ih4gwg{font-size:1px;line-height:150%}}',
  map: null
};
let txt = "This is a live view of pedestrian and cycling counters in Dublin, accessed through the Eco-visio API. Click on a counter for pedestrian and/or cycling footfall over different time periods. Note: there are issues with some counters, which Eco-Visio are investigating.";
let tit = "this data ";
function calculateTot(data) {
  const totalCounts = data.reduce((acc, obj) => acc + obj.counts, 0);
  return totalCounts;
}
const Dublin_counters_info_redux = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $metricToggle, $$unsubscribe_metricToggle;
  let $selected_counter, $$unsubscribe_selected_counter;
  let $counter_name, $$unsubscribe_counter_name;
  $$unsubscribe_metricToggle = subscribe(metricToggle, (value) => $metricToggle = value);
  $$unsubscribe_selected_counter = subscribe(selected_counter, (value) => $selected_counter = value);
  $$unsubscribe_counter_name = subscribe(counter_name, (value) => $counter_name = value);
  let { width: width2 } = $$props;
  let f = format(",.0f");
  async function add(a) {
    console.log("adding");
    const response = await fetch("api/", {
      method: "POST",
      body: JSON.stringify({ a }),
      headers: { "content-type": "application/json" }
    });
    let total = await response.json();
    counter_data.set(total);
    {
      prep_data(total, "sixMonths", 3);
    }
  }
  let totalMap;
  function updateTotals(data) {
    data.forEach((item) => {
      if (totalMap[item.timestamp]) {
        totalMap[item.timestamp].counts += item.counts;
      } else {
        totalMap[item.timestamp] = { ...item };
      }
    });
  }
  let filtData = [];
  let filtData2 = [];
  let b = [];
  let c = [];
  let groups = {};
  let ttype = "";
  let median = "";
  let prev_menu = "";
  let counterMode = "By week (last 3 months)";
  function prep_data(a, timeseries, div) {
    filtData = [];
    filtData2 = [];
    groups = {};
    b = [];
    c = [];
    if (timeseries == "lastMonth") {
      a["lastMonth"].forEach(function(d) {
        if (d.travelMode == "pedestrian" && $metricToggle == "walk_counter") {
          filtData.push(d);
          ttype = d.travelMode;
        }
        if (d.travelMode == "bike" && $metricToggle == "cycle_counter") {
          filtData.push(d);
          ttype = d.travelMode;
        }
        if ($metricToggle == "active_counter") {
          filtData.push(d);
          ttype = d.travelMode;
        }
      });
      if (filtData.length > 0) {
        totalMap = {};
        filtData.forEach(function(dd) {
          updateTotals(dd.data);
        });
        b = Object.values(totalMap);
        b.forEach(function(o) {
          o.date = new Date(o.timestamp);
          let hour = o.date.getHours();
          if (hour in groups) {
            groups[hour] += o.counts;
          } else {
            groups[hour] = o.counts;
          }
        });
        for (let jj = 0; jj < 24; jj++) {
          c.push({ time: jj, counts: groups[jj] });
        }
        median = calculateTot(c) / div;
      }
    } else {
      a[timeseries].forEach(function(d) {
        if (d.travelMode == "pedestrian" && $metricToggle == "walk_counter") {
          filtData2.push(d);
          ttype = d.travelMode;
        }
        if (d.travelMode == "bike" && $metricToggle == "cycle_counter") {
          filtData2.push(d);
          ttype = d.travelMode;
        }
        if ($metricToggle == "active_counter") {
          filtData2.push(d);
          ttype = d.travelMode;
        }
      });
      if (filtData2.length > 0) {
        totalMap = {};
        console.log(filtData2);
        console.log("filtData2");
        filtData2.forEach(function(dd) {
          updateTotals(dd.data);
        });
        c = Object.values(totalMap);
        c = filtData2[0].data;
        c.forEach(function(o) {
          o.counts = o.traffic.counts;
        });
      }
      median = calculateTot(c) / div;
    }
  }
  if ($$props.width === void 0 && $$bindings.width && width2 !== void 0)
    $$bindings.width(width2);
  $$result.css.add(css$5);
  {
    {
      if ($metricToggle != prev_menu) {
        counter_name.set("Grand Canal Cycle Path - Lock C5");
        selected_counter.set("100043587");
        add($selected_counter);
        prev_menu = $metricToggle;
      }
    }
  }
  {
    {
      add($selected_counter);
    }
  }
  $$unsubscribe_metricToggle();
  $$unsubscribe_selected_counter();
  $$unsubscribe_counter_name();
  return `<div class="container svelte-1ih4gwg"><div class="overall2 svelte-1ih4gwg"><h2 class="dublin-header svelte-1ih4gwg">${escape("Eco-Visio counter data")}</h2> <div class="flex-items3 svelte-1ih4gwg"><div class="a1 svelte-1ih4gwg"><div class="text svelte-1ih4gwg"><p class="label svelte-1ih4gwg" data-svelte-h="svelte-1k95t8m">Counter name</p> <p class="loc svelte-1ih4gwg">${escape($counter_name)}</p></div></div> <div class="a1 svelte-1ih4gwg"><div class="text svelte-1ih4gwg"><p class="label svelte-1ih4gwg">${escape("Daily " + (ttype == "pedestrian" ? "Pedestrians" : "Cyclists"))}</p> <p class="number svelte-1ih4gwg" style="${"color:" + escape(ttype != "pedestrian" ? "#955196" : "#374c80", true)}">${escape(f(median / 30))}</p></div></div></div></div> <div class="overall2 svelte-1ih4gwg" style="min-width:100px"><div class="text2 svelte-1ih4gwg"><h2 class="dublin-header svelte-1ih4gwg">${escape("Time Series")}</h2> <div class="text svelte-1ih4gwg"><div class="flex-items3 svelte-1ih4gwg"><div class="a1 svelte-1ih4gwg"><p class="label svelte-1ih4gwg" style="margin-bottom: 0px;">${escape((ttype == "pedestrian" ? "Pedestrian " : "Cyclist ") + "counts")}</p></div> <div class="a2 svelte-1ih4gwg"><select class="sel svelte-1ih4gwg">${each(
    [
      "By hour (last 30 days)",
      "By week (last 3 months)",
      "By week (last year)",
      "By month (last 3 years)"
    ],
    (question) => {
      return `<option${add_attribute("value", question, 0)}>${escape(question)} </option>`;
    }
  )}</select></div></div></div> ${c.length > 0 ? `${validate_component(LinePlot, "LinePlot").$$render(
    $$result,
    {
      data: c,
      width: width2 / 2,
      ttype,
      plot_type: counterMode
    },
    {},
    {}
  )}` : `<div class="text svelte-1ih4gwg"><p class="loc svelte-1ih4gwg">${escape("fetching data...")}</p></div>`}</div></div> <div class="overall2 svelte-1ih4gwg"><div class="text2 svelte-1ih4gwg"><h2 class="dublin-header svelte-1ih4gwg">${escape("About " + tit)}</h2> <div class="number2 svelte-1ih4gwg"><!-- HTML_TAG_START -->${txt}<!-- HTML_TAG_END --></div></div></div> </div>`;
});
const Sidebar_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: ".map-info.svelte-n7gdnq{flex:1 1 50%}",
  map: null
};
const Sidebar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $visMode, $$unsubscribe_visMode;
  $$unsubscribe_visMode = subscribe(visMode, (value) => $visMode = value);
  let { cmode } = $$props;
  let { dmode } = $$props;
  let { width: width2 } = $$props;
  if ($$props.cmode === void 0 && $$bindings.cmode && cmode !== void 0)
    $$bindings.cmode(cmode);
  if ($$props.dmode === void 0 && $$bindings.dmode && dmode !== void 0)
    $$bindings.dmode(dmode);
  if ($$props.width === void 0 && $$bindings.width && width2 !== void 0)
    $$bindings.width(width2);
  $$result.css.add(css$4);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="map-info svelte-n7gdnq">${$visMode == "census" ? `${validate_component(Dublin_info_redux, "Dublin_info_redux").$$render(
      $$result,
      { cmode, dmode },
      {
        cmode: ($$value) => {
          cmode = $$value;
          $$settled = false;
        },
        dmode: ($$value) => {
          dmode = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : `${$visMode == "google" ? `${validate_component(Dublin_district_info_redux, "Dublin_district_info_redux").$$render($$result, {}, {}, {})}` : `${validate_component(Dublin_counters_info_redux, "Dublin_counters_info_redux").$$render($$result, { width: width2 }, {}, {})}`}`} </div>`;
  } while (!$$settled);
  $$unsubscribe_visMode();
  return $$rendered;
});
const mapboxGl = "";
const MapLegend_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".container.svelte-1t60hze{transition:100ms ease-in-out;width:fit-content;posiion:relative;border-radius:20px}.open.svelte-1t60hze{bottom:-30px;height:0px;width:100%;left:2%}.inside.svelte-1t60hze{flex:1 0 auto;padding:7px 14px}.legend-colors.svelte-1t60hze{display:flex;width:100%}.title.svelte-1t60hze{font-size:1.1rem;margin-bottom:6px}.square.svelte-1t60hze{flex:1 0 auto;height:15px;border-color:#696969;border-width:.5px 0px .5px 0px;border-style:solid;opacity:.8}.tick.svelte-1t60hze{width:0px;height:23px;border-left:1px solid #696969}.legend-labels.svelte-1t60hze{position:relative;height:20px;width:100%;font-size:1rem}.label.svelte-1t60hze{position:absolute;transform:translate(-50%, 0);line-height:130%}.label.svelte-1t60hze:first-child{transform:translate(0, 0)}.label.svelte-1t60hze:last-child{text-align:right}.first.svelte-1t60hze{text-align:left}",
  map: null
};
const MapLegend = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $metricFormat, $$unsubscribe_metricFormat;
  let $colorBreaks2, $$unsubscribe_colorBreaks2;
  let $metricLabel, $$unsubscribe_metricLabel;
  let $cols2, $$unsubscribe_cols2;
  $$unsubscribe_metricFormat = subscribe(metricFormat, (value) => $metricFormat = value);
  $$unsubscribe_colorBreaks2 = subscribe(colorBreaks2, (value) => $colorBreaks2 = value);
  $$unsubscribe_metricLabel = subscribe(metricLabel, (value) => $metricLabel = value);
  $$unsubscribe_cols2 = subscribe(cols2, (value) => $cols2 = value);
  let range;
  function formatLabel(d) {
    let lab = $metricFormat.format(d);
    return lab;
  }
  function getXpos(set, i) {
    if (i == 0)
      return 0;
    if (i == set.length - 1)
      return 100;
    return (set[i] - set[0]) / range * 100;
  }
  function getSquareWidth(set, i) {
    return (set[i] - set[i - 1]) / range * 100;
  }
  $$result.css.add(css$3);
  {
    {
      if (get_store_value(visMode) != "temp") {
        range = $colorBreaks2[$colorBreaks2.length - 1] - $colorBreaks2[0];
      } else {
        range = 99;
      }
      console.log("range");
      console.log(range);
    }
  }
  $$unsubscribe_metricFormat();
  $$unsubscribe_colorBreaks2();
  $$unsubscribe_metricLabel();
  $$unsubscribe_cols2();
  return `${range < 99 ? `<div class="container open svelte-1t60hze"><div class="inside svelte-1t60hze"><div class="title svelte-1t60hze" style="text-align: center;">${escape($metricLabel)}</div> <div class="legend-colors svelte-1t60hze">${each($cols2, (color, i) => {
    return `<div class="tick svelte-1t60hze"></div> <div class="square svelte-1t60hze" style="${"background-color: " + escape(color, true) + "; width: " + escape(getSquareWidth($colorBreaks2, i), true) + "%;"}"></div>`;
  })}</div> <div class="legend-labels svelte-1t60hze">${each($colorBreaks2, (label, i) => {
    return `${i % 2 == 0 ? `<div class="label first svelte-1t60hze"${add_styles({ "left": `${getXpos($colorBreaks2, i)}%` })}>${escape(formatLabel(label))}</div>` : ``}`;
  })}</div></div></div>` : ``}`;
});
const MapComponent_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "input[type=checkbox].svelte-10w3r3e{transform:scale(1.2)}.dublin-header.svelte-10w3r3e{font-size:1.2rem;font-style:normal;font-weight:500;text-indent:10px;color:#324754}.sel.svelte-10w3r3e{font-family:'Work Sans';border-radius:5px;border-color:#aaa;border:2px solid #aaaaaa88;background-color:#ffffffdd;font-size:.9rem;margin-bottom:6px}.check.svelte-10w3r3e{font-family:'Work Sans';font-size:.9rem}.im-the-map-box.svelte-10w3r3e{flex:1 1 50% !important;display:flex;position:relative}#mapbox-map.svelte-10w3r3e{height:calc(100svh - 90px);max-height:calc(100svh - 90px);width:100%;flex:0 1 100%;border-radius:15px;box-sizing:border-box;border:5px solid #ffffff;min-height:450px}.mapboxgl-canvas-container{width:100% !important}.legend-box.svelte-10w3r3e{width:96%;bottom:0px}@media screen and (max-width: 768px){#mapbox-map.svelte-10w3r3e{min-height:550px;max-height:625px}.toggle-box.svelte-10w3r3e{bottom:40px !important;width:75% !important}}.top-banner.svelte-10w3r3e{position:absolute;left:0px;top:0px;width:calc(100% - 20px);background-color:#a7c9de;height:16px;padding-left:10px;padding-right:10px;padding-top:5px;padding-bottom:15px;-moz-border-radius:0px;-webkit-border-radius:15px 15px 0px 0px;border-radius:15px 15px 0px 0px;font-size:1rem}.toggles.svelte-10w3r3e{position:absolute;left:20px;top:50px;background-color:#ffffffaa;padding:10px;border-radius:15px;margin:5px;font-size:1rem}.toggle-box.svelte-10w3r3e{position:absolute;width:80%;margin-left:5%;margin-right:5%;height:100px;background:#ffffffbb;bottom:145px;border-radius:15px}",
  map: null
};
const MapComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_mapStore;
  let $metricLabel, $$unsubscribe_metricLabel;
  let $$unsubscribe_modeToggle;
  let $modeToggleOptions, $$unsubscribe_modeToggleOptions;
  let $visMode, $$unsubscribe_visMode;
  let $censusOptions, $$unsubscribe_censusOptions;
  let $dataOptions, $$unsubscribe_dataOptions;
  $$unsubscribe_mapStore = subscribe(mapStore, (value) => value);
  $$unsubscribe_metricLabel = subscribe(metricLabel, (value) => $metricLabel = value);
  $$unsubscribe_modeToggle = subscribe(modeToggle, (value) => value);
  $$unsubscribe_modeToggleOptions = subscribe(modeToggleOptions, (value) => $modeToggleOptions = value);
  $$unsubscribe_visMode = subscribe(visMode, (value) => $visMode = value);
  $$unsubscribe_censusOptions = subscribe(censusOptions, (value) => $censusOptions = value);
  $$unsubscribe_dataOptions = subscribe(dataOptions, (value) => $dataOptions = value);
  let { selected } = $$props;
  let { cmode } = $$props;
  let { dmode } = $$props;
  let val = false;
  let mapEl;
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.cmode === void 0 && $$bindings.cmode && cmode !== void 0)
    $$bindings.cmode(cmode);
  if ($$props.dmode === void 0 && $$bindings.dmode && dmode !== void 0)
    $$bindings.dmode(dmode);
  $$result.css.add(css$2);
  {
    {
      showLanes.set(val);
    }
  }
  $$unsubscribe_mapStore();
  $$unsubscribe_metricLabel();
  $$unsubscribe_modeToggle();
  $$unsubscribe_modeToggleOptions();
  $$unsubscribe_visMode();
  $$unsubscribe_censusOptions();
  $$unsubscribe_dataOptions();
  return `<div class="im-the-map-box svelte-10w3r3e"><div id="mapbox-map" class="svelte-10w3r3e"${add_attribute("this", mapEl, 0)}></div> <div class="top-banner svelte-10w3r3e"><h2 class="dublin-header svelte-10w3r3e">${escape($metricLabel)}</h2></div> <div class="toggles svelte-10w3r3e"><select class="sel svelte-10w3r3e">${each($modeToggleOptions, (question) => {
    return `<option${add_attribute("value", question, 0)}>${escape(question)} </option>`;
  })}</select> ${$visMode == "census" ? `<br> <select class="sel svelte-10w3r3e">${each($censusOptions, (question) => {
    return `<option${add_attribute("value", question, 0)}>${escape(question)} </option>`;
  })}</select> <br> <select class="sel svelte-10w3r3e">${each($dataOptions, (question) => {
    return `<option${add_attribute("value", question, 0)}>${escape(question)} </option>`;
  })}</select>` : ``} <br> <label class="check svelte-10w3r3e">${escape("Show bike lanes ")}</label> <input type="checkbox" class="box svelte-10w3r3e"${add_attribute("checked", val, 1)}></div> ${selected != "temp" ? `<div class="toggle-box svelte-10w3r3e"><div class="legend-box svelte-10w3r3e">${validate_component(MapLegend, "MapLegend").$$render($$result, {}, {}, {})}</div></div>` : ``} </div>`;
});
const Menu_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "nav.svelte-zsfq7n.svelte-zsfq7n.svelte-zsfq7n{grid-area:nav;height:100%;background-color:#324754;color:#a2b7c4;transition:ease-out 500ms;width:60px;overflow:hidden}.expanded.svelte-zsfq7n.svelte-zsfq7n.svelte-zsfq7n{transition:ease-out 500ms;width:200px}ul.svelte-zsfq7n.svelte-zsfq7n.svelte-zsfq7n{list-style:none;padding:20px;margin:0}li.svelte-zsfq7n.svelte-zsfq7n.svelte-zsfq7n{width:200px;cursor:pointer;padding:5px}li.svelte-zsfq7n .svelte-zsfq7n.svelte-zsfq7n:hover{color:white}h3.svelte-zsfq7n.svelte-zsfq7n.svelte-zsfq7n{text-transform:uppercase;padding:5px;font-size:1.4rem}hr.svelte-zsfq7n.svelte-zsfq7n.svelte-zsfq7n{color:#a2b7c4;width:80%}button.svelte-zsfq7n.svelte-zsfq7n.svelte-zsfq7n{border:none;background:none;color:#a2b7c4;font-size:2rem;text-transform:uppercase;text-align:center;text-anchor:middle;width:100%;cursor:pointer}.non-essential.svelte-zsfq7n.svelte-zsfq7n.svelte-zsfq7n{transition:opacity 200ms ease-out, visibility 0ms 200ms;opacity:0;visibility:hidden}.expanded.svelte-zsfq7n .essential li.svelte-zsfq7n>span.svelte-zsfq7n,.expanded.svelte-zsfq7n .non-essential.svelte-zsfq7n.svelte-zsfq7n{transition:opacity 200ms ease-out 100ms;opacity:1;visibility:visible}",
  map: null
};
const Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $visModeOptions, $$unsubscribe_visModeOptions;
  let $visMode, $$unsubscribe_visMode;
  $$unsubscribe_visModeOptions = subscribe(visModeOptions, (value) => $visModeOptions = value);
  $$unsubscribe_visMode = subscribe(visMode, (value) => $visMode = value);
  let expanded = false;
  setTimeout(
    () => {
      expanded = true;
    },
    1e3
  );
  $$result.css.add(css$1);
  $$unsubscribe_visModeOptions();
  $$unsubscribe_visMode();
  return `<nav class="${["svelte-zsfq7n", expanded ? "expanded" : ""].join(" ").trim()}"><button class="svelte-zsfq7n"><!-- HTML_TAG_START -->${expanded ? "&#9204;" : "&#8801"}<!-- HTML_TAG_END --> <span style="padding: none;font-size: 16px;font-weight:100">${escape(expanded ? "" : "DATA")}</span></button> <section class="non-essential svelte-zsfq7n"><ul class="svelte-zsfq7n"><h3 class="svelte-zsfq7n" data-svelte-h="svelte-11492ot">Data source</h3> <hr class="svelte-zsfq7n"> ${each($visModeOptions, (d, i) => {
    return `<li style="${"color:" + escape($visMode == d.value ? "white" : "#A2B7C4", true)}" class="svelte-zsfq7n"><span class="svelte-zsfq7n">${escape(d.label)}</span> </li>`;
  })}</ul></section> </nav>`;
});
const Dashboard_svelte_svelte_type_style_lang = "";
const css = {
  code: 'main.svelte-159qbyu{display:grid;grid-template:"nav content" min-content}.dashboard-title.svelte-159qbyu{font-family:var(--font-family-sans);font-size:var(--font-size-3xl);font-style:normal;color:#324754;font-weight:300;line-height:125%;position:absolute;top:10px;left:20px}.container.svelte-159qbyu{width:100%;height:100%;position:relative;grid-area:content}.map-element.svelte-159qbyu{width:calc(100% - 40px);display:flex;gap:20px;padding-left:20px;padding-right:20px;padding-top:70px;padding-bottom:20px}@media screen and (max-width: 768px){.map-element.svelte-159qbyu{flex-direction:column}.dashboard-title.svelte-159qbyu{font-size:var(--font-size-2xl)}}',
  map: null
};
const Dashboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $mapStore, $$unsubscribe_mapStore;
  let $metricToggleOptions, $$unsubscribe_metricToggleOptions;
  let $metricToggle, $$unsubscribe_metricToggle;
  let $visMode, $$unsubscribe_visMode;
  let $censusMode, $$unsubscribe_censusMode;
  let $dataMode, $$unsubscribe_dataMode;
  $$unsubscribe_mapStore = subscribe(mapStore, (value) => $mapStore = value);
  $$unsubscribe_metricToggleOptions = subscribe(metricToggleOptions, (value) => $metricToggleOptions = value);
  $$unsubscribe_metricToggle = subscribe(metricToggle, (value) => $metricToggle = value);
  $$unsubscribe_visMode = subscribe(visMode, (value) => $visMode = value);
  $$unsubscribe_censusMode = subscribe(censusMode, (value) => $censusMode = value);
  $$unsubscribe_dataMode = subscribe(dataMode, (value) => $dataMode = value);
  let width2 = 0;
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($metricToggle && $mapStore != null && $metricToggleOptions != null) {
        RegionID.set("999999");
        $mapStore.changeActiveLayer($metricToggle, $metricToggleOptions);
        $mapStore.resetMap();
      }
    }
    $$rendered = `<main class="svelte-159qbyu">${validate_component(Menu, "Menu").$$render($$result, {}, {}, {})} <div class="container svelte-159qbyu"><div class="map-element svelte-159qbyu">${validate_component(MapComponent, "MapComponent").$$render(
      $$result,
      {
        selected: $visMode,
        cmode: $censusMode,
        dmode: $dataMode
      },
      {
        cmode: ($$value) => {
          $censusMode = $$value;
          $$settled = false;
        },
        dmode: ($$value) => {
          $dataMode = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Sidebar, "Sidebar").$$render(
      $$result,
      {
        width: width2,
        cmode: $censusMode,
        dmode: $dataMode
      },
      {
        cmode: ($$value) => {
          $censusMode = $$value;
          $$settled = false;
        },
        dmode: ($$value) => {
          $dataMode = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="dashboard-title svelte-159qbyu">${escape("Dublin Active Travel")}</div></div> </main>`;
  } while (!$$settled);
  $$unsubscribe_mapStore();
  $$unsubscribe_metricToggleOptions();
  $$unsubscribe_metricToggle();
  $$unsubscribe_visMode();
  $$unsubscribe_censusMode();
  $$unsubscribe_dataMode();
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Dashboard, "Dashboard").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
