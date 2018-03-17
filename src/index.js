import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

// material-ui picker
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import enLocale from "date-fns/locale/en-US";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";

// Mobx
import { Provider } from "mobx-react";
import RootStore from "./stores/RootStore";
const fetcher = url => window.fetch(url).then(response => response.json());
const rootStore = new RootStore(fetcher);

ReactDOM.render(
  <Provider rootStore={rootStore}>
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
      <App />
    </MuiPickersUtilsProvider>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
