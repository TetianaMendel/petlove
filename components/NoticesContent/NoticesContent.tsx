"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Title from "@/components/Title/Title";
import NoticesFilters from "@/components/NoticesFilters/NoticesFilters";
import NoticesList from "@/components/NoticesList/NoticesList";
import Pagination from "@/components/Pagination/Pagination";
import {
  fetchNotices,
  fetchFavoriteNoticeIds,
} from "@/lib/clientApi";
import { useAppSelector } from "@/lib/store/hooks";
import type {
  NoticeCategory,
  NoticeSex,
  SortOption,
} from "@/types/notices";
import styles from "./NoticesContent.module.css";

interface NoticesContentProps {
  initialCategory?: NoticeCategory;
}

export default function NoticesContent({
  initialCategory,
}: NoticesContentProps) {
  const router = useRouter();

  const { user, isAuthenticated, isAuthChecking } = useAppSelector(
    (state) => state.auth
  );

  const { data: favoriteIds = [] } = useQuery({
    queryKey: ["favorite-notices", user?.email],
    queryFn: fetchFavoriteNoticeIds,
    enabled: isAuthenticated && !isAuthChecking,
  });

  const [keyword, setKeyword] = useState("");
  const category = initialCategory;

  const [sex, setSex] = useState<NoticeSex | undefined>();
  const [species, setSpecies] = useState<string | undefined>();
  const [locationId, setLocationId] = useState<string | undefined>();
  const [sort, setSort] = useState<SortOption | null>(null);
  const [page, setPage] = useState(1);
  const [resetKey, setResetKey] = useState(0);

  const { data, isPending, isError } = useQuery({
    queryKey: [
      "notices",
      page,
      keyword,
      category,
      sex,
      species,
      locationId,
      sort,
    ],
    queryFn: () =>
      fetchNotices({
        page,
        limit: 6,
        keyword: keyword || undefined,
        category,
        sex,
        species,
        locationId,
        byPopularity:
          sort === "Popular"
            ? false
            : sort === "Unpopular"
              ? true
              : undefined,
        byPrice:
          sort === "Cheap"
            ? true
            : sort === "Expensive"
              ? false
              : undefined,
      }),
  });

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const handleCategoryChange = (
    value: NoticeCategory | undefined
  ) => {
    setPage(1);
    router.push(`/notices/filter/${value ?? "all"}`);
  };

  const handleSexChange = (value: NoticeSex | undefined) => {
    setSex(value);
    setPage(1);
  };

  const handleSpeciesChange = (value: string | undefined) => {
    setSpecies(value);
    setPage(1);
  };

  const handleLocationChange = (value: string | undefined) => {
    setLocationId(value);
    setPage(1);
  };

  const handleSortChange = (value: SortOption | null) => {
    setSort(value);
    setPage(1);
  };

  const handleReset = () => {
    setKeyword("");
    setSex(undefined);
    setSpecies(undefined);
    setLocationId(undefined);
    setSort(null);
    setPage(1);
    setResetKey((current) => current + 1);

    router.push("/notices/filter/all");
  };

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > (data?.totalPages ?? 1) ||
      nextPage === page
    ) {
      return;
    }

    setPage(nextPage);
  };

  const hasActiveFilters = Boolean(
    keyword ||
      category ||
      sex ||
      species ||
      locationId ||
      sort
  );

  return (
    <div className={styles.content}>
      <Title>Find your favorite pet</Title>

      <NoticesFilters
        onKeywordChange={handleKeywordChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        sex={sex}
        onSexChange={handleSexChange}
        species={species}
        onSpeciesChange={handleSpeciesChange}
        locationId={locationId}
        onLocationChange={handleLocationChange}
        sort={sort}
        onSortChange={handleSortChange}
        onReset={handleReset}
        resetKey={resetKey}
        hasActiveFilters={hasActiveFilters}
      />

      {isPending && <p>Loading notices...</p>}

      {isError && <p>Failed to load notices.</p>}

      {data && !isError && (
        <>
          {data.results.length > 0 ? (
            <>
              <NoticesList
                notices={data.results}
                favoriteIds={favoriteIds}
              />

              <Pagination
                totalPages={data.totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p>No notices found.</p>
          )}
        </>
      )}
    </div>
  );
}