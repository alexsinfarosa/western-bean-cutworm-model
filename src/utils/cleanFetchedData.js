import { replaceNonConsecutiveMissingValues } from "./utils";
import { isSameYear } from "date-fns";

export default (acisData, edate) => {
  const currentStn = acisData.get("currentStn");

  if (currentStn.length !== 0) {
    const sisterStn = acisData.get("sisterStn");
    let lastFiveDays;

    const results = new Map();
    let tempArr = [];
    currentStn.forEach((el, i) => {
      // replace non consecutive missing values
      tempArr = replaceNonConsecutiveMissingValues(el[1]);

      // replace missing values with sister station
      if (sisterStn.length !== 0) {
        tempArr = tempArr.map((t, j) => (t === "M" ? sisterStn[i][1][j] : t));
      }

      if (isSameYear(new Date(), new Date(edate))) {
        const forecast = acisData.get("forecast");
        if (forecast.length !== 0) {
          lastFiveDays = forecast.slice(-5);

          // replace missing values with forecast
          tempArr = tempArr.map((t, j) => (t === "M" ? forecast[i][1][j] : t));
        }
      }

      results.set(el[0], tempArr);
    });

    if (isSameYear(new Date(), new Date(edate))) {
      lastFiveDays.forEach(dayArr => {
        results.set(dayArr[0], dayArr[1].map(d => d.toString()));
      });
    }

    // console.log(results);
    return results;
  }
};
