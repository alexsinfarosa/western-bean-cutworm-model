import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "material-ui/styles";
import withRoot from "../withRoot";
import Typography from "material-ui/Typography";
import { Modal, Button } from "material-ui";

import Acknowledgment from "./Acknowledgment";

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
  },
  button: {
    color: "#6C6E70",
    fontSize: "0.7rem",
    letterSpacing: 1
  }
});
class Footer extends Component {
  state = {
    isModal: false
  };

  toggleModal = () => {
    this.setState({ isModal: !this.state.isModal });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Typography variant="caption" className={classes.ciccio}>
          <Button className={classes.button} onClick={this.toggleModal}>
            ACKNOWLEDGMENT
          </Button>
          <Button className={classes.button}>MORE INFO</Button>
          <Button
            className={classes.button}
            href="http://newa.cornell.edu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            NEWA
          </Button>
        </Typography>

        {/* Acknowledgment */}
        <Modal
          aria-labelledby="Acknowledgment"
          aria-describedby="Acknowledgment"
          disableAutoFocus={true}
          open={this.state.isModal}
          onClose={this.toggleModal}
          style={{
            width: "100%",
            height: "50%",
            margin: "100px auto"
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Acknowledgment />
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(Footer)))
);
