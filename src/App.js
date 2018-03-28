import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";

import { withStyles } from "material-ui/styles";
import withRoot from "./withRoot";
import {
  Drawer,
  Hidden,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Modal
} from "material-ui";
import MenuIcon from "material-ui-icons/Menu";

// components
import LeftPanel from "./components/LeftPanel";
import Header from "./components/Header";
import GDDTable from "./components/GDDTable";
import USMap from "./components/USMap";
// import Graph from "./components/Graph";
import Footer from "./components/Footer";

const drawerWidth = 250;
const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100vh",
    backgroundColor: "#E7ECF0"
  },
  appBar: {
    position: "absolute",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  content: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#E7ECF0",
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    paddingTop: theme.spacing.unit * 8,
    margin: "0 auto",
    overflowY: "auto"
  },
  link: {
    color: "#fff",
    textDecoration: "none"
  },
  header: {
    fontSize: "1rem",
    color: "white",
    "@media (min-width: 576px)": {
      fontSize: "1.4rem",
      letterSpacing: 1
    }
  }
});

class App extends Component {
  state = {
    isLoading: false,
    mobileOpen: false,
    isModalOpen: false
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  closeDrawer = () => {
    this.setState({ mobileOpen: false });
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    const { classes } = this.props;
    const { data, station } = this.props.rootStore.paramsStore;

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              style={{ color: "white" }}
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" noWrap className={classes.header}>
              Western Bean Cutworm Model
            </Typography>
            <Typography variant="subheading" style={{ marginLeft: "auto" }}>
              <a
                href="http://newa.cornell.edu/"
                className={classes.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                NEWA
              </a>
            </Typography>
          </Toolbar>
        </AppBar>

        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor="left"
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            <LeftPanel
              closeDrawer={this.closeDrawer}
              toggleModal={this.toggleModal}
            />
          </Drawer>
        </Hidden>

        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <LeftPanel
              closeDrawer={this.closeDrawer}
              toggleModal={this.toggleModal}
            />
          </Drawer>
        </Hidden>

        {/* main content */}
        <main className={classes.content}>
          {data.length !== 0 &&
            station && (
              <Fragment>
                <Header />

                <div style={{ flex: 1 }}>
                  <GDDTable />
                </div>
                {/*<Graph />*/}

                <Footer />
              </Fragment>
            )}
        </main>

        {/* US map */}
        <Modal
          aria-labelledby="US map"
          aria-describedby="US map"
          disableAutoFocus={true}
          open={this.state.isModalOpen}
          onClose={this.toggleModal}
          style={{
            width: "100%",
            height: "50%",
            margin: "100px auto"
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <USMap
              params={this.state.params}
              stations={this.state.stations}
              toggleModal={this.toggleModal}
              closeDrawer={this.closeDrawer}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(inject("rootStore")(observer(App))));
