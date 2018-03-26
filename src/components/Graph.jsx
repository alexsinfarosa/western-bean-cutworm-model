import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "material-ui/styles";
import withRoot from "../withRoot";
import Paper from "material-ui/Paper";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryZoomContainer,
  VictoryTheme,
  VictoryTooltip,
} from "victory";
import { format } from "date-fns";

const styles = theme => ({
  root: {
    flex: 1,
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    marginTop: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 8,
    borderRadius: 8,
    height: "35vh"
  }
});

const w = window.innerWidth;
const h = window.innerHeight;

class Graph extends Component {
  render() {
    const { classes } = this.props;
    const { data } = this.props.rootStore.paramsStore;

    return (
      <Paper className={classes.root}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={w}
          height={w > 576 ? h * 0.4 : h * 0.55}
          containerComponent={<VictoryZoomContainer />}
          // containerComponent={
          //   <VictoryVoronoiContainer labels={d => `${d.x}, ${d.y}`} />
          // }
          padding={{ top: 20, right: 20, left: 50, bottom: 50 }}
        >
          <VictoryAxis
            scale={{ x: "time" }}
            tickCount={w > 576 ? 16 : 8}
            tickFormat={t => format(t, "MMM DD")}
            style={{
              axis: { stroke: "#e0e0e0", strokeWidth: 1 },
              tickLabels: {
                fontSize: w > 576 ? 12 : 10,
                angle: -45,
                padding: 7,
                verticalAnchor: "middle",
                textAnchor: "end"
              },
              grid: { stroke: "none", strokeWidth: 0.25 },
              ticks: { stroke: "#e0e0e0", size: 5, strokeWeight: 700 }
            }}
          />

          <VictoryAxis
            dependentAxis
            style={{
              axis: {
                stroke: "#e0e0e0",
                strokeWidth: 1
              },
              tickLabels: {
                fontSize: w > 576 ? 12 : 10
              },
              grid: { stroke: "none", strokeWidth: 0.25 },
              ticks: { stroke: "#e0e0e0", size: 5 }
            }}
          />

          <VictoryLine
            labelComponent={<VictoryTooltip />}
            style={{
              data: { stroke: "#67ac5b", strokeWidth: 1 }
            }}
            data={data.slice()}
            x="date"
            y="cdd"
          />
        </VictoryChart>
      </Paper>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(Graph)))
);
