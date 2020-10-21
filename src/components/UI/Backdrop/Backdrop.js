import React from "react";
import styles from "./Backdrop.module.css";

const backDrop = (props) => {
  return (
    props.show && (
      <div
        className={styles.Backdrop}
        onClick={props.handleClick}
      ></div>
    )
  );
};

export default backDrop;
