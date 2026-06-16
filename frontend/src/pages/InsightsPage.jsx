import React from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import MetricCard from "../components/dashboard/MetricCard";
import PanelCard from "../components/dashboard/PanelCard";
import MiniPostList from "../components/dashboard/MiniPostList";
import usePostsDataset from "../hooks/usePostsDataset";
import {
  getAuthorLeaderboard,
  getCategoryBreakdown,
  getContentHealth,
  getRecentPosts,
  getRecommendations,
} from "../utils/postAnalytics";
import styles from "./InsightsPage.module.css";

const InsightsPage = () => {
  const { posts, loading } = usePostsDataset();

  if (loading) {
    return <Spinner fullPage />;
  }

  const healthMetrics = getContentHealth(posts);
  const categoryBreakdown = getCategoryBreakdown(posts);
  const authorLeaderboard = getAuthorLeaderboard(posts).slice(0, 8);
  const recommendationList = getRecommendations(posts);
  const draftPosts = posts.filter((post) => post.status === "Draft").slice(0, 4);

  return (
    <div className="page-content">
      <div className="page-container">
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>内容分析</span>
            <h1 className={styles.title}>用更多视角观察内容质量和结构平衡</h1>
            <p className={styles.subtitle}>
              通过封面、摘要、标签、作者与分类等指标，快速识别内容薄弱点，为后续迭代和运营提供依据。
            </p>
          </div>
          <Link to="/dashboard" className={styles.linkBtn}>
            返回总览
          </Link>
        </div>

        <section className={styles.metricsGrid}>
          {healthMetrics.map((item) => (
            <MetricCard key={item.label} {...item} />
          ))}
        </section>

        <section className={styles.analysisGrid}>
          <PanelCard title="分类深度" subtitle="查看各分类内容占比与主题集中度">
            <div className={styles.table}>
              {categoryBreakdown.map((item, index) => (
                <div key={item.name} className={styles.tableRow}>
                  <div className={styles.rankCell}>
                    <span className={styles.rank}>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item.name}</strong>
                  </div>
                  <div className={styles.shareCell}>
                    <span>{item.count} 篇</span>
                    <span>{item.share}%</span>
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="作者贡献榜" subtitle="展示当前作者的发布效率与草稿积压情况">
            <div className={styles.authorGrid}>
              {authorLeaderboard.map((author) => (
                <article key={author.name} className={styles.authorCard}>
                  <span className={styles.authorInitial}>{author.name.charAt(0).toUpperCase()}</span>
                  <strong>{author.name}</strong>
                  <p>总文章 {author.total}</p>
                  <div className={styles.authorMeta}>
                    <span>发布 {author.published}</span>
                    <span>草稿 {author.draft}</span>
                  </div>
                </article>
              ))}
            </div>
          </PanelCard>
        </section>

        <section className={styles.bottomGrid}>
          <PanelCard title="内容建议" subtitle="基于当前数据自动生成的运营建议">
            <div className={styles.recommendations}>
              {recommendationList.map((item) => (
                <div key={item} className={styles.tipCard}>
                  <span className={styles.tipTag}>建议</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="待推进草稿" subtitle="优先处理草稿文章，缩短发布链路">
            <MiniPostList posts={draftPosts} emptyText="当前没有待推进草稿，内容发布节奏很好。" />
          </PanelCard>

          <PanelCard title="最近更新内容" subtitle="结合更新时间快速定位近期工作重点">
            <MiniPostList posts={getRecentPosts(posts, 4)} emptyText="暂无最近更新内容" />
          </PanelCard>
        </section>
      </div>
    </div>
  );
};

export default InsightsPage;
