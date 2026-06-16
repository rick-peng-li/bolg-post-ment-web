import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { postService } from "../services/postService";
import PostTable from "../components/posts/PostTable";
import Pagination from "../components/posts/Pagination";
import ConfirmModal from "../components/common/ConfirmModal";
import Spinner from "../components/common/Spinner";
import { CATEGORIES, STATUSES } from "../utils/constants";
import styles from "./PostListPage.module.css";

const LIMIT = 8;

const PostListPage = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      if (category) params.category = category;
      if (status) params.status = status;

      const res = await postService.getAll(params);
      setPosts(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status]);

  useEffect(() => {
    const timer = setTimeout(fetchPosts, 300);
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, status]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await postService.delete(deleteTarget._id);
      toast.success("Post deleted successfully");
      setDeleteTarget(null);
      fetchPosts();
    } catch (err) {
      toast.error(err.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (status) params.status = status;

      const res = await postService.exportCSV(params);
      const url = URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `blog-posts-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported successfully");
    } catch (err) {
      toast.error(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-container">
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Blog Post Manager</h1>
            <p className={styles.pageSubtitle}>Manage and organize your blog posts</p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.exportBtn}
              onClick={handleExportCSV}
              disabled={exporting}
            >
              {exporting ? <Spinner size="sm" /> : "⬇"}
              <span>{exporting ? "Exporting…" : "Export CSV"}</span>
            </button>
            <button
              className={styles.addBtn}
              onClick={() => navigate("/posts/new")}
            >
              + Add Post
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search by title, author, or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filterSelects}>
            <select
              className={styles.filterSelect}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className={styles.filterSelect}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table / Loading */}
        {loading ? (
          <Spinner fullPage />
        ) : (
          <>
            <PostTable
              posts={posts}
              onDelete={(post) => setDeleteTarget(post)}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={LIMIT}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default PostListPage;
