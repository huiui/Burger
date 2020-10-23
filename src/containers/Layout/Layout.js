import React, { Fragment, useState } from "react";
import styles from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

const Layout = (props) => {
  const [state, setState] = useState({ showSideDrawer: false });

  const sideDrawerClosedHandler = () => {
    setState({ showSideDrawer: false });
  };

  const toggleDrawerHandler = () => {
    setState((prevState)=> ({showSideDrawer: !prevState.showSideDrawer}))
  }

  return (
    <Fragment>
      <Toolbar toggleDrawer={toggleDrawerHandler}/>
      <SideDrawer closed={sideDrawerClosedHandler} open={state.showSideDrawer}/>
      <main className={styles.Content}>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
