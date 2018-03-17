import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";

import { withStyles } from "material-ui/styles";
import withRoot from "../withRoot";

import { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import {
  Select,
  IconButton,
  Button,
  Typography,
  Icon,
  InputAdornment
} from "material-ui";
import PlaceIcon from "material-ui-icons/Place";

// Date picker
import DatePicker from "material-ui-pickers/DatePicker";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%"
  },
  formControl: {
    minWidth: 120,
    width: "80%",
    margin: "32px auto"
  },
  formControlIcon: {
    minWidth: 120,
    width: "80%",
    margin: "0px auto",
    marginTop: 8,
    textAlign: "center"
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  toolbar: theme.mixins.toolbar,
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid #949494"
  },
  link: {
    color: "#a52c25",
    textDecoration: "none"
  },
  iconMap: {
    margin: "0 auto",
    marginTop: theme.spacing.unit * 2
  }
});

class LeftPanel extends Component {
  render() {
    const { classes } = this.props;
    const {
      states,
      postalCode,
      setPostalCode,
      stationID,
      setStationID,
      filteredStationList,
      dateOfInterest,
      setDateOfInterest,
      bioFix,
      setBioFix
    } = this.props.rootStore.paramsStore;

    const stateList = states.map(state => (
      <MenuItem key={state.postalCode} value={state.postalCode}>
        {state.name}
      </MenuItem>
    ));

    let stationList = [];
    if (filteredStationList) {
      stationList = filteredStationList.map(station => (
        <MenuItem key={station.id} value={station.id}>
          {station.name}
        </MenuItem>
      ));
    }

    return (
      <Fragment>
        <div className={`${classes.toolbar} ${classes.center}`}>
          <Typography variant="subheading">
            <a
              href="https://www.cornell.edu/"
              className={classes.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cornell University
            </a>
          </Typography>
        </div>

        <Button
          variant="fab"
          mini
          onClick={this.props.toggleModal}
          aria-label="map"
          color="primary"
          className={classes.iconMap}
        >
          <PlaceIcon />
        </Button>

        <form
          className={classes.root}
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          {/* state */}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="postalCode">State</InputLabel>

            <Select
              // style={{ marginTop: 10 }}
              autoWidth={true}
              value={postalCode}
              onChange={setPostalCode}
              inputProps={{
                name: "postalCode",
                id: "postalCode"
              }}
            >
              {stateList}
            </Select>
          </FormControl>

          {/* station */}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="stationID">
              Station ({stationList.length})
            </InputLabel>
            <Select
              autoWidth={true}
              value={stationID}
              onChange={e => {
                setStationID(e);
                this.props.closeDrawer();
              }}
              inputProps={{
                name: "stationID",
                id: "stationID"
              }}
            >
              {stationList}
            </Select>
          </FormControl>

          {/* date of interest */}
          <div className={classes.formControl}>
            <DatePicker
              style={{ width: "100%" }}
              label="Date of Interest"
              value={dateOfInterest}
              onChange={e => {
                setDateOfInterest(e);
                this.props.closeDrawer();
              }}
              format="MMMM Do, YYYY"
              disableFuture
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton style={{ marginRight: -8 }}>
                      <Icon>date_range</Icon>
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>

          {/* bioFix */}
          <div className={classes.formControl}>
            <DatePicker
              style={{ width: "100%" }}
              label="BioFix Date"
              // helperText="Possible manual entry via keyboard"
              maxDateMessage="Date must be less than date of interest"
              value={bioFix}
              onChange={e => {
                setBioFix(e);
                this.props.closeDrawer();
              }}
              format="MMMM Do, YYYY"
              disableFuture={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton style={{ marginRight: -8 }}>
                      <Icon>date_range</Icon>
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
        </form>
      </Fragment>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(LeftPanel)))
);
