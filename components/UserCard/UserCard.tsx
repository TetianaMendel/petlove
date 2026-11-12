"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiUser, FiEdit2 } from "react-icons/fi";
import { useAppSelector } from "@/lib/store/hooks";
import { fetchFullUser } from "@/lib/clientApi";
import UserBlock from "@/components/UserBlock/UserBlock";
import PetsBlock from "@/components/PetsBlock/PetsBlock";
import styles from "./UserCard.module.css";
import LogOutBtn from "@/components/LogOutBtn/LogOutBtn";
import ModalEditUser from "@/components/ModalEditUser/ModalEditUser";

export default function UserCard() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const {
    data: fullUser,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["full-user", user?.email],
    queryFn: fetchFullUser,
    enabled: Boolean(user),
  });

  return (
    <>
      <div className={styles.userHeader}>
        <div className={styles.userBadge}>
          <span>User</span>
          <FiUser size={18} aria-hidden="true" />
        </div>

        <button
          type="button"
          className={styles.editButton}
          aria-label="Edit profile"
          onClick={() => setIsEditOpen(true)}
        >
          <FiEdit2 size={18} aria-hidden="true" />
        </button>
      </div>

      <UserBlock user={fullUser ?? user} />

      {isPending ? (
        <p>Loading pets...</p>
      ) : isError ? (
        <p>Failed to load pets.</p>
      ) : (
        <PetsBlock pets={fullUser.pets ?? []} />
      )}

      <LogOutBtn variant="profile" />
      {isEditOpen && (
  <ModalEditUser onClose={() => setIsEditOpen(false)} />
)}
    </>
  );
}