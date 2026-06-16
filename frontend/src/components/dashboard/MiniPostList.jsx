import React from "react";
import { Link } from "react-router-dom";
import { formatDate, truncateText } from "../../utils/helpers";
import styles from "./MiniPostList.module.css";

const MiniPostList = ({ posts, emptyText = "暂无内容" }) => {
  if (!posts.length) {
    return <p className={styles.empty}>{emptyText}</p>;
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <Link key={post._id} to={`/posts/${post._id}`} className={styles.item}>
          <div className={styles.metaRow}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.date}>{formatDate(post.updatedAt || post.createdAt)}</span>
          </div>
          <strong className={styles.title}>{post.title}</strong>
          <p className={styles.summary}>
            {truncateText(post.shortDescription || post.content, 96)}
          </p>
          <span className={styles.author}>作者：{post.author}</span>
        </Link>
      ))}
    </div>
  );
};

export default MiniPostList;
