import type { Notice } from "@/types/notices";
import styles from "./NoticesList.module.css";
import NoticesItem from "../NoticesItem/NoticesItem";

interface NoticesListProps {
  notices: Notice[];
}

export default function NoticesList({
  notices,
}: NoticesListProps) {
  return (
    <ul className={styles.list}>
      {notices.map((notice) => (
        <li key={notice._id}>
          <NoticesItem notice={notice} />
        </li>
      ))}
    </ul>
  );
}