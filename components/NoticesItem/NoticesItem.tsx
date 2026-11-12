"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FiHeart, FiTrash2 } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import type { Notice, NoticeDetails } from "@/types/notices";
import { useAppSelector } from "@/lib/store/hooks";
import {
  addNoticeToFavorites,
  removeNoticeFromFavorites,
  fetchNoticeById,
} from "@/lib/clientApi";
import ModalAttention from "@/components/ModalAttention/ModalAttention";
import ModalNotice from "@/components/ModalNotice/ModalNotice";
import styles from "./NoticesItem.module.css";

interface NoticesItemProps {
  notice: Notice;
  isFavorite: boolean;
  variant?: "default" | "myNotices";
}

export default function NoticesItem({
  notice,
  isFavorite,
  variant = "default",
}: NoticesItemProps) {
  const [isAttentionOpen, setIsAttentionOpen] = useState(false);
  const [noticeDetails, setNoticeDetails] =
    useState<NoticeDetails | null>(null);

  const { user, isAuthenticated, isAuthChecking } =
    useAppSelector((state) => state.auth);

  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: () =>
      isFavorite
        ? removeNoticeFromFavorites(notice._id)
        : addNoticeToFavorites(notice._id),

    onSuccess: (favoriteIds) => {
      queryClient.setQueryData(
        ["favorite-notices", user?.email],
        favoriteIds
      );

      queryClient.invalidateQueries({
        queryKey: ["full-user", user?.email],
      });
    },

    onError: () => {
      toast.error("Failed to update favorites.");
    },
  });

  const detailsMutation = useMutation({
    mutationFn: () => fetchNoticeById(notice._id),

    onSuccess: (details) => {
      setNoticeDetails(details);
    },

    onError: () => {
      toast.error("Failed to load notice details.");
    },
  });

  const {
    imgURL,
    title,
    popularity,
    name,
    birthday,
    sex,
    species,
    category,
    comment,
    price,
  } = notice;

  const formattedBirthday = birthday
    ? new Date(birthday)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, ".")
    : "Unknown";

  const openAttention = () => {
    setIsAttentionOpen(true);
  };

  const closeAttention = () => {
    setIsAttentionOpen(false);
  };

  const closeNotice = () => {
    setNoticeDetails(null);
  };

  const handleLearnMoreClick = () => {
    if (isAuthChecking) {
      return;
    }

    if (!isAuthenticated) {
      openAttention();
      return;
    }

    if (!detailsMutation.isPending) {
      detailsMutation.mutate();
    }
  };

  const handleFavoriteClick = () => {
    if (isAuthChecking) {
      return;
    }

    if (!isAuthenticated) {
      openAttention();
      return;
    }

    if (!favoriteMutation.isPending) {
      favoriteMutation.mutate();
    }
  };

  return (
    <>
      <article className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image
            src={imgURL}
            alt={name || title}
            fill
            unoptimized
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 340px, 100vw"
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.heading}>
            <h2 className={styles.title}>
              {title}
            </h2>

            <span className={styles.popularity}>
              <FaStar
                size={16}
                aria-hidden="true"
              />
              {popularity}
            </span>
          </div>

          <dl className={styles.details}>
            <div>
              <dt>Name</dt>
              <dd>{name || "Unknown"}</dd>
            </div>

            <div>
              <dt>Birthday</dt>
              <dd>{formattedBirthday}</dd>
            </div>

            <div>
              <dt>Sex</dt>
              <dd>{sex}</dd>
            </div>

            <div>
              <dt>Species</dt>
              <dd>{species}</dd>
            </div>

            <div>
              <dt>Category</dt>
              <dd>{category}</dd>
            </div>
          </dl>

          <p className={styles.comment}>
            {comment}
          </p>

          <div className={styles.footer}>
            <p className={styles.price}>
              {price != null
                ? `$${price.toFixed(2)}`
                : "\u00A0"}
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.learnMore}
                onClick={handleLearnMoreClick}
                disabled={
                  isAuthChecking ||
                  detailsMutation.isPending
                }
              >
                {detailsMutation.isPending
                  ? "Loading..."
                  : "Learn more"}
              </button>

              <button
                type="button"
                className={styles.favorite}
                aria-label={
                  isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
                aria-pressed={isFavorite}
                onClick={handleFavoriteClick}
                disabled={
                  isAuthChecking ||
                  favoriteMutation.isPending
                }
              >
                {variant === "myNotices" && isFavorite ? (
                  <FiTrash2
                    size={18}
                    aria-hidden="true"
                  />
                ) : (
                  <FiHeart
                    size={18}
                    fill={
                      isFavorite
                        ? "currentColor"
                        : "none"
                    }
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </article>

      {isAttentionOpen && (
        <ModalAttention
          onClose={closeAttention}
        />
      )}

      {noticeDetails && (
        <ModalNotice
          notice={noticeDetails}
          onClose={closeNotice}
        />
      )}
    </>
  );
}