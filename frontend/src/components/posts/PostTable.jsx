import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { formatDate, truncateText } from "../../utils/helpers";
import styles from "./PostTable.module.css";

const PostTable = ({ posts, onDelete }) => {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>📄</span>
        <h3>No posts found</h3>
        <p>Try adjusting your search or create a new post.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post._id} className={styles.row}>
              <td className={styles.indexCell}>{index + 1}</td>
              <td className={styles.titleCell}>
                <span
                  className={styles.titleLink}
                  onClick={() => navigate(`/posts/${post._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/posts/${post._id}`)}
                >
                  {truncateText(post.title, 55)}
                </span>
              </td>
              <td>{post.author}</td>
              <td>
                <span className={styles.categoryPill}>{post.category}</span>
              </td>
              <td>
                <StatusBadge status={post.status} />
              </td>
              <td className={styles.dateCell}>{formatDate(post.createdAt)}</td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.actionBtn}
                    title="View"
                    onClick={() => navigate(`/posts/${post._id}`)}
                    aria-label="View post"
                  >
                    👁
                  </button>
                  <button
                    className={styles.actionBtn}
                    title="Edit"
                    onClick={() => navigate(`/posts/${post._id}/edit`)}
                    aria-label="Edit post"
                  >
                    ✏️
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    title="Delete"
                    onClick={() => onDelete(post)}
                    aria-label="Delete post"
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostTable;
