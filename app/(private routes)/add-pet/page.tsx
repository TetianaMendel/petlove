
import PetBlock from "@/components/PetBlock/PetBlock";
import AddPetForm from "@/components/AddPetForm/AddPetForm";
import styles from "./AddPetPage.module.css";

export default function AddPetPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.imageWrapper}>
            <PetBlock variant="addPet" />
          </div>

          <AddPetForm />
        </div>
      </div>
    </main>
  );
}