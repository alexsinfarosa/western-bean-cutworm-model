import { decorate, observable, computed, action, reaction, when } from "mobx";
import axios from "axios";

// fetch
import fetchData, { fetchAllStations } from "../utils/fetchData";
import cleanFetchedData from "../utils/cleanFetchedData";
import transformData from "../utils/transformData";

export default class CurrentModelStore {
  rootStore;
  constructor(rootStore) {
    this.rootStore = rootStore;
    when(
      () => !this.rootStore.paramsStore.isLoading,
      () => {
        reaction(
          () => this.rootStore.paramsStore.params,
          params => console.log(params)
        );
      }
    );
    this.loadData();
  }

  loadData = async () => {
    const paramsStoreRef = await this.rootStore.paramsStore;
    const params = await paramsStoreRef.params;
    console.log(params);
    // const acicData = await fetchData(params);
    // console.log(acicData);
  };

  isLoading = false;
}

decorate(CurrentModelStore, {
  isLoading: observable
});
