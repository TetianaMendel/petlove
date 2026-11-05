import NewsContent from "@/components/NewsContent/NewsContent";
import styles from "./page.module.css";

export default function NewsPage() {
  return (
    <section className={styles.news}>
      <div className="container">
        <div className={styles.top}>
          <h1 className={styles.title}>News</h1>
        </div>

        <NewsContent />
      </div>
    </section>
  );
}