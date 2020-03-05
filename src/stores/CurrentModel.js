import { decorate, computed } from "mobx";
import { format, getYear, isAfter } from "date-fns/esm";
import { fahrenheitToCelcius } from "../utils/utils";

export default class CurrentModel {
  paramsStore;
  constructor(appStore) {
    this.paramsStore = appStore.paramsStore;
  }

  // data from paramsStore -------------------------------------------------------
  get data() {
    return this.paramsStore.data;
  }

  get dailyData() {
    return this.data[0];
  }

  get hourlyData() {
    return this.data[1];
  }

  get currentYear() {
    return getYear(this.paramsStore.dateOfInterest);
  }

  get bioFix() {
    return format(this.paramsStore.bioFix, "YYYY-MM-DD");
  }

  // current model ---------------------------------------------------------------
  get modelData() {
    const lowerThreshold = 3.3; // Celcius
    const upperThreshold = 29.3; // Celcius
    const base = 50;
    let cdd = 0;
    let cddMarchFirst = 0;
    let cddBioFix = 0;
    let missingDays = [];
    let percentFlight = 0;
    return this.dailyData.map(obj => {
      const { date, temps } = obj;
      const countMissingValues = temps.filter(t => t === "M").length;

      let p = {};

      if (countMissingValues < 5) {
        const tempsFiltered = temps.filter(t => t !== "M");
        const tempsFilteredCelcius = tempsFiltered.map(t =>
          fahrenheitToCelcius(t)
        );
        const min = Math.min(...tempsFilteredCelcius);
        const max = Math.max(...tempsFilteredCelcius);
        let avg = (min + max) / 2;

        if (avg < lowerThreshold) avg = lowerThreshold;
        if (avg > upperThreshold) avg = upperThreshold;
        // calculate degree day
        const dd = avg - base > 0 ? avg - base : 0;
        // const dd = baskervilleEmin(min, max, base);

        // cumulative degree day from Jan 1st
        cdd += dd;

        // Accumulation from March 1st
        if (isAfter(date, `${this.currentYear}-03-01`)) {
          console.log(date, avg, lowerThreshold, upperThreshold);
          // cddMarchFirst += dd;
          cddMarchFirst += avg - lowerThreshold;

          percentFlight =
            100 /
            (1 + Math.exp(-1 * ((Math.log(cddMarchFirst) - 7.315) / 0.044)));
        }

        // Accumulation from biofix date
        if (isAfter(date, this.bioFix)) cddBioFix += dd;

        p["date"] = date;
        p["min"] = min.toFixed(0);
        p["max"] = max.toFixed(0);
        p["avg"] = avg.toFixed(0);
        p["dd"] = dd.toFixed(0);
        p["cdd"] = cdd.toFixed(0);
        p["cddMarchFirst"] = cddMarchFirst.toFixed(1);
        p["percentFlight"] = percentFlight.toFixed(1);
        p["cddBioFix"] = cddBioFix.toFixed(0);
      } else {
        missingDays.push(date);
        p["date"] = date;
        p["min"] = "N/A";
        p["max"] = "N/A";
        p["avg"] = "N/A";
        p["dd"] = "N/A";
        p["cdd"] = "N/A";
        p["cddMarchFirst"] = "N/A";
        p["cddBioFix"] = "N/A";
        p["percentFlight"] = "N/A";
      }
      // console.log(p);
      return { p, missingDays };
    });
  }

  get dataForTable() {
    const dateOfInterest = format(
      this.paramsStore.params.dateOfInterest,
      "YYYY-MM-DD"
    );
    const dates = this.modelData.map(d => d.p.date);
    const dateOfInterestIdx = dates.indexOf(dateOfInterest);

    // this.modelData.map(d => console.log(d));
    return this.modelData
      .slice(dateOfInterestIdx - 2, dateOfInterestIdx + 6)
      .map(d => d.p);
  }

  get missingDays() {
    return this.modelData[0].missingDays;
  }
}

decorate(CurrentModel, {
  data: computed,
  dailyData: computed,
  hourlyData: computed,
  modelData: computed,
  dataForTable: computed,
  missingDays: computed
});
