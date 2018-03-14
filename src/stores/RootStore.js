import ParamsStore from "../stores/ParamsStore";
import CurrentModelStore from "../stores/CurrentModelStore";

export default class RootStore {
  fetch;
  constructor(fetcher) {
    this.fetch = fetcher;
    this.paramsStore = new ParamsStore();
    this.currentModelStore = new CurrentModelStore(this);
  }
}
