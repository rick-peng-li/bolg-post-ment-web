import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import MetricCard from "../components/dashboard/MetricCard";
import PanelCard from "../components/dashboard/PanelCard";
import MiniPostList from "../components/dashboard/MiniPostList";
import usePostsDataset from "../hooks/usePostsDataset";
import {
  getAuthorLeaderboard,
  getCategoryBreakdown,
  getDashboardMetrics,
  getMonthlyTrend,
  getRecentPosts,
  getRecommendations,
} from "../utils/postAnalytics";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { posts, loading, refreshing, refetch } = usePostsDataset();

  if (loading) {
    return <Spinner fullPage />;
  }

  const metrics = getDashboardMetrics(posts);
  const recentPosts = getRecentPosts(posts, 5);
  const categories = getCategoryBreakdown(posts).slice(0, 6);
  const authors = getAuthorLeaderboard(posts).slice(0, 5);
  const monthlyTrend = getMonthlyTrend(posts, 6);
  const recommendations = getRecommendations(posts);
  const maxTrendCount = Math.max(...monthlyTrend.map((item) => item.count), 1);

  return (
    <div className="page-content">
      <div className="page-container">
        <section className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>内容总览</span>
            <h1 className={styles.title}>让博客后台更像一个内容运营工作台</h1>
            <p className={styles.subtitle}>
              在一个页面里查看内容规模、更新趋势、分类分布与作者贡献，快速掌握当前站点的运营状态。
            </p>
          </div>
          <div className={styles.actions}>
            <button className={styles.primaryBtn} onClick={() => navigate("/posts/new")}>
              新建文章
            </button>
            <button className={styles.secondaryBtn} onClick={() => navigate("/workflow")}>
              查看工作流
            </button>
            <button
              className={styles.ghostBtn}
              onClick={() => refetch({ silent: true })}
              disabled={refreshing}
            >
              {refreshing ? "刷新中…" : "刷新数据"}
            </button>
          </div>
        </section>

        <section className={styles.metricsGrid}>
          {metrics.map((item) => (
            <MetricCard key={item.label} {...item} />
          ))}
        </section>

        <section className={styles.contentGrid}>
          <PanelCard
            title="最近更新"
            subtitle="优先关注最近编辑过的内容，便于继续完善与发布"
            action={<Link to="/">查看全部文章</Link>}
          >
            <MiniPostList posts={recentPosts} emptyText="暂无最近更新文章" />
          </PanelCard>

          <PanelCard title="运营建议" subtitle="根据当前内容结构自动生成的轻量建议">
            <div className={styles.recommendationList}>
              {recommendations.map((item) => (
                <div key={item} className={styles.recommendationItem}>
                  <span className={styles.recommendationDot} />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </PanelCard>
        </section>

        <section className={styles.bottomGrid}>
          <PanelCard title="分类分布" subtitle="观察当前内容集中在哪些主题">
            <div className={styles.statList}>
              {categories.map((item) => (
                <div key={item.name} className={styles.statRow}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.count} 篇内容</span>
                  </div>
                  <div className={styles.progressMeta}>
                    <span>{item.share}%</span>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ width: `${item.share}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="作者活跃度" subtitle="按发布数和总文章数统计内容贡献">
            <div className={styles.authorList}>
              {authors.map((author) => (
                <div key={author.name} className={styles.authorRow}>
                  <div className={styles.authorIdentity}>
                    <span className={styles.authorAvatar}>{author.name.charAt(0).toUpperCase()}</span>
                    <div>
                      <strong>{author.name}</strong>
                      <p>总计 {author.total} 篇</p>
                    </div>
                  </div>
                  <div className={styles.authorStats}>
                    <span>已发布 {author.published}</span>
                    <span>草稿 {author.draft}</span>
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="月度新增趋势" subtitle="统计最近 6 个月创建的文章数量">
            <div className={styles.trendList}>
              {monthlyTrend.map((item) => (
                <div key={item.key} className={styles.trendRow}>
                  <span className={styles.trendLabel}>{item.label}</span>
                  <div className={styles.trendBarTrack}>
                    <div
                      className={styles.trendBarFill}
                      style={{ width: `${Math.max((item.count / maxTrendCount) * 100, item.count ? 16 : 0)}%` }}
                    />
                  </div>
                  <span className={styles.trendCount}>{item.count}</span>
                </div>
              ))}
            </div>
          </PanelCard>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
