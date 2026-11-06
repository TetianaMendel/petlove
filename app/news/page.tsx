

import NewsContent from "@/components/NewsContent/NewsContent";
import styles from "./page.module.css";

export default function NewsPage() {
  return (
    <section className={styles.news}>
      <div className="container">
        <NewsContent />
      </div>
    </section>
  );
}