import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// material-ui
import withRoot from "../withRoot";
import { withStyles } from "material-ui/styles";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import Paper from "material-ui/Paper";
import { CircularProgress } from "material-ui/Progress";

// date
import { format, isSameDay } from "date-fns";

// styles
const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 4,
    overflowX: "auto"
  },
  table: {
    // minWidth: 700,
    borderRadius: 4
  },
  isMobile: {
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  tableCell: {
    padding: "0 10px"
  },
  tableHeader: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRight: "1px solid #eee"
  }
});

class GDDTable extends Component {
  render() {
    const { classes } = this.props;
    const { data, isLoading, bioFix } = this.props.rootStore.paramsStore;
    return (
      <Paper className={classes.root}>
        {isLoading ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell
                  className={classes.tableCell}
                  rowSpan={2}
                  style={{
                    textAlign: "center",
                    margin: 0,
                    padding: 0
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    borderLeft: "1px solid #E0E0E0",
                    borderRight: "1px solid #E0E0E0"
                  }}
                  colSpan={4}
                >
                  <div>Degree Days (base 50 ˚F)</div>
                  <div>
                    <small>Accumulated From</small>
                  </div>
                </TableCell>
                <TableCell
                  className={classes.isMobile}
                  style={{ textAlign: "center" }}
                  colSpan={3}
                >
                  Temperature (˚F)
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.tableCell} numeric>
                  Daily
                </TableCell>
                <TableCell className={classes.tableCell} numeric>
                  Jan 1
                </TableCell>
                <TableCell className={classes.tableCell} numeric>
                  Mar 1
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                  style={{
                    borderRight: "1px solid #E0E0E0"
                  }}
                  numeric
                >
                  <div>BioFix</div>
                  <div>
                    {bioFix && (
                      <small style={{ fontSize: "0.5rem" }}>
                        ({format(bioFix, "MMM D")})
                      </small>
                    )}
                  </div>
                </TableCell>
                <TableCell className={classes.isMobile} numeric>
                  Min
                </TableCell>
                <TableCell className={classes.isMobile} numeric>
                  Avg
                </TableCell>
                <TableCell className={classes.isMobile} numeric>
                  Max
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(-8).map(o => {
                const isToday = isSameDay(new Date(), o.date);
                return (
                  <TableRow hover key={o.date}>
                    <TableCell
                      className={classes.tableCell}
                      style={{
                        padding: "0px 10px",
                        textAlign: "center",
                        fontSize: isToday ? "1rem" : null,
                        fontWeight: isToday ? 700 : null
                      }}
                    >
                      {isToday ? "Today" : format(o.date, "MMMM DD")}
                    </TableCell>
                    <TableCell
                      className={classes.tableCell}
                      style={{
                        borderLeft: "1px solid #E0E0E0",
                        fontSize: isToday ? "1rem" : null,
                        fontWeight: isToday ? 700 : null
                      }}
                      numeric
                    >
                      {o.dd}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: isToday ? "1rem" : null,
                        fontWeight: isToday ? 700 : null
                      }}
                      className={classes.tableCell}
                      numeric
                    >
                      {o.cdd}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: isToday ? "1rem" : null,
                        fontWeight: isToday ? 700 : null
                      }}
                      className={classes.tableCell}
                      numeric
                    >
                      {o.cddFromMarch1}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: isToday ? "1rem" : null,
                        fontWeight: isToday ? 700 : null
                      }}
                      className={classes.tableCell}
                      numeric
                    >
                      {o.cddBioFix}
                    </TableCell>
                    <TableCell
                      className={classes.isMobile}
                      style={{
                        borderLeft: "1px solid #E0E0E0",
                        fontSize: isToday ? "1rem" : null,
                        fontWeight: isToday ? 700 : null
                      }}
                      numeric
                    >
                      {o.min}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: isToday ? "1rem" : null,
                        fontWeight: isToday ? 700 : null
                      }}
                      className={classes.isMobile}
                      numeric
                    >
                      {o.avg}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: isToday ? "1rem" : null,
                        fontWeight: isToday ? 700 : null
                      }}
                      className={classes.isMobile}
                      numeric
                    >
                      {o.max}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(GDDTable)))
);
