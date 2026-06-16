import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postValidationSchema } from "../../utils/validationSchema";
import { CATEGORIES, STATUSES } from "../../utils/constants";
import Spinner from "../common/Spinner";
import styles from "./PostForm.module.css";

const PostForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Publish Post",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(postValidationSchema),
    defaultValues: {
      title: "",
      author: "",
      email: "",
      category: "",
      status: "Draft",
      tags: Array.isArray(defaultValues?.tags)
        ? defaultValues.tags.join(", ")
        : defaultValues?.tags || "",
      thumbnailUrl: "",
      shortDescription: "",
      content: "",
      ...defaultValues,
    },
  });

  const handleFormSubmit = (data) => {
    const processed = {
      ...data,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
    onSubmit(processed);
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
    >
      {/* Basic Information */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Basic Information</legend>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="title"
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
              placeholder="Enter post title"
              {...register("title")}
            />
            {errors.title && (
              <p className={styles.errorMsg}>{errors.title.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="author">
              Author Name <span className={styles.required}>*</span>
            </label>
            <input
              id="author"
              className={`${styles.input} ${errors.author ? styles.inputError : ""}`}
              placeholder="Enter author name"
              {...register("author")}
            />
            {errors.author && (
              <p className={styles.errorMsg}>{errors.author.message}</p>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email Address <span className={styles.required}>*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            placeholder="author@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className={styles.errorMsg}>{errors.email.message}</p>
          )}
        </div>
      </fieldset>

      {/* Classification */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Classification</legend>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="category">
              Category <span className={styles.required}>*</span>
            </label>
            <select
              id="category"
              className={`${styles.select} ${errors.category ? styles.inputError : ""}`}
              {...register("category")}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className={styles.errorMsg}>{errors.category.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="status">
              Status <span className={styles.required}>*</span>
            </label>
            <select
              id="status"
              className={`${styles.select} ${errors.status ? styles.inputError : ""}`}
              {...register("status")}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className={styles.errorMsg}>{errors.status.message}</p>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            className={styles.input}
            placeholder="Comma-separated tags (e.g. react, javascript)"
            {...register("tags")}
          />
          <p className={styles.hint}>Separate tags with commas</p>
        </div>
      </fieldset>

      {/* Media */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Media</legend>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="thumbnailUrl">
            Thumbnail URL
          </label>
          <input
            id="thumbnailUrl"
            className={`${styles.input} ${errors.thumbnailUrl ? styles.inputError : ""}`}
            placeholder="https://example.com/image.jpg"
            {...register("thumbnailUrl")}
          />
          {errors.thumbnailUrl && (
            <p className={styles.errorMsg}>{errors.thumbnailUrl.message}</p>
          )}
        </div>
      </fieldset>

      {/* Content */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Content</legend>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="shortDescription">
            Short Description
          </label>
          <textarea
            id="shortDescription"
            rows={3}
            className={styles.textarea}
            placeholder="Brief summary of the post (max 300 characters)"
            {...register("shortDescription")}
          />
          {errors.shortDescription && (
            <p className={styles.errorMsg}>{errors.shortDescription.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="content">
            Post Content <span className={styles.required}>*</span>
          </label>
          <textarea
            id="content"
            rows={8}
            className={`${styles.textarea} ${errors.content ? styles.inputError : ""}`}
            placeholder="Write your full blog post content here…"
            {...register("content")}
          />
          {errors.content && (
            <p className={styles.errorMsg}>{errors.content.message}</p>
          )}
        </div>
      </fieldset>

      {/* Form Actions */}
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />
              <span>Saving…</span>
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
