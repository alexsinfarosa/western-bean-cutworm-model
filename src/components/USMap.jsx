import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import stationSel from "../assets/stationSel.png";
import planeSel from "../assets/planeSel.png";

// map
import { Map, TileLayer, Marker, Tooltip, GeoJSON } from "react-leaflet";
import L from "leaflet";

// utils
import { matchIconsToStations } from "../utils/utils";

// material-ui
import { withStyles } from "material-ui/styles";
import withRoot from "../withRoot";
import Paper from "material-ui/Paper";
import green from "material-ui/colors/green";

// styles
const styles = theme => ({
  root: {
    width: "100%",
    height: "100%",
    marginTop: theme.spacing.unit * 4
  }
});

class USMap extends Component {
  state = {
    geojson: {}
  };

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.on("zoomend", () => {
      console.log("Current zoom level -> ", leafletMap.getZoom());
    });

    const { postalCode } = this.props.rootStore.paramsStore;
    if (postalCode !== "ALL") {
      const url = `${
        window.location.protocol
      }//data.rcc-acis.org/General/state?state=${postalCode}&meta=name,geojson`;

      fetch(url)
        .then(res => res.json())
        .then(res => {
          const geojson = res.meta[0].geojson;
          this.setState({ geojson });
        });
    }
  }

  handleStateStationFromMap = station => {
    const { setStateStationFromMap } = this.props.rootStore.paramsStore;
    setStateStationFromMap(station);
    this.props.toggleModal();
    this.props.closeDrawer();
  };

  render() {
    const { classes } = this.props;
    const { state, stations, station } = this.props.rootStore.paramsStore;

    const stationsWithMatchedIcons = stations.map(station => {
      station["icon"] = matchIconsToStations(station, state);
      return station;
    });

    // Marker list
    const MarkerList = stationsWithMatchedIcons.map(stn => (
      <Marker
        key={`${stn.id} ${stn.network}`}
        position={[stn.lat, stn.lon]}
        icon={
          station && stn.id === station.id
            ? L.icon({
                iconUrl: stn.network === "icao" ? planeSel : stationSel,
                iconSize: [14, 14]
              })
            : L.icon({
                iconUrl: stn.icon,
                iconSize: [12, 12]
              })
        }
        title={stn.name}
        onClick={() => this.handleStateStationFromMap(stn)}
      >
        <Tooltip>
          <span>
            {stn.name}, {stn.state}
          </span>
        </Tooltip>
      </Marker>
    ));

    return (
      <Paper className={classes.root}>
        <Map
          style={{ width: "100%", height: "100%" }}
          bounds={state.bbox}
          ref={m => (this.leafletMap = m)}
          scrollWheelZoom={false}
        >
          <TileLayer url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
          {MarkerList}
          {this.state.geojson.coordinates && (
            <GeoJSON
              data={this.state.geojson}
              style={{
                color: green[400],
                weight: 1
                // opacity: 0.65
              }}
            />
          )}
        </Map>
      </Paper>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(USMap)))
);
