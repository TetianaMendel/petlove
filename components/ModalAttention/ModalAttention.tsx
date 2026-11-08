"use client";

import Image from "next/image";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import Modal from "../Modal/Modal";
import css from "./ModalAttention.module.css";

interface ModalAttentionProps {
  onClose: () => void;
}

export default function ModalAttention({
  onClose,
}: ModalAttentionProps) {
  return (
    <Modal
      onClose={onClose}
      className={css.modalAttention}
    >
      <div className={css.cardImage}>
        <div className={css.imageWrap}>
          <Image
            src="/images/dog.png"
            alt="Dog"
            width={80}
            height={80}
            className={css.image}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className={css.modalClose}
        aria-label="Close modal"
      >
        <RxCross2
          size={24}
          className={css.icon_close}
          aria-hidden="true"
        />
      </button>

      <h2 className={css.modalTitle}>
        Attention
      </h2>

      <p className={css.modalText}>
        We would like to remind you that certain
        functionality is available only to authorized
        users. If you have an account, please log in
        with your credentials. If you do not already
        have an account, you must register to access
        these features.
      </p>

      <div className={css.modalActions}>
        <Link
          href="/login"
          onClick={onClose}
          className={css.buttonLogin}
        >
          Log in
        </Link>

        <Link
          href="/register"
          onClick={onClose}
          className={css.buttonReg}
        >
          Registration
        </Link>
      </div>
    </Modal>
  );
}