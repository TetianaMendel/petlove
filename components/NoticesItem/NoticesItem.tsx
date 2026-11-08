import Image from "next/image";
import type { Notice } from "@/types/notices";
import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import styles from "./NoticesItem.module.css";

interface NoticesItemProps {
  notice: Notice;
}

export default function NoticesItem({
  notice,
}: NoticesItemProps) {
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
  ? new Date(birthday).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, ".")
  : "Unknown";

  return (
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
          <h2 className={styles.title}>{title}</h2>

          <span className={styles.popularity}>
            <FaStar size={16} aria-hidden="true" />
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

        <p className={styles.comment}>{comment}</p>

        <div className={styles.footer}>
          <p className={styles.price}>
            {price != null ? `$${price.toFixed(2)}` : "\u00A0"}
          </p>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.learnMore}
            >
              Learn more
            </button>

            <button
              type="button"
              className={styles.favorite}
              aria-label="Add to favorites"
            >
              <FiHeart size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}