"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Title from "@/components/Title/Title";
import SearchField from "@/components/SearchField/SearchField";
import NewsList from "@/components/NewsList/NewsList";
import Pagination from "@/components/Pagination/Pagination";
import { fetchNews } from "@/lib/clientApi";
import styles from "./NewsContent.module.css";

export default function NewsContent() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const limit = 6;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["news", page, limit, keyword],
    queryFn: () => fetchNews({ page, limit, keyword }),
  });

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  return (
    <>
      <div className={styles.top}>
        <Title>News</Title>
        <SearchField onSearch={handleSearch} />
      </div>

      {isLoading && <p>Loading news...</p>}

      {isError && (
        <p role="alert">Failed to load news.</p>
      )}

      {data && !isLoading && !isError && (
        <>
          {data.results.length > 0 ? (
            <NewsList news={data.results} />
          ) : (
            <p>No news found.</p>
          )}

          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );
}