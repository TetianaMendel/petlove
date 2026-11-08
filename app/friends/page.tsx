import Title from "@/components/Title/Title";
import FriendsList from "@/components/FriendsList/FriendsList";
import styles from "./page.module.css";

export default function FriendsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.titleWrapper}>
        <Title>Our friends</Title>
      </div>

      <FriendsList />
    </main>
  );
}