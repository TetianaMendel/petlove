"use client";

import { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import css from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (nextPage: number) => void;
}

type PageItem = number | "left-ellipsis" | "right-ellipsis";

function getVisiblePages(
  currentPage: number,
  totalPages: number,
  isMobile: boolean
): PageItem[] {
  const visibleCount = isMobile ? 2 : 3;

  if (totalPages <= visibleCount) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  const start = Math.min(
    Math.max(1, currentPage - 1),
    totalPages - visibleCount + 1
  );

  const pages: PageItem[] = Array.from(
    { length: visibleCount },
    (_, index) => start + index
  );

  if (start > 1) {
    pages.unshift("left-ellipsis");
  }

  if (start + visibleCount - 1 < totalPages) {
    pages.push("right-ellipsis");
  }

  return pages;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(max-width: 767px)"
    );

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, []);

  if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === currentPage
    ) {
      return;
    }

    onPageChange(nextPage);
  };

  const pages = getVisiblePages(
    currentPage,
    totalPages,
    isMobile
  );

  return (
    <nav
      className={css.wrapper}
      aria-label="Pagination"
    >
      <div className={css.navigationGroup}>
        <button
          type="button"
          className={css.arrow}
          onClick={() => handlePageChange(1)}
          disabled={isFirstPage}
          aria-label="First page"
        >
          <FiChevronsLeft />
        </button>

        <button
          type="button"
          className={css.arrow}
          onClick={() =>
            handlePageChange(currentPage - 1)
          }
          disabled={isFirstPage}
          aria-label="Previous page"
        >
          <FiChevronLeft />
        </button>
      </div>

      <div className={css.numberGroup}>
        {pages.map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              className={`${css.page} ${
                item === currentPage
                  ? css.active
                  : ""
              }`}
              onClick={() => handlePageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={
                item === currentPage
                  ? "page"
                  : undefined
              }
            >
              {item}
            </button>
          ) : (
            <span
              key={item}
              className={css.break}
              aria-hidden="true"
            >
              ...
            </span>
          )
        )}
      </div>

      <div className={css.navigationGroup}>
        <button
          type="button"
          className={css.arrow}
          onClick={() =>
            handlePageChange(currentPage + 1)
          }
          disabled={isLastPage}
          aria-label="Next page"
        >
          <FiChevronRight />
        </button>

        <button
          type="button"
          className={css.arrow}
          onClick={() => handlePageChange(totalPages)}
          disabled={isLastPage}
          aria-label="Last page"
        >
          <FiChevronsRight />
        </button>
      </div>
    </nav>
  );
}