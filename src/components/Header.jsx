import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import CircularProgressbar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import withRoot from "../withRoot";
import indigo from "material-ui/colors/indigo";

const styles = theme => ({
  root: {
    width: "100%",
    flex: "none",
    display: "flex",
    maxWidth: 1200,
    margin: "0 auto",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 1
  },
  circle: {
    width: 80
  },
  low: {
    stoke: "green"
  },
  hi: {
    color: "red"
  },
  header: {
    fontSize: "1rem",
    color: "black",
    "@media (min-width: 576px)": {
      fontSize: "1.5rem"
    }
  }
});

class Header extends Component {
  colors = perc => {
    return perc === 25.1 ? "low" : "hi";
  };
  render() {
    const { classes } = this.props;
    const { station, doiFlightCompletion } = this.props.rootStore.paramsStore;

    return (
      <div className={classes.root}>
        <Typography variant="display1" className={classes.header}>
          Results for {station.name}, {station.state}
        </Typography>

        <div className={classes.circle}>
          <CircularProgressbar
            initialAnimation={true}
            percentage={doiFlightCompletion}
            textForPercentage={pct =>
              doiFlightCompletion === "N/A" ? "N/A" : `${pct}%`
            }
            styles={{
              path: {
                stroke: indigo[300]
              },
              text: {
                fill: indigo[500],
                fontSize: 26,
                fontWeight: 700
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(Header)))
);
