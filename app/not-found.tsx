import Image from "next/image";
import Link from "next/link";
import css from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={css.page}>
      <div className="container">
        <div className={css.content}>
          <div className={css.code}>
            <p className={css.codeNumber}>4</p>

            <div className={css.photoWrap}>
              <Image
                src="/images/404_page.png"
                alt="This page not found"
                fill
                className={css.photo}
                sizes="(min-width: 768px) 280px, 109px"
                priority
              />
            </div>

            <p className={css.codeNumber}>4</p>
          </div>

          <div className={css.textWrap}>
            <h1 className={css.title}>
              Ooops! This page not found :(
            </h1>

            <Link href="/home" className={css.homeLink}>
              To home page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}