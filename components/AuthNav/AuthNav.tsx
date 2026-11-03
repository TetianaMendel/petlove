import Link from "next/link";
import styles from "./AuthNav.module.css";

type AuthNavProps = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export default function AuthNav({
  variant = "desktop",
  onNavigate,
}: AuthNavProps) {
  return (
    <nav
      className={`${styles.authNav} ${styles[variant]}`}
      aria-label="Authentication navigation"
    >
      <Link
        href="/login"
        className={styles.login}
        onClick={onNavigate}
      >
        LOG IN
      </Link>

      <Link
        href="/register"
        className={styles.register}
        onClick={onNavigate}
      >
        REGISTRATION
      </Link>
    </nav>
  );
}