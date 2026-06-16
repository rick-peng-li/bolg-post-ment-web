import React from "react";
import styles from "./MetricCard.module.css";

const MetricCard = ({ label, value, hint, tone = "default" }) => {
  return (
    <article className={`${styles.card} ${styles[tone] || ""}`}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value}>{value}</strong>
      <span className={styles.hint}>{hint}</span>
    </article>
  );
};

export default MetricCard;
