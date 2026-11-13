"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const isAuthChecking = useAppSelector(
    (state) => state.auth.isAuthChecking
  );

  useEffect(() => {
    if (!isAuthChecking && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthChecking, isAuthenticated, router]);

  if (isAuthChecking || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}