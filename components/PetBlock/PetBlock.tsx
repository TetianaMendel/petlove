import Image from "next/image";
import css from "./PetBlock.module.css";

export default function PetBlock() {
  return (
    <picture>
      <source
        media="(min-width: 1280px)"
        srcSet="/images/desc_reg.webp"
      />

      <source
        media="(min-width: 768px)"
        srcSet="/images/tabl_reg.webp"
      />

      <Image
        src="/images/mob_reg.webp"
        alt="Orange cat"
        width={335}
        height={280}
        sizes="100vw"
        className={css.image}
        priority
      />
    </picture>
  );
}