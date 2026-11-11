"use client";

import { useEffect } from "react";
import axios from "axios";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  setUser,
  clearAuth,
  finishAuthChecking,
} from "@/lib/store/authSlice";
import type { User } from "@/types/user";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const controller = new AbortController();

    async function restoreSession() {
      try {
        const response = await axios.get<User>(
          "/api/auth/current",
          { signal: controller.signal }
        );

        if (!controller.signal.aborted) {
          dispatch(setUser(response.data));
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          dispatch(clearAuth());
        } else {
          dispatch(finishAuthChecking());
        }
      }
    }

    restoreSession();

    return () => controller.abort();
  }, [dispatch]);

  return null;
}