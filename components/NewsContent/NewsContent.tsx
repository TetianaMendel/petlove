"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "@/lib/clientApi";
import NewsList from "@/components/NewsList/NewsList";

export default function NewsContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["news", 1, 6],
    queryFn: () =>
      fetchNews({
        page: 1,
        limit: 6,
      }),
  });

  if (isLoading) {
    return <p>Loading news...</p>;
  }

  if (isError) {
    return <p role="alert">Failed to load news.</p>;
  }

  if (!data || data.results.length === 0) {
    return <p>No news found.</p>;
  }

  return <NewsList news={data.results} />;
}