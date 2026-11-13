"use client";

import { useEffect, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

import styles from "./Loader.module.css";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Loader() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isLoading = isFetching > 0 || isMutating > 0;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return 95;
        }

        return Math.min(
          prev + Math.ceil(Math.random() * 5),
          95
        );
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  const offset = CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div
      className={styles.overlay}
      role="status"
      aria-label="Loading"
    >
      <div className={styles.loader}>
        <svg
          className={styles.circle}
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle
            className={styles.track}
            cx="50"
            cy="50"
            r={RADIUS}
          />

          <circle
            className={styles.progress}
            cx="50"
            cy="50"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>

        <span className={styles.percentage}>
          {progress}%
        </span>
      </div>
    </div>
  );
}