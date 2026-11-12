"use client";

import { useState } from "react";
import type { Notice } from "@/types/notices";
import NoticesItem from "@/components/NoticesItem/NoticesItem";
import styles from "./MyNotices.module.css";

interface MyNoticesProps {
  favorites: Notice[];
  viewed: Notice[];
}

type ActiveTab = "favorites" | "viewed";

export default function MyNotices({
  favorites,
  viewed,
}: MyNoticesProps) {
  const [activeTab, setActiveTab] =
    useState<ActiveTab>("favorites");

  const notices =
    activeTab === "favorites" ? favorites : viewed;

  return (
    <section className={styles.myNotices}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "favorites"
              ? styles.activeTab
              : ""
          }`}
          onClick={() => setActiveTab("favorites")}
        >
          My favorite pets
        </button>

        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "viewed"
              ? styles.activeTab
              : ""
          }`}
          onClick={() => setActiveTab("viewed")}
        >
          Viewed
        </button>
      </div>

      <div className={styles.noticesContent}>
        {notices.length === 0 ? (
          <p className={styles.emptyMessage}>
            Oops,{" "}
            <span className={styles.emptyMessageSpan}>
              looks like there aren&apos;t any furries{" "}
            </span>
            on our adorable page yet. Do not worry!
            View your pets on the &quot;find your favorite
            pet&quot; page and add them to your favorites.
          </p>
        ) : (
          <ul className={styles.noticesList}>
            {notices.map((notice) => (
              <li key={notice._id} className={styles.noticesItem}>
                <NoticesItem
                   notice={notice}
                   isFavorite={favorites.some(
                     (favorite) => favorite._id === notice._id
                    )}
                   variant="myNotices"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}