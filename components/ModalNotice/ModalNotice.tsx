"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiHeart, FiX } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import type { NoticeDetails } from "@/types/notices";
import { useAppSelector } from "@/lib/store/hooks";
import {
  fetchFavoriteNoticeIds,
  addNoticeToFavorites,
  removeNoticeFromFavorites,
} from "@/lib/clientApi";
import Modal from "@/components/Modal/Modal";
import styles from "./ModalNotice.module.css";

interface ModalNoticeProps {
  notice: NoticeDetails;
  onClose: () => void;
}

export default function ModalNotice({
  notice,
  onClose,
}: ModalNoticeProps) {
  const [showContacts, setShowContacts] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const { data: favoriteIds = [], isPending: isFavoritesLoading } =
    useQuery({
      queryKey: ["favorite-notices", user?.email],
      queryFn: fetchFavoriteNoticeIds,
      enabled: Boolean(user),
    });

  const isFavorite = favoriteIds.includes(notice._id);

  const favoriteMutation = useMutation({
    mutationFn: () =>
      isFavorite
        ? removeNoticeFromFavorites(notice._id)
        : addNoticeToFavorites(notice._id),

    onSuccess: (updatedFavorites) => {
      queryClient.setQueryData(
        ["favorite-notices", user?.email],
        updatedFavorites
      );

      toast.success(
        isFavorite
          ? "Removed from favorites"
          : "Added to favorites"
      );
    },

    onError: () => {
      toast.error("Failed to update favorites");
    },
  });

  const formattedBirthday = notice.birthday
    ? new Date(notice.birthday)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, ".")
    : "Unknown";

  const capitalize = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <Modal onClose={onClose} className={styles.noticeModal}>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close modal"
      >
        <FiX size={24} aria-hidden="true" />
      </button>

      <div className={styles.imageContainer}>
        <Image
          src={notice.imgURL}
          alt={notice.name || notice.title}
          width={150}
          height={150}
          unoptimized
          className={styles.petImage}
        />

        <span className={styles.categoryBadge}>
          {capitalize(notice.category)}
        </span>
      </div>

      <h2 className={styles.noticeTitle}>{notice.title}</h2>

      <p className={styles.popularity}>
        <FaStar size={16} aria-hidden="true" />
        {notice.popularity}
      </p>

      <ul className={styles.detailsList}>
        <li className={styles.detailItem}>
          <span className={styles.detailLabel}>Name</span>
          <span className={styles.detailValue}>
            {notice.name || "Unknown"}
          </span>
        </li>

        <li className={styles.detailItem}>
          <span className={styles.detailLabel}>Birthday</span>
          <span className={styles.detailValue}>
            {formattedBirthday}
          </span>
        </li>

        <li className={styles.detailItem}>
          <span className={styles.detailLabel}>Sex</span>
          <span className={styles.detailValue}>
            {capitalize(notice.sex)}
          </span>
        </li>

        <li className={styles.detailItem}>
          <span className={styles.detailLabel}>Species</span>
          <span className={styles.detailValue}>
            {capitalize(notice.species)}
          </span>
        </li>
      </ul>

      <p className={styles.description}>{notice.comment}</p>

      {notice.price != null && (
        <p className={styles.price}>
          ${notice.price.toFixed(2)}
        </p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.favoriteButton}
          onClick={() => favoriteMutation.mutate()}
          disabled={
            isFavoritesLoading || favoriteMutation.isPending
          }
        >
          {isFavorite ? "Remove from" : "Add to"}
          <FiHeart size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={styles.contactButton}
          onClick={() => setShowContacts((previous) => !previous)}
          aria-expanded={showContacts}
        >
          {showContacts ? "Hide contacts" : "Contact"}
        </button>
      </div>

      {showContacts && (
        <div className={styles.contactDetails}>
          {notice.user.phone && (
            <a href={`tel:${notice.user.phone}`}>
              {notice.user.phone}
            </a>
          )}

          {notice.user.email && (
            <a href={`mailto:${notice.user.email}`}>
              {notice.user.email}
            </a>
          )}
        </div>
      )}
    </Modal>
  );
}