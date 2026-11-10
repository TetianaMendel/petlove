import Image from "next/image";
import Link from "next/link";

import PetBlock from "@/components/PetBlock/PetBlock";
import Title from "@/components/Title/Title";
import LoginForm from "@/components/LoginForm/LoginForm";

import css from "./LoginPage.module.css";

export default function LoginPage() {
  return (
    <section className={css.page}>
      <div className="container">
        <div className={css.wrapper}>
          <div className={css.imageWrapper}>
            <PetBlock variant="login" />

            <div className={css.card}>
              <div className={css.cardImage}>
                <Image
                  src="/images/dog.png"
                  alt="Rich the dog"
                  width={32}
                  height={32}
                  className={css.image}
                />
              </div>

              <div className={css.cardInfo}>
                <div className={css.cardName}>
                  <span className={css.catName}>Rich</span>

                  <span className={css.catBrthd}>
                    <span className={css.catBrthd_accent}>
                      Birthday:{" "}
                    </span>
                    21.09.2020
                  </span>
                </div>

                <p className={css.catDescr}>
                  Rich would be the perfect addition to an
                  active family that loves to play and go
                  on walks. I bet he would love having a
                  doggy playmate too!
                </p>
              </div>
            </div>
          </div>

          <div className={css.formWrapper}>
            <div className={css.formContent}>
              <Title>Log in</Title>

              <p className={css.description}>
                Welcome! Please enter your credentials
                to login to the platform:
              </p>

              <LoginForm />

              <p className={css.switchText}>
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className={css.switchLink}
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}