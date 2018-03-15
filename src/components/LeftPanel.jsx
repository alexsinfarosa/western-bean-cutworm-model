import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";

import { withStyles } from "material-ui/styles";
import withRoot from "../withRoot";

import { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import {
  Select,
  // Button,
  IconButton,
  Typography,
  Icon,
  InputAdornment
} from "material-ui";
import PlaceIcon from "material-ui-icons/Place";

// picker
import { DatePicker } from "material-ui-pickers";

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
  }
});

class LeftPanel extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.closeDrawer();
    console.log(this.props.rootStore.paramsStore.params);
  };

  render() {
    const { classes } = this.props;
    const {
      states,
      postalCode,
      setPostalCode,
      stationID,
      setStationID,
      filteredStationList,
      edate,
      setEDate,
      bioFix,
      setBioFix
      // disableCalculateButton
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

        <form
          className={classes.root}
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          {/* state */}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="statePC">
              State<IconButton
                onClick={this.props.toggleModal}
                aria-label="map"
                color="primary"
                style={{
                  margin: 0,
                  padding: 0,
                  fontSize: 30,
                  marginBottom: 10
                }}
              >
                <PlaceIcon />
              </IconButton>
            </InputLabel>
            <br />
            <Select
              style={{ marginTop: 10 }}
              autoWidth={true}
              value={postalCode}
              onChange={setPostalCode}
              inputProps={{
                name: "statePC",
                id: "statePC"
              }}
            >
              {stateList}
            </Select>
          </FormControl>

          {/* station */}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="station">
              Station ({stationList.length})
            </InputLabel>
            <Select
              autoWidth={true}
              value={stationID}
              onChange={setStationID}
              inputProps={{
                name: "station",
                id: "station"
              }}
            >
              {stationList}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <DatePicker
              label="Date of Interest"
              maxDateMessage="Date must be less than today"
              value={edate}
              onChange={setEDate}
              format="MMMM Do YYYY"
              disableFuture={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Icon>date_range</Icon>
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <DatePicker
              label="BioFix Date"
              // helperText="Possible manual entry via keyboard"
              maxDateMessage="Date must be less than date of interest"
              value={bioFix}
              onChange={setBioFix}
              format="MMMM Do YYYY"
              disableFuture={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Icon>date_range</Icon>
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </FormControl>

          {/*<Button
            variant="raised"
            color="primary"
            className={classes.formControl}
            type="submit"
            disabled={disableCalculateButton}
          >
            Calculate
          </Button>*/}
        </form>
      </Fragment>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(LeftPanel)))
);
