"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./FilterSelect.module.css";

interface FilterSelectProps<T extends string> {
  placeholder: string;
  options: T[];
  value?: T;
  onChange: (value: T | undefined) => void;
}

function formatLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function FilterSelect<T extends string>({
  placeholder,
  options,
  value,
  onChange,
}: FilterSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (
        !wrapperRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleClickOutside
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (selectedValue?: T) => {
    onChange(selectedValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (!isOpen) {
      if (
        event.key === "ArrowDown" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      const buttons = Array.from(
        listRef.current?.querySelectorAll("button") ?? []
      );

      const currentIndex = buttons.findIndex(
        (button) => button === document.activeElement
      );

      const nextIndex =
        event.key === "ArrowDown"
          ? (currentIndex + 1) % buttons.length
          : (currentIndex - 1 + buttons.length) %
            buttons.length;

      buttons[nextIndex]?.focus();
    }
  };

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.trigger} ${
          isOpen ? styles.triggerOpen : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-label={placeholder}
      >
        <span className={styles.label}>
          {value ? formatLabel(value) : placeholder}
        </span>

        <FiChevronDown
          size={18}
          className={`${styles.chevron} ${
            isOpen ? styles.chevronOpen : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          id={listId}
          ref={listRef}
          className={styles.dropdown}
          aria-label={placeholder}
        >
          <li>
            <button
              type="button"
              className={`${styles.option} ${
                !value ? styles.selected : ""
              }`}
              onClick={() => handleSelect(undefined)}
            >
              Show all
            </button>
          </li>

          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                className={`${styles.option} ${
                  value === option ? styles.selected : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {formatLabel(option)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}