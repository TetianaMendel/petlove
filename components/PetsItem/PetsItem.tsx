"use client";

import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiTrash2 } from "react-icons/fi";
import { useAppSelector } from "@/lib/store/hooks";
import { removePet } from "@/lib/clientApi";
import type { Pet } from "@/types/pet";
import styles from "./PetsItem.module.css";

interface PetsItemProps {
  pet: Pet;
}

export default function PetsItem({ pet }: PetsItemProps) {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);

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

  return (
    <article className={styles.petCard}>
      <div className={styles.petImageWrapper}>
        <Image
          src={pet.imgURL}
          alt={pet.name}
          fill
          className={styles.petImage}
          sizes="66px"
        />
      </div>

      <div className={styles.petContent}>
        <h3 className={styles.petTitle}>{pet.title}</h3>

        <ul className={styles.petDetails}>
          <li className={styles.petDetail}>
            <span className={styles.detailLabel}>Name</span>
            <span className={styles.detailValue}>{pet.name}</span>
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