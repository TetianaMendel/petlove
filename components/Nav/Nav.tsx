"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

type NavProps = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

const navigation = [
  { label: "News", href: "/news" },
  { label: "Find pet", href: "/notices" },
  { label: "Our friends", href: "/friends" },
];

export default function Nav({
  variant = "desktop",
  onNavigate,
}: NavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`${styles.navigation} ${styles[variant]}`}
      aria-label="Main navigation"
    >
      <ul className={styles.navList}>
        {navigation.map(({ label, href }) => {
          const isActive =
            pathname === href ||
            pathname.startsWith(`${href}/`);

          return (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.navLink} ${
                  isActive ? styles.active : ""
                }`}
                aria-current={isActive ? "page" : undefined}
                onClick={onNavigate}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}