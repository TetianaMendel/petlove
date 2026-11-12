
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import type { Pet } from "@/types/pet";
import PetsList from "@/components/PetsList/PetsList";
import styles from "./PetsBlock.module.css";

interface PetsBlockProps {
  pets: Pet[];
}

export default function PetsBlock({ pets }: PetsBlockProps) {
  return (
    <div className={styles.petsBlock}>
      <div className={styles.petsHeader}>
        <h2 className={styles.petsTitle}>My pets</h2>

        <Link href="/add-pet" className={styles.addPetButton}>
          <span>Add pet</span>
          <FiPlus
            className={styles.addPetIcon}
            aria-hidden="true"
          />
        </Link>
      </div>

      <PetsList pets={pets} />
    </div>
  );
}