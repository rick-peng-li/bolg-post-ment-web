import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/common/Header";
import DashboardPage from "./pages/DashboardPage";
import PostListPage from "./pages/PostListPage";
import AddPostPage from "./pages/AddPostPage";
import EditPostPage from "./pages/EditPostPage";
import ViewPostPage from "./pages/ViewPostPage";
import InsightsPage from "./pages/InsightsPage";
import WorkflowPage from "./pages/WorkflowPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<PostListPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/workflow" element={<WorkflowPage />} />
          <Route path="/posts/new" element={<AddPostPage />} />
          <Route path="/posts/:id" element={<ViewPostPage />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: "DM Sans, system-ui, sans-serif",
            fontSize: "0.875rem",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          },
        }}
      />
    </BrowserRouter>
  );
};

export default App;
