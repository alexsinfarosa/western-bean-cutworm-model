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

  let results = [];
  const lowerThreshold = 3.3; // Celcius
  const upperThreshold = 29.3; // Celcius

  let cdd = 0; // from January 1st
  let cddFromMarch1 = 0;
  let percentFlight = 0;

  let missingDays = [];
  hrTemps.forEach((arr, i) => {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    let mean = (min + max) / 2;

    if (mean < lowerThreshold) mean = lowerThreshold;
    if (mean > upperThreshold) mean = upperThreshold;

    let p = {};

    if (!isNaN(mean)) {
      // accumulation from Jannuary 1st
      cdd += mean - lowerThreshold;

      // start accumulation from March 1st

      if (i >= march1Idx) {
        cddFromMarch1 += mean - lowerThreshold;
        percentFlight =
          100 /
          (1 + Math.exp(-1 * ((Math.log(cddFromMarch1) - 7.315) / 0.044)));
      }

      p.date = dates[i];
      p.cdd = Number(cdd.toFixed(1));
      p.cddFromMarch1 = Number(cddFromMarch1.toFixed(1));
      p.percentFlight = Number(parseFloat(percentFlight).toFixed(1));
    } else {
      missingDays.push(dates[i]);
      p.date = dates[i];
      p.cdd = "N/A";
      p.cddFromMarch1 = "N/A";
      p.percentFlight = "N/A";
    }
    results.push(p);
  });

  // console.log({ results, missingDays });
  return { results, missingDays };
};
