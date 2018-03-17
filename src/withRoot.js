import React from "react";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import green from "material-ui/colors/green";
import indigo from "material-ui/colors/indigo";
// import Reboot from "material-ui/Reboot";

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: green[300],
      main: green[500],
      dark: green[700]
    },
    secondary: {
      light: indigo[300],
      main: indigo[500],
      dark: indigo[700]
    }
  }
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
        {/*<Reboot />*/}
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
