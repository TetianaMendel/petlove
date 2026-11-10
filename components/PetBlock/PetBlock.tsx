import Image from "next/image";
import css from "./PetBlock.module.css";

interface PetBlockProps {
  variant?: "register" | "login";
}

export default function PetBlock({
  variant = "register",
}: PetBlockProps) {
  const isLogin = variant === "login";

  return (
    <picture>
      <source
        media="(min-width: 1280px)"
        srcSet={
          isLogin
            ? "/images/desc_log.webp"
            : "/images/desc_reg.webp"
        }
      />

      <source
        media="(min-width: 768px)"
        srcSet={
          isLogin
            ? "/images/tabl_log.webp"
            : "/images/tabl_reg.webp"
        }
      />

      <Image
        src={
          isLogin
            ? "/images/mob_log.webp"
            : "/images/mob_reg.webp"
        }
        alt={isLogin ? "Dog" : "Orange cat"}
        width={335}
        height={280}
        sizes="100vw"
        className={css.image}
        priority
      />
    </picture>
  );
}