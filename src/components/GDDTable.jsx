import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// material-ui
import withRoot from "../withRoot";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

// date
import { format, isSameDay, differenceInDays } from "date-fns/esm";
// import currentModel from "../utils/currentModel";

// styles
const styles = theme => ({
  root: {
    width: "100%",
    marginBottom: theme.spacing.unit * 4
  },
  table: {
    // minWidth: 700,
  },
  isMobile: {
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  tableCell: {
    fontSize: "0.8rem",
    padding: "0 10px",
    textAlign: "center",
    "@media (min-width: 576px)": {
      fontSize: "0.8rem"
    }
  },
  tableHeader: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRight: "1px solid #eee"
  },
  missingDays: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    marginTop: theme.spacing.unit * 3
  }
});

class GDDTable extends Component {
  timeColor = date => {
    const formattedDate = format(date, "YYYY-MM-DD");
    const formattedToday = format(new Date(), "YYYY-MM-DD");
    if (isSameDay(formattedDate, formattedToday)) return;
    if (differenceInDays(formattedDate, formattedToday) < 0) return "#0FA3B1";
    if (differenceInDays(formattedDate, formattedToday) >= 0) return "#F9E04C";
  };

  render() {
    const { classes } = this.props;
    const { isLoading, dateOfInterest } = this.props.appStore.paramsStore;
    const { dataForTable, missingDays } = this.props.appStore.currentModel;

    return (
      <div className={classes.root}>
        <Typography
          variant="subheading"
          gutterBottom
          style={{ letterSpacing: 1 }}
        >
          PREDICTIONS
        </Typography>
        <Paper>
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
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      margin: 0,
                      padding: 0,
                      borderRight: "1px solid #E0E0E0"
                    }}
                  >
                    <div>DATE</div>
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      borderLeft: "1px solid #E0E0E0",
                      borderRight: "1px solid #E0E0E0"
                    }}
                    // colSpan={4}
                  >
                    Accumulation degree days (˚C)
                  </TableCell>
                  <TableCell
                    className={classes.isMobile}
                    style={{ textAlign: "center" }}
                  >
                    Flight completion (%)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataForTable.map(o => {
                  const isToday = isSameDay(new Date(dateOfInterest), o.date);
                  const formattedDate = format(o.date, "YYYY-MM-DD");
                  const formattedToday = format(new Date(), "YYYY-MM-DD");
                  return (
                    <TableRow hover key={o.date}>
                      <TableCell
                        className={classes.tableCell}
                        style={{
                          margin: 0,
                          padding: 0,
                          width: 8,
                          background: this.timeColor(o.date),
                          borderBottom: "none",
                          borderTop: "none"
                        }}
                      />
                      <TableCell
                        className={classes.tableCell}
                        style={{
                          fontSize: isToday ? "1.1rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                      >
                        {isSameDay(formattedDate, formattedToday)
                          ? "Today"
                          : format(o.date, "MMMM Do")}
                      </TableCell>
                      <TableCell
                        className={classes.tableCell}
                        style={{
                          borderLeft: "1px solid #E0E0E0",
                          fontSize: isToday ? "1.1rem" : null,
                          fontWeight: isToday ? 700 : null,
                          borderRight: "1px solid #E0E0E0"
                        }}
                        numeric
                      >
                        {o.cddMarchFirst}
                      </TableCell>
                      <TableCell
                        className={classes.tableCell}
                        style={{
                          borderLeft: "1px solid #E0E0E0",
                          fontSize: isToday ? "1.1rem" : null,
                          fontWeight: isToday ? 700 : null,
                          borderRight: "1px solid #E0E0E0"
                        }}
                        numeric
                      >
                        {o.percentFlight}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Paper>
        {/* Missing Days */}
        {missingDays.length !== 0 && !isLoading && (
          <Typography variant="caption" className={classes.missingDays}>
            <span style={{ color: "black" }}>{`(+${missingDays.length}) ${
              missingDays.length === 1 ? "day" : "days"
            } missing:
                  `}</span>

            {missingDays.map((d, i) => {
              if (i === missingDays.length - 1) {
                return <span key={d}>{format(d, "MMMM Do")}.</span>;
              } else {
                return <span key={d}>{format(d, "MMMM Do")}, </span>;
              }
            })}
          </Typography>
        )}
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(GDDTable)))
);
