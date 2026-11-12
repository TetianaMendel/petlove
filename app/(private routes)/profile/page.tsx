"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/store/hooks";
import { fetchFullUser } from "@/lib/clientApi";
import MyNotices from "@/components/MyNotices/MyNotices";
import UserCard from "@/components/UserCard/UserCard";
import styles from "./Profile.module.css";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);

  const { data: fullUser } = useQuery({
    queryKey: ["full-user", user?.email],
    queryFn: fetchFullUser,
    enabled: Boolean(user),
  });

  return (
    <section className={styles.profilePage}>
      <div className="container">
        <h1 className={styles.visuallyHidden}>
          My profile
        </h1>

        <div className={styles.profileLayout}>
          <div className={styles.userCard}>
            <UserCard />
          </div>

          <div className={styles.noticesSection}>
            {fullUser && (
              <MyNotices
                favorites={fullUser.noticesFavorites ?? []}
                viewed={fullUser.noticesViewed ?? []}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}