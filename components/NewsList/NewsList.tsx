import type { NewsItem } from "@/types/news";
import NewsCard from "@/components/NewsCard/NewsCard";
import styles from "./NewsList.module.css";

interface NewsListProps {
  news: NewsItem[];
}

export default function NewsList({ news }: NewsListProps) {
  return (
    <ul className={styles.list}>
      {news.map((item, index) => (
        <li key={item._id} className={styles.item}>
          <NewsCard
            news={item}
            priority={index === 0}
          />
        </li>
      ))}
    </ul>
  );
}