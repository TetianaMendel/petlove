import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <section className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Take good <span>care</span> of your small pets
          </h1>

          <p className={styles.description}>
            Choosing a pet for your home is a choice
            that is meant to enrich your life with
            immeasurable joy and tenderness.
          </p>
        </div>
      </div>

      <div className={styles.imageWrapper}>
        <picture>
          <source
            media="(min-width: 1280px)"
            srcSet="/images/home-desktop.jpg"
          />
          <source
            media="(min-width: 768px)"
            srcSet="/images/home-tablet.jpg"
          />
          <Image
            src="/images/home-mobile.jpg"
            alt="Woman embracing a dog"
            width={335}
            height={402}
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 704px, 1216px"
            className={styles.image}
            priority
          />
        </picture>
      </div>
    </section>
  );
}