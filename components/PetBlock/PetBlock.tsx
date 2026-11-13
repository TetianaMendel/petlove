import Image from "next/image";
import css from "./PetBlock.module.css";

interface PetBlockProps {
  variant?: "register" | "login" | "addPet";
}

export default function PetBlock({
  variant = "register",
}: PetBlockProps) {
  const isLogin = variant === "login";
  const isAddPet = variant === "addPet";

  const desktopImage = isAddPet
  ? "/images/addPets_desc.webp"
  : isLogin
    ? "/images/desc_log.webp"
    : "/images/desc_reg.webp";

const tabletImage = isAddPet
  ? "/images/addPets_tab.webp"
  : isLogin
    ? "/images/tabl_log.webp"
    : "/images/tabl_reg.webp";

const mobileImage = isAddPet
  ? "/images/addPets_mob.webp"
  : isLogin
    ? "/images/mob_log.webp"
    : "/images/mob_reg.webp";

  return (
    <picture>
      <source
        media="(min-width: 1280px)"
        srcSet={desktopImage}
      />

      <source
        media="(min-width: 768px)"
        srcSet={tabletImage}
      />

      <Image
        src={mobileImage}
        alt={isAddPet ? "Pet" : isLogin ? "Dog" : "Orange cat"}
        width={335}
        height={280}
        sizes="100vw"
        className={css.image}
        priority
      />
    </picture>
  );
}