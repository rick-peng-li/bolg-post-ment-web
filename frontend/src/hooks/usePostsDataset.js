import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { postService } from "../services/postService";

const FULL_DATA_LIMIT = 1000;

const usePostsDataset = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await postService.getAll({
        page: 1,
        limit: FULL_DATA_LIMIT,
        sortBy: "updatedAt",
        order: "desc",
      });

      setPosts(res.data.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    refreshing,
    refetch: fetchPosts,
  };
};

export default usePostsDataset;
