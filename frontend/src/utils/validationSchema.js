import * as yup from "yup";

export const postValidationSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters"),

  author: yup
    .string()
    .required("Author name is required")
    .min(2, "Author name must be at least 2 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),

  category: yup
    .string()
    .required("Category is required"),

  status: yup
    .string()
    .required("Status is required"),

  tags: yup
    .string()
    .optional(),

  thumbnailUrl: yup
    .string()
    .url("Must be a valid URL (include https://)")
    .optional()
    .nullable()
    .transform((v) => (v === "" ? null : v)),

  shortDescription: yup
    .string()
    .max(300, "Short description must not exceed 300 characters")
    .optional(),

  content: yup
    .string()
    .required("Post content is required")
    .min(10, "Content must be at least 10 characters"),
});
