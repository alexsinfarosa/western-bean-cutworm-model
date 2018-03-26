import { isSameYear } from "date-fns";
import {
  fahrenheitToCelcius,
  averageMissingValues,
} from "../utils/utils";

export default (acisData, asJson) => {
  const currentStn = acisData.get("currentStn");

  if (currentStn.length !== 0) {
    const sisterStn = acisData.get("sisterStn");
    let lastFiveDays;

    const results = new Map();
    let tempArr = [];
    currentStn.forEach((el, i) => {
      // replace non consecutive missing values
      // tempArr = replaceNonConsecutiveMissingValues(el[1]);
      tempArr = averageMissingValues(el[1]);
      // console.log(el[0],tempArr);

      // replace missing values with sister station
      if (sisterStn.length !== 0) {
        tempArr = tempArr.map((t, j) => (t === "M" ? sisterStn[i][1][j] : t));
      }

      if (isSameYear(new Date(), new Date(asJson.dateOfInterest))) {
        const forecast = acisData.get("forecast");
        if (forecast.length !== 0) {
          lastFiveDays = forecast.slice(-5);

          // replace missing values with forecast
          // forecast data is returned always in ˚F. This model uses ˚C
          tempArr = tempArr.map(
            (t, j) => (t === "M" ? fahrenheitToCelcius(forecast[i][1][j]) : t)
          );
        }
      }

      results.set(el[0], tempArr);
    });

    if (isSameYear(new Date(), new Date(asJson.dateOfInterest))) {
      lastFiveDays.forEach(dayArr => {
        results.set(dayArr[0], dayArr[1].map(d => fahrenheitToCelcius(d)));
      });
    }

    // console.log(results);
    return results;
  }
};