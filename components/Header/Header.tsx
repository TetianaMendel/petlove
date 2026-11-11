"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

import { useAppSelector } from "@/lib/store/hooks";
import Nav from "../Nav/Nav";
import AuthNav from "../AuthNav/AuthNav";
import UserNav from "../UserNav/UserNav";
import UserBar from "../UserBar/UserBar";
import MobileMenu from "../MobileMenu/MobileMenu";
import styles from "./Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/home";

  const { isAuthenticated, isAuthChecking } = useAppSelector(
    (state) => state.auth
  );

  return (
    <header
      className={`${styles.header} ${
        isHomePage ? styles.homeHeader : ""
      }`}
    >
      <div className={`container ${styles.container}`}>
        <Link
          href="/home"
          className={styles.logo}
          aria-label="PetLove home"
        >
          petl
          <FaHeart
            className={styles.heart}
            aria-hidden="true"
          />
          ve
        </Link>

        <div className={styles.navigation}>
          <Nav />
        </div>

        <div
          className={`${styles.auth} ${
            !isAuthenticated ? styles.guestAuth : ""
          }`}
        >
          {!isAuthChecking &&
            (isAuthenticated ? <UserNav /> : <AuthNav />)}
        </div>

        <div className={styles.mobileActions}>
          {!isAuthChecking && isAuthenticated && (
            <div className={styles.mobileUser}>
              <UserBar />
            </div>
          )}

          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <RxHamburgerMenu
              className={styles.menuIcon}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        variant={isHomePage ? "yellow" : "light"}
      />
    </header>
  );
}