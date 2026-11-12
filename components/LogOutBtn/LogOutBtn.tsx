"use client";

import { useState } from "react";
import ModalApproveAction from "../ModalApproveAction/ModalApproveAction";
import css from "./LogOutBtn.module.css";

type LogOutBtnProps = {
  variant?: "desktop" | "mobile" | "profile";
};

export default function LogOutBtn({
  variant = "desktop",
}: LogOutBtnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`${css.logoutButton} ${css[variant]}`}
        onClick={() => setIsModalOpen(true)}
      >
        LOG OUT
      </button>

      {isModalOpen && (
        <ModalApproveAction
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}