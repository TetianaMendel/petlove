"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { useAppSelector } from "@/lib/store/hooks";
import styles from "./UserBar.module.css";

type UserBarProps = {
  onNavigate?: () => void;
};

export default function UserBar({ onNavigate }: UserBarProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (user === null) {
    return null;
  }

  return (
    <Link
      href="/profile"
      className={styles.profileLink}
      onClick={onNavigate}
      aria-label={`Go to ${user.name}'s profile`}
    >
      <div className={styles.avatarWrapper}>
        <FaUser
          className={styles.avatarIcon}
          aria-hidden="true"
        />
      </div>

      <span className={styles.userName}>{user.name}</span>
    </Link>
  );
}