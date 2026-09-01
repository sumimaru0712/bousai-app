"use client";

import { useEffect } from "react";
import { useAppState } from "@/lib/AppStateContext";

export function RoleThemeProvider() {
  const { state } = useAppState();

  useEffect(() => {
    document.documentElement.dataset.role = state.currentRole;
  }, [state.currentRole]);

  return null;
}
