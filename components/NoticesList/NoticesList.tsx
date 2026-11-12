import type { Notice } from "@/types/notices";
import NoticesItem from "@/components/NoticesItem/NoticesItem";
import styles from "./NoticesList.module.css";

interface NoticesListProps {
  notices: Notice[];
  favoriteIds: string[];
}

export default function NoticesList({
  notices,
  favoriteIds,
}: NoticesListProps) {
  return (
    <ul className={styles.list}>
      {notices.map((notice) => (
        <li key={notice._id}>
          <NoticesItem
            notice={notice}
            isFavorite={favoriteIds.includes(notice._id)}
          />
        </li>
      ))}
    </ul>
  );
}