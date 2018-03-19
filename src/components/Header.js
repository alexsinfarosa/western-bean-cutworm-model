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
    marginTop: theme.spacing.unit * 4,
    height: 80,
    color: "#6A6C6E",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"
  },
  circle: {
    width: 80
  },
  low: {
    stoke: "green"
  },
  hi: {
    color: "red"
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
        <Typography variant="headline">
          Western Bean Cutworm results for {station.name}, {station.state}
        </Typography>
        <div className={classes.circle}>
          <CircularProgressbar
            initialAnimation={true}
            percentage={doiFlightCompletion}
            styles={{
              path: {
                stroke: indigo[300]
              },
              text: {
                fill: indigo[500]
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
