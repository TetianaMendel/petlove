import Image from "next/image";
import type { NewsItem } from "@/types/news";
import styles from "./NewsCard.module.css";

interface NewsCardProps {
  news: NewsItem;
  priority?: boolean;
}

export default function NewsCard({
  news,
  priority = false,
}: NewsCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={news.imgUrl}
          alt={news.title}
          fill
          sizes="(min-width: 1280px) 361px, (min-width: 768px) 50vw, 100vw"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.text}>
          <h2 className={styles.title}>{news.title}</h2>
          <p className={styles.description}>{news.text}</p>
        </div>

        <div className={styles.footer}>
          <time dateTime={news.date}>
            {new Date(news.date).toLocaleDateString("en-GB")}
          </time>

          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Read more
          </a>
        </div>
      </div>
    </article>
  );
}