import React from "react";
import { Link } from "react-router-dom";
import { formatDate, truncateText } from "../../utils/helpers";
import styles from "./WorkflowColumn.module.css";

const WorkflowColumn = ({ title, posts, tone, emptyText }) => {
  return (
    <section className={styles.column}>
      <div className={`${styles.header} ${styles[tone] || ""}`}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.count}>{posts.length}</span>
      </div>

      <div className={styles.list}>
        {posts.length ? (
          posts.map((post) => (
            <Link key={post._id} to={`/posts/${post._id}`} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.category}>{post.category}</span>
                <span className={styles.date}>{formatDate(post.updatedAt || post.createdAt)}</span>
              </div>
              <strong className={styles.cardTitle}>{post.title}</strong>
              <p className={styles.summary}>
                {truncateText(post.shortDescription || post.content, 120)}
              </p>
              <div className={styles.footer}>
                <span>{post.author}</span>
                <span>{post.tags?.length || 0} 个标签</span>
              </div>
            </Link>
          ))
        ) : (
          <div className={styles.empty}>{emptyText}</div>
        )}
      </div>
    </section>
  );
};

export default WorkflowColumn;
