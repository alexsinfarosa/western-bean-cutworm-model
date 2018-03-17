import { average } from "./utils";
import { format, isSameYear } from "date-fns";

export default (cleanedData, asJson) => {
  const arr = [...cleanedData.entries()];

  // slice cleanData up to dateOfInterest
  const dateOfInterest = format(asJson.dateOfInterest, "YYYY-MM-DD");
  const dateOfInterestIdx = arr.findIndex(d => d[0] === dateOfInterest);

  let dates, hrTemps;
  if (isSameYear(new Date(), asJson.dateOfInterest)) {
    // add 5 days for consistency in the GDDTable
    dates = arr.slice(0, dateOfInterestIdx + 6).map(d => d[0]);
    hrTemps = arr.slice(0, dateOfInterestIdx + 6).map(d => d[1]);
  } else {
    dates = arr.map(d => d[0]);
    hrTemps = arr.map(d => d[1]);
  }

  // handle accumulation from March 1st
  const datesArr = dates.map(d => d.split("-"));
  const datesNoYear = datesArr.map(d => d.slice(1).join("-"));
  const march1Idx = datesNoYear.findIndex(date => date === "03-01");

  // handle bioFix
  let bioFixIdx;
  const bioFix = asJson.bioFix ? format(asJson.bioFix, "YYYY-MM-DD") : null;
  if (bioFix) {
    const bioFixArr = bioFix.split("-");
    const bioFixNoYear = bioFixArr.slice(1).join("-");
    bioFixIdx = datesNoYear.findIndex(date => date === bioFixNoYear);
  }

  let results = [];
  const base = 50;
  let cdd = 0;
  let cddFromMarch1 = 0;
  let cddBioFix = 0;
  let missingDays = [];
  hrTemps.forEach((arr, i) => {
    const avg = average(arr);
    let p = {};

    if (!isNaN(avg)) {
      // calculate dd (degree day)
      const dd = avg - base > 0 ? avg - base : 0;

      // accumulation from Jannuary 1st
      cdd += dd;

      // start accumulation from March 1st
      if (i >= march1Idx) {
        cddFromMarch1 += dd;
      }

      // start accumulation from BioFix date
      if (i >= bioFixIdx) {
        cddBioFix += dd;
      }

      p.date = dates[i];
      p.dd = dd;
      p.cdd = cdd;
      p.min = Math.min(...arr);
      p.avg = avg;
      p.max = Math.max(...arr);
      p.cddFromMarch1 = cddFromMarch1;
      p.cddBioFix = asJson.bioFix ? cddBioFix : "-";
    } else {
      missingDays.push(dates[i]);
      p.date = dates[i];
      p.dd = "N/A";
      p.cdd = "N/A";
      p.min = "N/A";
      p.avg = "N/A";
      p.max = "N/A";
      p.cddFromMarch1 = "N/A";
      p.cddBioFix = "N/A";
    }
    results.push(p);
  });

  // console.log({ results, missingDays });
  return { results, missingDays };
};
