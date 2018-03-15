import ParamsStore from "../stores/ParamsStore";

export default class RootStore {
  fetch;
  constructor(fetcher) {
    this.fetch = fetcher;
    this.paramsStore = new ParamsStore();
  }
}
