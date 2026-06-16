import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { postService } from "../services/postService";
import PostForm from "../components/posts/PostForm";
import Spinner from "../components/common/Spinner";
import styles from "./PostFormPage.module.css";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await postService.update(id, data);
      toast.success("Post updated successfully!");
      navigate(`/posts/${id}`);
    } catch (err) {
      toast.error(err.message || "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Spinner fullPage />;

  return (
    <div className="page-content">
      <div className="page-container">
        <div className={styles.formHeader}>
          <button className={styles.backBtn} onClick={() => navigate(`/posts/${id}`)}>
            ← Back to post
          </button>
          <div className={styles.formTitleBlock}>
            <div className={styles.formIcon}>🖊️</div>
            <h1 className={styles.formTitle}>Edit Post</h1>
            <p className={styles.formSubtitle}>Update the details of your blog post</p>
          </div>
        </div>

        <div className={styles.formCard}>
          <PostForm
            defaultValues={post}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
