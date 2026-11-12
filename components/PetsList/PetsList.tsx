import type { Pet } from "@/types/pet";
import PetsItem from "@/components/PetsItem/PetsItem";
import styles from "./PetsList.module.css";

interface PetsListProps {
  pets: Pet[];
}

export default function PetsList({ pets }: PetsListProps) {
  if (pets.length === 0) {
    return (
      <p className={styles.emptyMessage}>
        You haven&apos;t added any pets yet.
      </p>
    );
  }

  return (
    <ul className={styles.petsList}>
      {pets.map((pet) => (
        <li key={pet._id} className={styles.petsListItem}>
          <PetsItem pet={pet} />
        </li>
      ))}
    </ul>
  );
}