import React from "react";
import styles from "./PanelCard.module.css";

const PanelCard = ({ title, subtitle, action, children }) => {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
};

export default PanelCard;
