import NoticesContent from "@/components/NoticesContent/NoticesContent";
import styles from "./page.module.css";

export default function NoticesPage() {
  return (
    <section className={styles.notices}>
      <div className="container">
        <NoticesContent />
      </div>
    </section>
  );
}