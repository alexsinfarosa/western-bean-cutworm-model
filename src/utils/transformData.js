import { average } from "./utils";

export default (cleanedData, bioFix) => {
  // console.log(cleanedData, bioFix);
  const dates = [...cleanedData.keys()];
  const hrTemps = [...cleanedData.values()];

  // handle accumulation from March 1st
  const datesArr = dates.map(d => d.split("-"));
  const datesNoYear = datesArr.map(d => d.slice(1).join("-"));
  const march1Idx = datesNoYear.findIndex(date => date === "03-01");

  // handle bioFix
  let bioFixIdx;
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
  hrTemps.forEach((arr, i) => {
    let p = {};

    const avg = average(arr);

    // calculate dd (degree day)
    const dd = avg - base > 0 ? avg - base : 0;
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
    p.cddBioFix = bioFix ? cddBioFix : "-";

    results.push(p);
  });

  // console.log(results);
  return results;
};
