
"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiTrash2 } from "react-icons/fi";
import { LuPawPrint } from "react-icons/lu";
import { useAppSelector } from "@/lib/store/hooks";
import { removePet } from "@/lib/clientApi";
import type { Pet } from "@/types/pet";
import styles from "./PetsItem.module.css";

interface PetsItemProps {
  pet: Pet;
}

const ALLOWED_IMAGE_HOSTS = [
  "petlove.b.goit.study",
  "www.nytimes.com",
  "media4.giphy.com",
  "ftp.goit.study",
  "res.cloudinary.com",
];

const isAllowedImageHost = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);

    return (
      parsedUrl.protocol === "https:" &&
      ALLOWED_IMAGE_HOSTS.includes(parsedUrl.hostname)
    );
  } catch {
    return false;
  }
};

export default function PetsItem({ pet }: PetsItemProps) {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);

  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(
    null
  );

  const { mutate: deletePet, isPending } = useMutation({
    mutationFn: removePet,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["full-user", user?.email],
      });
    },
    onError: (error) => {
      console.error("Failed to delete pet:", error);
    },
  });

  const formattedBirthday = pet.birthday
    ? pet.birthday.slice(0, 10).split("-").reverse().join(".")
    : "Unknown";

  const formatValue = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);

  const handleDelete = () => {
    deletePet(pet._id);
  };

  const showImage =
    Boolean(pet.imgURL) && failedImageUrl !== pet.imgURL;

  return (
    <article className={styles.petCard}>
      <div className={styles.petImageWrapper}>
        {showImage ? (
          <Image
            key={pet.imgURL}
            src={pet.imgURL}
            alt={pet.name}
            width={66}
            height={66}
            unoptimized={!isAllowedImageHost(pet.imgURL)}
            className={styles.petImage}
            onError={() => setFailedImageUrl(pet.imgURL)}
          />
        ) : (
          <LuPawPrint
            size={32}
            color="#f6b83d"
            aria-label="Pet photo unavailable"
          />
        )}
      </div>

      <div className={styles.petContent}>
        <h3 className={styles.petTitle}>{pet.title}</h3>

        <ul className={styles.petDetails}>
          <li className={styles.petDetail}>
            <span className={styles.detailLabel}>Name</span>
            <span className={styles.detailValue}>
              {pet.name}
            </span>
          </li>

          <li className={styles.petDetail}>
            <span className={styles.detailLabel}>Birthday</span>
            <span className={styles.detailValue}>
              {formattedBirthday}
            </span>
          </li>

          <li className={styles.petDetail}>
            <span className={styles.detailLabel}>Sex</span>
            <span className={styles.detailValue}>
              {formatValue(pet.sex)}
            </span>
          </li>

          <li className={styles.petDetail}>
            <span className={styles.detailLabel}>Species</span>
            <span className={styles.detailValue}>
              {formatValue(pet.species)}
            </span>
          </li>
        </ul>
      </div>

      <button
        type="button"
        className={styles.deleteButton}
        aria-label={`Delete ${pet.name}`}
        onClick={handleDelete}
        disabled={isPending}
      >
        <FiTrash2
          className={styles.deleteIcon}
          aria-hidden="true"
        />
      </button>
    </article>
  );
}