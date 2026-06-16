import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <div className={styles.container}>
        <span className={styles.number}>404</span>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.message}>The page you're looking for doesn't exist.</p>
        <button className={styles.homeBtn} onClick={() => navigate("/")}>
          ← Back to home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
