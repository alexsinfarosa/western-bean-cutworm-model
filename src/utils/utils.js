import plane from "../assets/plane.png";
import planeGrey from "../assets/planeGrey.png";
import iconStation from "../assets/station.png";
import stationGrey from "../assets/stationGrey.png";

// MAP ---------------------------------------------------------
export const matchIconsToStations = (station, state) => {
  const protocol = window.location.protocol;
  const { network } = station;
  const { postalCode } = state;

  const newa = iconStation;
  const newaGray = stationGrey;
  const airport = plane;
  const airportGray = planeGrey;
  const culog = `${protocol}//newa2.nrcc.cornell.edu/gifs/culog.png`;
  const culogGray = `${protocol}//newa2.nrcc.cornell.edu/gifs/culogGray.png`;

  if (
    network === "newa" ||
    network === "njwx" ||
    network === "miwx" ||
    network === "oardc" ||
    network === "nysm" ||
    ((network === "cu_log" || network === "culog") && station.state !== "NY")
  ) {
    return station.state === postalCode || postalCode === "ALL"
      ? newa
      : newaGray;
  }

  if (network === "cu_log" || network === "culog") {
    return station.state === postalCode || postalCode === "ALL"
      ? culog
      : culogGray;
  }

  if (network === "icao") {
    return station.state === postalCode || postalCode === "ALL"
      ? airport
      : airportGray;
  }
};

export const vXDef = {
  newa: {
    pcpn: 5,
    temp: 23,
    rhum: 24,
    lwet: 118,
    wspd: 128,
    wdir: 130,
    srad: 132,
    st4i: 120,
    sm4i: 65
  },
  icao: { pcpn: 5, temp: 23, rhum: 24, wspd: 28, wdir: 27, dwpt: 22 },
  cu_log: {
    pcpn: 5,
    temp: 126,
    rhum: 24,
    lwet: 118,
    wspd: 128,
    wdir: 130,
    srad: 132
  },
  culog: {
    pcpn: 5,
    temp: 126,
    rhum: 24,
    lwet: 118,
    wspd: 128,
    wdir: 130,
    srad: 132
  },
  njwx: { pcpn: 5, temp: 23, rhum: 24, wspd: 28, wdir: 27, srad: 149 },
  miwx: { pcpn: 5, temp: 126, rhum: 143, lwet: 118, srad: 132 },
  oardc: {
    pcpn: 5,
    temp: 23,
    rhum: 24,
    lwet: 118,
    wspd: 28,
    wdir: 27,
    srad: 132,
    st4i: 120
  },
  nysm: {
    pcpn: 5,
    temp: 23,
    rhum: 24,
    wspd: 28,
    wdir: 27,
    srad: 132,
    st4i: 120,
    sm2i: 104
  }
};

// Handling Michigan state ID adjustment
export const idAdjustment = station => {
  // Michigan
  if (
    station.state === "MI" &&
    station.network === "miwx" &&
    station.id.slice(0, 3) === "ew_"
  ) {
    // example: ew_ITH
    return station.id.slice(3, 6);
  }
  // NY mesonet
  if (
    station.state === "NY" &&
    station.network === "nysm" &&
    station.id.slice(0, 5) === "nysm_"
  ) {
    // example: nysm_spra
    return station.id.slice(5, 9);
  }

  return station.id;
};

// Returns the average of two numbers.
export const avgTwoStringNumbers = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return ((aNum + bNum) / 2).toFixed(1);
};

// export const replaceNonConsecutiveMissingValues = arr => {
//   // console.log(arr);
//   return arr.map((t, i) => {
//     if (i === 0 && t === "M") {
//       return arr[i + 1];
//     } else if (i === arr.length - 1 && t === "M") {
//       return arr[i - 1];
//     } else if (t === "M" && arr[i - 1] !== "M" && arr[i + 1] !== "M") {
//       return avgTwoStringNumbers(arr[i - 1], arr[i + 1]);
//     } else {
//       return t;
//     }
//   });
// };

const weightedMean = res => {
  // arr = [2,M,M,5]
  const arr = res.map(d => Number(d));
  const firstM = ((arr[0] + arr[0] + arr[3]) / 3).toPrecision(2);
  const secondM = ((arr[0] + arr[3] + arr[3]) / 3).toPrecision(2);
  return [firstM, secondM];
};

export const averageMissingValues = d => {
  // console.log(d);
  if (d.includes("M")) {
    if (d[0] === "M" && d[1] !== "M") d[0] = d[1];
    if (d[0] === "M" && d[1] === "M" && d[2] !== "M") {
      d[0] = d[2];
      d[1] = d[2];
    }

    const len = d.length - 1;
    if (d[len] === "M" && d[len - 1] !== "M") d[len] = d[len - 1];
    if (d[len] === "M" && d[len - 1] === "M" && d[len - 2] !== "M") {
      d[len] = d[len - 2];
      d[len - 1] = d[len - 2];
    }

    return d.map((t, i) => {
      if (d[i - 1] !== "M" && t === "M" && d[i + 1] !== "M") {
        return avgTwoStringNumbers(d[i - 1], d[i + 1]);
      }

      if (
        d[i - 1] !== "M" &&
        t === "M" &&
        d[i + 1] === "M" &&
        d[i + 2] !== "M"
      ) {
        const arr = [d[i - 1], d[i], d[i + 1], d[i + 2]];
        const rep = weightedMean(arr);
        t = rep[0];
        d[i + 1] = rep[1];
      }

      return t;
    });
  }
  return d;
};

export const flatten = arr => Array.prototype.concat(...arr);

export const unflatten = array => {
  let res = [];
  while (array.length > 0) res.push(array.splice(0, 24));
  return res;
};

// Returns average of all the values in array
export const average = data => {
  // handling the case for T and W
  if (data.length === 0) return 0;

  //  calculating average
  let results = data.map(e => parseFloat(e));
  return Math.round(results.reduce((acc, val) => acc + val, 0) / data.length);
};

// Convert Fahrenheit to Celcius
export const fahrenheitToCelcius = t => {
  return ((t - 32) * 5 / 9).toFixed(1);
};

// convert time in local standard time to local time (based on time zone and dst)
// function formatTime(day, hour, tzo) {
//   var time_zone_name = {
//     5: "America/New_York",
//     6: "America/Chicago",
//     7: "America/Denver",
//     8: "America/Los_Angeles"
//   };
//   return moment
//     .utc(day)
//     .hour(hour)
//     .add(Math.abs(tzo), "hours")
//     .tz(time_zone_name[Math.abs(tzo)])
//     .format("MM/DD/YYYY HH:00 z");
// }

// convert from ACIS results object to new object keyed on date/time (i.e. one record per hour)
// function serializeObject(results, input_params) {
//   var hlydate,
//     dt_key,
//     hrly_data = {},
//     data = results.data,
//     tzo = -results.meta.tzo,
//     elems =
//       typeof input_params === "string"
//         ? [input_params]
//         : input_params.elems.map(function(elem) {
//             return elem.vX;
//           });
//   if (data && data.length > 0) {
//     data.forEach(function(dlyrec) {
//       hlydate = dlyrec[0];
//       for (var h = 1; h <= 24; h += 1) {
//         dt_key = [hlydate, h].join("-");
//         hrly_data[dt_key] = {};
//         hrly_data[dt_key].date = formatTime(hlydate, h, tzo);
//         dlyrec.slice(1).forEach(function(elval, ie) {
//           hrly_data[dt_key][elems[ie]] = elval[h - 1];
//         });
//       }
//     });
//   }
//   return hrly_data;
// }
