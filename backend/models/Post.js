const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title must not exceed 150 characters"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      minlength: [2, "Author name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Author email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Technology", "Design", "Business", "Lifestyle", "Health", "Travel", "Food", "Other"],
        message: "Category must be one of: Technology, Design, Business, Lifestyle, Health, Travel, Food, Other",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["Draft", "Published", "Archived"],
        message: "Status must be Draft, Published, or Archived",
      },
      default: "Draft",
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: "",
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description must not exceed 300 characters"],
      default: "",
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      minlength: [10, "Content must be at least 10 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
postSchema.index({ title: "text", author: "text", category: "text" });

module.exports = mongoose.model("Post", postSchema);
