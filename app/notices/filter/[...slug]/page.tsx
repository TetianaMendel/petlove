import { notFound } from "next/navigation";
import NoticesContent from "@/components/NoticesContent/NoticesContent";
import type { NoticeCategory } from "@/types/notices";
import styles from "../../page.module.css";

type Props = {
  params: Promise<{ slug: string[] }>;
};

const validCategories: NoticeCategory[] = [
  "found",
  "free",
  "lost",
  "sell",
];

export default async function NoticesByCategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  if (slug.length !== 1) {
    notFound();
  }

  const value = slug[0];

  if (
    value !== "all" &&
    !validCategories.includes(value as NoticeCategory)
  ) {
    notFound();
  }

  const category =
    value === "all"
      ? undefined
      : (value as NoticeCategory);

  return (
    <section className={styles.notices}>
      <div className="container">
        <NoticesContent initialCategory={category} />
      </div>
    </section>
  );
}