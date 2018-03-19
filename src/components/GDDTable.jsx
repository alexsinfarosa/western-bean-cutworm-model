import React, { Component, Fragment } from "react";
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
import Typography from "material-ui/Typography";

// date
import { format, isSameDay } from "date-fns";

// styles
const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    marginTop: theme.spacing.unit * 1,
    overflowX: "auto",
    borderRadius: 8
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
    padding: "0 10px",
    textAlign: "center"
  },
  tableHeader: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRight: "1px solid #eee"
  },
  missingDays: {
    marginTop: theme.spacing.unit * 1
  }
});

class GDDTable extends Component {
  render() {
    const { classes } = this.props;
    const {
      dataForTable,
      isLoading,
      dateOfInterest,
      missingDays
    } = this.props.rootStore.paramsStore;

    return (
      <Fragment>
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
                  <TableCell className={classes.tableCell}>Date</TableCell>
                  <TableCell className={classes.tableCell}>
                    Accumulation degree days
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    Flight completion
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataForTable.map(o => {
                  const isToday = isSameDay(new Date(dateOfInterest), o.date);
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
                        {format(o.date, "MMMM Do")}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: isToday ? "1rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                        className={classes.tableCell}
                      >
                        {o.cddFromMarch1}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: isToday ? "1rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                        className={classes.tableCell}
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
        {missingDays.length !== 0 && (
          <Typography variant="caption" className={classes.missingDays}>
            {`(+${missingDays.length}) ${
              missingDays.length === 1 ? "day" : "days"
            } missing: 
                  `}
            {missingDays.map((d, i) => {
              if (i === missingDays.length - 1) {
                return <span key={d}>{format(d, "MMMM Do")}.</span>;
              } else {
                return <span key={d}>{format(d, "MMMM Do")}, </span>;
              }
            })}
          </Typography>
        )}
      </Fragment>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(GDDTable)))
);
