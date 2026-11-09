import Image from "next/image";
import Link from "next/link";

import PetBlock from "@/components/PetBlock/PetBlock";
import Title from "@/components/Title/Title";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";

import css from "./SignUpPage.module.css";

export default function RegisterPage() {
  return (
    <section className={css.registrationSection}>
      <div className="container">
        <div className={css.registrationLayout}>
          <div className={css.petVisual}>
            <PetBlock />

            <div className={css.petDetailsCard}>
              <div className={css.petAvatar}>
                <Image
                  src="/images/cat.png"
                  alt="Cat avatar"
                  width={32}
                  height={32}
                />
              </div>

              <div className={css.petDetails}>
                <div className={css.petHeading}>
                  <span className={css.petName}>Jack</span>

                  <span className={css.petBirthday}>
                    Birthday: 18.10.2021
                  </span>
                </div>

                <p className={css.petDescription}>
                  Jack is a gray Persian cat with green eyes.
                  He loves to be pampered and groomed,
                  and enjoys playing with toys.
                </p>
              </div>
            </div>
          </div>

          <div className={css.registrationPanel}>
            <div className={css.registrationContent}>
              <Title>Registration</Title>

              <p className={css.introText}>
                Thank you for your interest in our platform.
              </p>

              <RegistrationForm />

              <p className={css.loginPrompt}>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className={css.loginAnchor}
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}