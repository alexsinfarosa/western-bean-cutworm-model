import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "material-ui/styles";
import withRoot from "../withRoot";
import Typography from "material-ui/Typography";

const styles = theme => ({
  ciccio: {
    width: "100%",
    flex: "none",
    marginTop: theme.spacing.unit * 4,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: "7vh",
    borderTop: "1px solid #E7E7E7"
  }
});
class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Typography variant="caption" className={classes.ciccio}>
        <p>ACKNOWLEDGMENT</p>
        <p>MORE INFO</p>
        <p>NEWA</p>
      </Typography>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(Footer)))
);
