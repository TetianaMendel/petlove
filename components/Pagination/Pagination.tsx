"use client";

import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
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

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav className={css.wrapper} aria-label="Pagination">
      <button
        type="button"
        className={css.arrow}
        onClick={() => onPageChange(1)}
        disabled={isFirstPage}
        aria-label="First page"
      >
        <FiChevronsLeft />
      </button>

      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={isMobile ? 1 : 3}
        marginPagesDisplayed={isMobile ? 1 : 1}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        pageClassName={css.page}
        pageLinkClassName={css.pageLink}
        activeClassName={css.active}
        disabledClassName={css.disabled}
        breakClassName={css.break}
        previousClassName={css.page}
        nextClassName={css.page}
        previousLinkClassName={css.pageLink}
        nextLinkClassName={css.pageLink}
        previousLabel={<FiChevronLeft />}
        nextLabel={<FiChevronRight />}
        previousAriaLabel="Previous page"
        nextAriaLabel="Next page"
        breakLabel="..."
        renderOnZeroPageCount={null}
      />

      <button
        type="button"
        className={css.arrow}
        onClick={() => onPageChange(totalPages)}
        disabled={isLastPage}
        aria-label="Last page"
      >
        <FiChevronsRight />
      </button>
    </nav>
  );
};

export default Pagination;