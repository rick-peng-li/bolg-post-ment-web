import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { postService } from "../services/postService";
import StatusBadge from "../components/common/StatusBadge";
import ConfirmModal from "../components/common/ConfirmModal";
import Spinner from "../components/common/Spinner";
import { formatDateLong } from "../utils/helpers";
import { CATEGORY_ICONS } from "../utils/constants";
import styles from "./ViewPostPage.module.css";

const ViewPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postService.getById(id);
        setPost(res.data.data);
      } catch (err) {
        toast.error(err.message || "Post not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postService.delete(id);
      toast.success("Post deleted");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Spinner fullPage />;
  if (!post) return null;

  const categoryIcon = CATEGORY_ICONS[post.category] || "📝";

  return (
    <div className="page-content">
      <div className="page-container">
        {/* Back navigation */}
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← All Posts
        </button>

        <article className={styles.article}>
          {/* Hero */}
          <header className={styles.hero}>
            {post.thumbnailUrl && (
              <div className={styles.heroImage}>
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
            <div className={styles.heroContent}>
              <div className={styles.metaTop}>
                <span className={styles.categoryBadge}>
                  {categoryIcon} {post.category}
                </span>
                <StatusBadge status={post.status} />
              </div>
              <h1 className={styles.articleTitle}>{post.title}</h1>
              {post.shortDescription && (
                <p className={styles.articleLead}>{post.shortDescription}</p>
              )}
            </div>
          </header>

          {/* Author card */}
          <div className={styles.authorCard}>
            <div className={styles.authorAvatar}>
              {post.author.charAt(0).toUpperCase()}
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{post.author}</span>
              <span className={styles.authorEmail}>{post.email}</span>
            </div>
            <div className={styles.dateInfo}>
              <span className={styles.dateLabel}>Published</span>
              <span className={styles.dateValue}>{formatDateLong(post.createdAt)}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tagsRow}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className={styles.contentBody}>
            {post.content.split("\n").map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>

          {/* Post metadata footer */}
          <footer className={styles.articleFooter}>
            <div className={styles.footerMeta}>
              <span className={styles.footerLabel}>Last updated</span>
              <span>{formatDateLong(post.updatedAt)}</span>
            </div>
            <div className={styles.footerActions}>
              <button
                className={styles.editBtn}
                onClick={() => navigate(`/posts/${id}/edit`)}
              >
                ✏️ Edit Post
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => setShowDeleteModal(true)}
              >
                🗑 Delete
              </button>
            </div>
          </footer>
        </article>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Post"
        message={`Delete "${post.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleting}
      />
    </div>
  );
};

export default ViewPostPage;
