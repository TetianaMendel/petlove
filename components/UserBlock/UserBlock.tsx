"use client";

import Image from "next/image";
import { FiUser } from "react-icons/fi";
import type { User } from "@/types/user";
import styles from "./UserBlock.module.css";

interface UserBlockProps {
  user: User | null;
}

export default function UserBlock({ user }: UserBlockProps) {
  return (
    <div className={styles.userBlock}>
      <div className={styles.avatarWrapper}>
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt="User avatar"
            fill
            className={styles.photo}
            loading="eager"
            sizes="(min-width: 768px) 110px, 94px"
          />
        ) : (
          <FiUser
            className={styles.avatarIcon}
            aria-hidden="true"
          />
        )}
      </div>

      <div className={styles.infoEditWrap}>
        <h2 className={styles.infoTitle}>My information</h2>

        <ul className={styles.formInfo}>
          <li className={user?.name ? styles.field : styles.fieldDef}>
            {user?.name || "Name"}
          </li>

          <li className={user?.email ? styles.field : styles.fieldDef}>
            {user?.email || "name@gmail.com"}
          </li>

          <li className={user?.phone ? styles.field : styles.fieldDef}>
            {user?.phone || "+380"}
          </li>
        </ul>
      </div>
    </div>
  );
}