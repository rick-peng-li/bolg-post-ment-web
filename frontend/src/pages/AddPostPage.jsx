import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { postService } from "../services/postService";
import PostForm from "../components/posts/PostForm";
import styles from "./PostFormPage.module.css";

const AddPostPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await postService.create(data);
      toast.success("Post created successfully! 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-container">
        <div className={styles.formHeader}>
          <button className={styles.backBtn} onClick={() => navigate("/")}>
            ← Back to posts
          </button>
          <div className={styles.formTitleBlock}>
            <div className={styles.formIcon}>✏️</div>
            <h1 className={styles.formTitle}>Create New Post</h1>
            <p className={styles.formSubtitle}>Fill in the details to publish your blog post</p>
          </div>
        </div>

        <div className={styles.formCard}>
          <PostForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Publish Post"
          />
        </div>
      </div>
    </div>
  );
};

export default AddPostPage;
