import React from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import PanelCard from "../components/dashboard/PanelCard";
import WorkflowColumn from "../components/dashboard/WorkflowColumn";
import usePostsDataset from "../hooks/usePostsDataset";
import { getStatusCounts, getWorkflowColumns } from "../utils/postAnalytics";
import styles from "./WorkflowPage.module.css";

const WorkflowPage = () => {
  const navigate = useNavigate();
  const { posts, loading } = usePostsDataset();

  if (loading) {
    return <Spinner fullPage />;
  }

  const statusCounts = getStatusCounts(posts);
  const columns = getWorkflowColumns(posts);
  const total = posts.length;

  return (
    <div className="page-content">
      <div className="page-container">
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>内容工作流</span>
            <h1 className={styles.title}>以状态看板方式管理文章推进节奏</h1>
            <p className={styles.subtitle}>
              将文章按照草稿、已发布、已归档分组展示，更适合编辑排期、内容盘点和阶段性复盘。
            </p>
          </div>
          <button className={styles.primaryBtn} onClick={() => navigate("/posts/new")}>
            新建内容任务
          </button>
        </div>

        <PanelCard title="流程摘要" subtitle="快速查看各状态文章数量，帮助安排下一步处理优先级">
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span>总内容量</span>
              <strong>{total}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span>待发布草稿</span>
              <strong>{statusCounts.Draft}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span>在线文章</span>
              <strong>{statusCounts.Published}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span>归档沉淀</span>
              <strong>{statusCounts.Archived}</strong>
            </div>
          </div>
        </PanelCard>

        <section className={styles.board}>
          <WorkflowColumn
            title="草稿池"
            posts={columns.find((item) => item.status === "Draft")?.posts || []}
            tone="default"
            emptyText="当前没有草稿内容，可以继续策划新主题。"
          />
          <WorkflowColumn
            title="已发布"
            posts={columns.find((item) => item.status === "Published")?.posts || []}
            tone="success"
            emptyText="当前还没有已发布内容。"
          />
          <WorkflowColumn
            title="归档库"
            posts={columns.find((item) => item.status === "Archived")?.posts || []}
            tone="warning"
            emptyText="暂无归档内容，可保留优质旧文后续再利用。"
          />
        </section>
      </div>
    </div>
  );
};

export default WorkflowPage;
