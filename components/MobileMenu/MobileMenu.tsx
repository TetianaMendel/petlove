"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { RxCross2 } from "react-icons/rx";

import { useAppSelector } from "@/lib/store/hooks";
import Nav from "../Nav/Nav";
import AuthNav from "../AuthNav/AuthNav";
import LogOutBtn from "../LogOutBtn/LogOutBtn";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  variant?: "light" | "yellow";
};

export default function MobileMenu({
  isOpen,
  onClose,
  variant = "light",
}: MobileMenuProps) {
  const pathname = usePathname();

  const { isAuthenticated, isAuthChecking } = useAppSelector(
    (state) => state.auth
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;

      if (isOpen) {
        onClose();
      }
    }
  }, [pathname, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) {
        return;
      }

      const focusableElements =
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );

      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);

      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        ref={menuRef}
        id="mobile-navigation"
        className={`${styles.menu} ${styles[variant]}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <RxCross2
            className={styles.closeIcon}
            aria-hidden="true"
          />
        </button>

        <Nav
          variant="mobile"
          onNavigate={onClose}
        />

        <div className={styles.auth}>
          {!isAuthChecking &&
            (isAuthenticated ? (
              <LogOutBtn variant="mobile" />
            ) : (
              <AuthNav
                variant="mobile"
                onNavigate={onClose}
              />
            ))}
        </div>
      </div>
    </div>
  );
}