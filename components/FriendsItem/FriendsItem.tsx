import Image from "next/image";
import type { Friend } from "@/types/friends";
import css from "./FriendsItem.module.css";

interface FriendsItemProps {
  friend: Friend;
}

export default function FriendsItem({ friend }: FriendsItemProps) {
  const workDay = friend.workDays?.find(
    (day) => day.isOpen && day.from && day.to
  );

  const workTime = workDay
    ? `${workDay.from} - ${workDay.to}`
    : "Day and night";

  return (
    <article className={css.card}>
      <p className={css.work}>{workTime}</p>

      <div className={css.photoWrapper}>
        <Image
          src={friend.imageUrl}
          alt={friend.title}
          fill
          className={css.photo}
          sizes="(min-width: 768px) 90px, 80px"
        />
      </div>

      <div className={css.content}>
        {friend.url ? (
          <a
            href={friend.url}
            target="_blank"
            rel="noopener noreferrer"
            className={css.title}
          >
            {friend.title}
          </a>
        ) : (
          <p className={css.title}>{friend.title}</p>
        )}

        <div className={css.addresWrap}>
          {friend.email ? (
            <a
              href={`mailto:${friend.email}`}
              className={css.address}
            >
              <span className={css.addressAccent}>
                Email:{" "}
              </span>
              {friend.email}
            </a>
          ) : (
            <p className={css.addressEmpty}>
              <span className={css.addressAccent}>
                Email:{" "}
              </span>
              {friend.phone ? "phone only" : "website only"}
            </p>
          )}

          {friend.address ? (
            friend.addressUrl ? (
              <a
                href={friend.addressUrl}
                className={css.address}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={css.addressAccent}>
                  Address:{" "}
                </span>
                {friend.address}
              </a>
            ) : (
              <p className={css.addressEmpty}>
                <span className={css.addressAccent}>
                  Address:{" "}
                </span>
                {friend.address}
              </p>
            )
          ) : (
            <p className={css.addressEmpty}>
              <span className={css.addressAccent}>
                Address:{" "}
              </span>
              website only
            </p>
          )}

          {friend.phone ? (
            <a
              href={`tel:${friend.phone}`}
              className={css.address}
            >
              <span className={css.addressAccent}>
                Phone:{" "}
              </span>
              {friend.phone}
            </a>
          ) : (
            <p className={css.addressEmpty}>
              <span className={css.addressAccent}>
                Phone:{" "}
              </span>
              {friend.email ? "email only" : "website only"}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}