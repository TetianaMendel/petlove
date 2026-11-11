"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";

import Modal from "../Modal/Modal";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearAuth } from "@/lib/store/authSlice";
import { logout } from "@/lib/clientApi";

import css from "./ModalApproveAction.module.css";

interface ModalApproveActionProps {
  onClose: () => void;
}

export default function ModalApproveAction({
  onClose,
}: ModalApproveActionProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await logout();
      toast.success("You have logged out successfully.");
    } catch {
      toast.error("Failed to complete the session on the server.");
    } finally {
      dispatch(clearAuth());
      onClose();
      router.replace("/home");
    }
  };

  return (
    <Modal onClose={onClose} className={css.approveModal}>
      <div className={css.avatarContainer}>
        <Image
          src="/images/cat.png"
          alt="Cat"
          width={44}
          height={44}
          className={css.catImage}
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        className={css.closeButton}
        aria-label="Close modal"
        disabled={isLoading}
      >
        <RxCross2
          className={css.closeIcon}
          aria-hidden="true"
        />
      </button>

      <p className={css.confirmationText}>
        Already leaving?
      </p>

      <div className={css.actionButtons}>
        <button
          type="button"
          onClick={handleLogout}
          className={css.confirmButton}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Yes"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className={css.cancelButton}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}