import React from "react";
import { STATUS_COLORS } from "../../utils/constants";
import styles from "./StatusBadge.module.css";

const StatusBadge = ({ status }) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Draft;

  return (
    <span
      className={styles.badge}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
