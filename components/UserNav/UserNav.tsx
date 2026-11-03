import Image from "next/image";
import Link from "next/link";
import styles from "./UserNav.module.css";

type UserNavProps = {
  name: string;
  avatar?: string | null;
  onLogout: () => void;
  variant?: "desktop" | "mobile";
};

export default function UserNav({
  name,
  avatar,
  onLogout,
  variant = "desktop",
}: UserNavProps) {
  return (
    <div className={`${styles.userNav} ${styles[variant]}`}>
      <Link
        href="/profile"
        className={styles.userBar}
        aria-label={`Go to ${name}'s profile`}
      >
        <span className={styles.avatar}>
          {avatar ? (
            <Image
              src={avatar}
              alt={`${name}'s avatar`}
              width={50}
              height={50}
              className={styles.avatarImage}
            />
          ) : (
            <span
              className={styles.defaultAvatar}
              aria-hidden="true"
            >
              👤
            </span>
          )}
        </span>

        <span className={styles.userName}>{name}</span>
      </Link>

      <button
        type="button"
        className={styles.logout}
        onClick={onLogout}
      >
        LOG OUT
      </button>
    </div>
  );
}