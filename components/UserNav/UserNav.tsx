"use client";

import { usePathname } from "next/navigation";

import UserBar from "../UserBar/UserBar";
import LogOutBtn from "../LogOutBtn/LogOutBtn";
import css from "./UserNav.module.css";

type UserNavProps = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export default function UserNav({
  variant = "desktop",
  onNavigate,
}: UserNavProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/home";

  return (
    <div className={`${css.userNav} ${css[variant]}`}>
      {!isHomePage && <LogOutBtn variant={variant} />}

      <UserBar onNavigate={onNavigate} />
    </div>
  );
}