const STATUS_ORDER = ["Draft", "Published", "Archived"];

const sortByDateDesc = (posts, field = "updatedAt") => {
  return [...posts].sort((a, b) => new Date(b[field] || 0) - new Date(a[field] || 0));
};

export const getStatusCounts = (posts) => {
  return STATUS_ORDER.reduce(
    (acc, status) => ({
      ...acc,
      [status]: posts.filter((post) => post.status === status).length,
    }),
    { Draft: 0, Published: 0, Archived: 0 }
  );
};

export const getDashboardMetrics = (posts) => {
  const statusCounts = getStatusCounts(posts);
  const categories = new Set(posts.map((post) => post.category).filter(Boolean));
  const authors = new Set(posts.map((post) => post.author).filter(Boolean));
  const withCover = posts.filter((post) => post.thumbnailUrl).length;
  const totalTags = posts.reduce((sum, post) => sum + (post.tags?.length || 0), 0);
  const coverRate = posts.length ? Math.round((withCover / posts.length) * 100) : 0;
  const avgTags = posts.length ? (totalTags / posts.length).toFixed(1) : "0.0";

  return [
    {
      label: "文章总数",
      value: posts.length,
      hint: `${authors.size} 位作者参与内容生产`,
      tone: "default",
    },
    {
      label: "已发布",
      value: statusCounts.Published,
      hint: `发布率 ${posts.length ? Math.round((statusCounts.Published / posts.length) * 100) : 0}%`,
      tone: "success",
    },
    {
      label: "待完善草稿",
      value: statusCounts.Draft,
      hint: `${statusCounts.Archived} 篇归档内容可复用`,
      tone: "warning",
    },
    {
      label: "分类覆盖",
      value: categories.size,
      hint: `封面覆盖率 ${coverRate}% · 平均标签 ${avgTags}`,
      tone: "accent",
    },
  ];
};

export const getCategoryBreakdown = (posts) => {
  const total = posts.length || 1;
  const categoryMap = posts.reduce((acc, post) => {
    const key = post.category || "未分类";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(categoryMap)
    .map(([name, count]) => ({
      name,
      count,
      share: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
};

export const getAuthorLeaderboard = (posts) => {
  const authorMap = posts.reduce((acc, post) => {
    const key = post.author || "匿名作者";
    if (!acc[key]) {
      acc[key] = { name: key, total: 0, published: 0, draft: 0 };
    }
    acc[key].total += 1;
    if (post.status === "Published") acc[key].published += 1;
    if (post.status === "Draft") acc[key].draft += 1;
    return acc;
  }, {});

  return Object.values(authorMap).sort((a, b) => {
    if (b.published !== a.published) return b.published - a.published;
    return b.total - a.total;
  });
};

export const getRecentPosts = (posts, limit = 5) => {
  return sortByDateDesc(posts, "updatedAt").slice(0, limit);
};

export const getWorkflowColumns = (posts) => {
  return STATUS_ORDER.map((status) => ({
    status,
    posts: sortByDateDesc(
      posts.filter((post) => post.status === status),
      "updatedAt"
    ),
  }));
};

export const getMonthlyTrend = (posts, months = 6) => {
  const now = new Date();
  const buckets = [];

  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    buckets.push({
      key,
      label: date.toLocaleDateString("zh-CN", { month: "short" }),
      count: 0,
    });
  }

  posts.forEach((post) => {
    const createdAt = new Date(post.createdAt);
    const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    const bucket = buckets.find((item) => item.key === key);
    if (bucket) bucket.count += 1;
  });

  return buckets;
};

export const getContentHealth = (posts) => {
  const total = posts.length || 1;
  const withCover = posts.filter((post) => post.thumbnailUrl).length;
  const withSummary = posts.filter((post) => post.shortDescription).length;
  const withTags = posts.filter((post) => post.tags?.length).length;
  const published = posts.filter((post) => post.status === "Published").length;

  return [
    {
      label: "封面完善率",
      value: `${Math.round((withCover / total) * 100)}%`,
      hint: `${withCover} / ${posts.length} 篇文章具备封面图`,
      tone: "accent",
    },
    {
      label: "摘要完善率",
      value: `${Math.round((withSummary / total) * 100)}%`,
      hint: `${withSummary} 篇文章补充了摘要`,
      tone: "default",
    },
    {
      label: "标签使用率",
      value: `${Math.round((withTags / total) * 100)}%`,
      hint: `${withTags} 篇文章配置了标签`,
      tone: "success",
    },
    {
      label: "发布完成率",
      value: `${Math.round((published / total) * 100)}%`,
      hint: `${published} 篇文章已正式发布`,
      tone: "warning",
    },
  ];
};

export const getRecommendations = (posts) => {
  const draftCount = posts.filter((post) => post.status === "Draft").length;
  const coverCount = posts.filter((post) => post.thumbnailUrl).length;
  const summaryCount = posts.filter((post) => post.shortDescription).length;
  const publishedCount = posts.filter((post) => post.status === "Published").length;
  const categoryBreakdown = getCategoryBreakdown(posts);
  const topCategory = categoryBreakdown[0];

  const suggestions = [];

  if (draftCount > 0) {
    suggestions.push(`当前有 ${draftCount} 篇草稿待完善，建议优先处理更新时间最近的内容。`);
  }

  if (posts.length && coverCount / posts.length < 0.7) {
    suggestions.push("封面图覆盖率偏低，建议为重点文章补充视觉素材，提升列表展示效果。");
  }

  if (posts.length && summaryCount / posts.length < 0.75) {
    suggestions.push("摘要填写比例还有提升空间，可统一补全 shortDescription，便于列表和分享场景展示。");
  }

  if (topCategory) {
    suggestions.push(`当前内容最集中在「${topCategory.name}」分类，占比 ${topCategory.share}%，可考虑增加其他主题丰富度。`);
  }

  if (posts.length && publishedCount / posts.length < 0.5) {
    suggestions.push("已发布内容占比未过半，可以建立更明确的发布节奏与审校流程。");
  }

  if (suggestions.length === 0) {
    suggestions.push("内容结构较均衡，可继续补充专题页面或作者管理能力，提升后台完整度。");
  }

  return suggestions.slice(0, 4);
};
