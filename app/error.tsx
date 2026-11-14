"use client";

import { useEffect } from "react";
import css from "./Error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className={css.error}>
      <div className="container">
        <h1 className={css.title}>
          Oops, an error occurred!
        </h1>

        <p className={css.text}>
          Failed to load the page. Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className={css.button}
        >
          Try again
        </button>
      </div>
    </section>
  );
}