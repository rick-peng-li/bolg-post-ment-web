import React from "react";
import styles from "./Spinner.module.css";

const Spinner = ({ size = "md", fullPage = false }) => {
  if (fullPage) {
    return (
      <div className={styles.fullPage}>
        <div className={`${styles.spinner} ${styles[size]}`} />
        <p className={styles.loadingText}>Loading…</p>
      </div>
    );
  }

  return <div className={`${styles.spinner} ${styles[size]}`} />;
};

export default Spinner;
