"use client";

import { useState, type FormEvent } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import css from "./SearchField.module.css";

interface SearchFieldProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

const SearchField = ({
  onSearch,
  placeholder = "Search",
}: SearchFieldProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} role="search">
      <input
        className={css.input}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label={placeholder}
      />

      <div className={css.actions}>
        {value && (
          <button
            className={css.clearButton}
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}

        <button
          className={css.searchButton}
          type="submit"
          aria-label="Search"
        >
          <FiSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchField;